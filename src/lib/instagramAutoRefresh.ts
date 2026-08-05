import { prisma } from "@/lib/prisma";

// Meta tokens expire in 60 days. Auto-refresh ONLY triggers when token is at least 45 days old (about to expire in 15 days).
const EXPIRING_THRESHOLD_MS = 45 * 24 * 60 * 60 * 1000; // 45 days

export async function checkAndAutoRefreshToken(
  content: Record<string, any>,
  pageSlug: string = "events",
  sectionType: string = "EventsArchive"
): Promise<Record<string, any>> {
  if (!content || typeof content !== "object") return content;

  const token = content.instagramToken;
  if (!token || typeof token !== "string" || !token.trim()) {
    return content;
  }

  const now = Date.now();

  // If lastRefreshedAt is not set, initialize it to NOW (assuming it's a newly added valid token)
  if (!content.lastRefreshedAt) {
    const initializedContent = {
      ...content,
      lastRefreshedAt: now,
    };
    try {
      const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
      if (page) {
        const existingSection = await prisma.section.findFirst({
          where: { pageId: page.id, type: sectionType },
        });
        if (existingSection) {
          await prisma.section.update({
            where: { id: existingSection.id },
            data: { content: initializedContent },
          });
        }
      }
    } catch (e) {
      console.error("[Auto-Refresh] Error initializing lastRefreshedAt:", e);
    }
    return initializedContent;
  }

  const lastRefreshed = Number(content.lastRefreshedAt);

  // If token is still fresh (less than 45 days old), DO NOT REFRESH. Token is active and valid.
  if (now - lastRefreshed < EXPIRING_THRESHOLD_MS) {
    return content;
  }

  // Token is 45+ days old and about to expire in ~15 days. Attempt auto-refresh.
  try {
    const trimmedToken = token.trim();
    let newToken: string | null = null;

    // 1. Try Instagram Refresh Access Token Endpoint
    const igUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(
      trimmedToken
    )}`;
    const igRes = await fetch(igUrl);
    const igData = await igRes.json();

    if (igData.access_token) {
      newToken = igData.access_token;
    } else {
      // 2. Try Facebook Exchange Token Endpoint
      const fbUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&fb_exchange_token=${encodeURIComponent(
        trimmedToken
      )}`;
      const fbRes = await fetch(fbUrl);
      const fbData = await fbRes.json();

      if (fbData.access_token) {
        newToken = fbData.access_token;
      }
    }

    if (newToken) {
      const updatedContent = {
        ...content,
        instagramToken: newToken,
        lastRefreshedAt: now,
      };

      // Save updated token to Database directly
      const page = await prisma.page.findUnique({
        where: { slug: pageSlug },
      });

      if (page) {
        const existingSection = await prisma.section.findFirst({
          where: { pageId: page.id, type: sectionType },
        });

        if (existingSection) {
          await prisma.section.update({
            where: { id: existingSection.id },
            data: { content: updatedContent },
          });
          console.log("[Auto-Refresh] Token was about to expire. Successfully auto-refreshed and saved to DB.");
        }
      }

      return updatedContent;
    } else {
      console.warn("[Auto-Refresh] Unable to auto-refresh token nearing expiration:", igData.error || "Unknown error");
    }
  } catch (err) {
    console.error("[Auto-Refresh] Failed to auto-refresh Instagram token:", err);
  }

  return content;
}
