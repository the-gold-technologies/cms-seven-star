import { PrismaClient } from "@prisma/client";
import { deleteFromCloudinary } from "@/lib/cloudinary";

const globalForPrisma = global as unknown as { prisma: unknown };

const rawPrisma = new PrismaClient({
  log: ["query"],
});

async function deleteFromSupabase(url: string) {
  if (!url) return;
  if (url.includes("cloudinary.com")) {
    await deleteFromCloudinary(url);
  }
}

function findSupabaseUrls(obj: unknown): string[] {
  const urls: string[] = [];
  if (typeof obj === "string") {
    if (obj.includes("res.cloudinary.com")) {
      urls.push(obj);
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      urls.push(...findSupabaseUrls(item));
    }
  } else if (obj && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      urls.push(...findSupabaseUrls(record[key]));
    }
  }
  return urls;
}

const extendedPrisma = rawPrisma.$extends({
  query: {
    page: {
      async update({ args, query }) {
        const oldPage = await rawPrisma.page.findUnique({
          where: args.where,
          select: { featuredImage: true, ogImage: true },
        });

        const result = await query(args);

        if (oldPage) {
          const newFeatured = (result as { featuredImage?: string | null })
            .featuredImage;
          const oldFeatured = oldPage.featuredImage;
          if (oldFeatured && oldFeatured !== newFeatured) {
            await deleteFromSupabase(oldFeatured);
          }

          const newOg = (result as { ogImage?: string | null }).ogImage;
          const oldOg = oldPage.ogImage;
          if (oldOg && oldOg !== newOg) {
            await deleteFromSupabase(oldOg);
          }
        }
        return result;
      },
      async upsert({ args, query }) {
        const oldPage = await rawPrisma.page.findUnique({
          where: args.where,
          select: { featuredImage: true, ogImage: true },
        });

        const result = await query(args);

        if (oldPage) {
          const newFeatured = (result as { featuredImage?: string | null })
            .featuredImage;
          const oldFeatured = oldPage.featuredImage;
          if (oldFeatured && oldFeatured !== newFeatured) {
            await deleteFromSupabase(oldFeatured);
          }

          const newOg = (result as { ogImage?: string | null }).ogImage;
          const oldOg = oldPage.ogImage;
          if (oldOg && oldOg !== newOg) {
            await deleteFromSupabase(oldOg);
          }
        }
        return result;
      },
      async delete({ args, query }) {
        const oldPage = await rawPrisma.page.findUnique({
          where: args.where,
          select: {
            featuredImage: true,
            ogImage: true,
            sections: { select: { content: true } },
          },
        });

        const result = await query(args);

        if (oldPage) {
          if (oldPage.featuredImage)
            await deleteFromSupabase(oldPage.featuredImage);
          if (oldPage.ogImage) await deleteFromSupabase(oldPage.ogImage);
          if (oldPage.sections) {
            for (const section of oldPage.sections) {
              const urls = findSupabaseUrls(section.content);
              for (const url of urls) {
                await deleteFromSupabase(url);
              }
            }
          }
        }
        return result;
      },
    },
    globalConfig: {
      async update({ args, query }) {
        const oldConfig = await rawPrisma.globalConfig.findUnique({
          where: args.where,
          select: { favicon: true },
        });

        const result = await query(args);

        if (oldConfig) {
          const newFavicon = (result as { favicon?: string | null }).favicon;
          const oldFavicon = oldConfig.favicon;
          if (oldFavicon && oldFavicon !== newFavicon) {
            await deleteFromSupabase(oldFavicon);
          }
        }
        return result;
      },
      async upsert({ args, query }) {
        const oldConfig = await rawPrisma.globalConfig.findUnique({
          where: args.where,
          select: { favicon: true },
        });

        const result = await query(args);

        if (oldConfig) {
          const newFavicon = (result as { favicon?: string | null }).favicon;
          const oldFavicon = oldConfig.favicon;
          if (oldFavicon && oldFavicon !== newFavicon) {
            await deleteFromSupabase(oldFavicon);
          }
        }
        return result;
      },
    },
    user: {
      async update({ args, query }) {
        const oldUser = await rawPrisma.user.findUnique({
          where: args.where,
          select: { image: true },
        });

        const result = await query(args);

        if (oldUser) {
          const newImg = (result as { image?: string | null }).image;
          const oldImg = oldUser.image;
          if (oldImg && oldImg !== newImg) {
            await deleteFromSupabase(oldImg);
          }
        }
        return result;
      },
    },
    section: {
      async update({ args, query }) {
        const oldSection = await rawPrisma.section.findUnique({
          where: args.where,
          select: { content: true },
        });

        const result = await query(args);

        if (oldSection && args.data.content !== undefined) {
          const oldUrls = findSupabaseUrls(oldSection.content);
          const newUrls = findSupabaseUrls(
            (result as { content?: unknown }).content,
          );
          const orphanedUrls = oldUrls.filter((url) => !newUrls.includes(url));

          for (const url of orphanedUrls) {
            await deleteFromSupabase(url);
          }
        }
        return result;
      },
      async upsert({ args, query }) {
        const oldSection = await rawPrisma.section.findUnique({
          where: args.where,
          select: { content: true },
        });

        const result = await query(args);

        if (
          oldSection &&
          (args.update.content !== undefined ||
            args.create.content !== undefined)
        ) {
          const oldUrls = findSupabaseUrls(oldSection.content);
          const newUrls = findSupabaseUrls(
            (result as { content?: unknown }).content,
          );
          const orphanedUrls = oldUrls.filter((url) => !newUrls.includes(url));

          for (const url of orphanedUrls) {
            await deleteFromSupabase(url);
          }
        }
        return result;
      },
      async delete({ args, query }) {
        const oldSection = await rawPrisma.section.findUnique({
          where: args.where,
          select: { content: true },
        });

        const result = await query(args);

        if (oldSection) {
          const urls = findSupabaseUrls(oldSection.content);
          for (const url of urls) {
            await deleteFromSupabase(url);
          }
        }
        return result;
      },
    },
  },
});

export const prisma =
  (globalForPrisma.prisma as PrismaClient) || extendedPrisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
