import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        type: true,
        visibility: true,
      },
    });

    const links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    const servicesPage = await prisma.page.findUnique({
      where: { slug: "services" },
      include: {
        sections: true,
      },
    });

    const mergedData = links.map((link) => {
      const urlMatchesSlug = (url: string, slug: string) => {
        if (url === "/" && slug === "home") return true;
        return url === `/${slug}`;
      };

      // 1. Try to match with a regular page
      const matchedPage = pages.find((p) => urlMatchesSlug(link.url, p.slug));

      if (matchedPage) {
        return {
          id: link.id,
          pageId: matchedPage.id,
          title: link.label,
          slug: matchedPage.slug,
          metaTitle: matchedPage.metaTitle,
          metaDescription: matchedPage.metaDescription,
          type: link.type || matchedPage.type,
          visibility: matchedPage.visibility,
          parent: link.parent,
          order: link.order,
          description: link.description,
          navTitle: link.title,
          isStatic: link.isStatic,
        };
      }

      // 2. Try to match with a service sub-page
      if (link.url.startsWith("/service/") && servicesPage) {
        const serviceId = link.url.split("/service/")[1];
        const section = servicesPage.sections.find((s) => s.type === serviceId);
        if (section) {
          const content = section.content as any;
          return {
            id: link.id,
            pageId: `${servicesPage.id}-${serviceId}`,
            title: link.label,
            slug: link.url.replace(/^\//, ""),
            metaTitle: content.seo?.metaTitle || null,
            metaDescription: content.seo?.metaDescription || null,
            type: link.type || "sub-link",
            visibility: "published",
            parent: link.parent,
            order: link.order,
            description: link.description,
            navTitle: link.title,
            isStatic: link.isStatic,
          };
        }
      }

      // 3. Fallback for static/missing links
      return {
        id: link.id,
        pageId: null,
        title: link.label,
        slug: link.url === "/" ? "home" : link.url.replace(/^\//, ""),
        metaTitle: null,
        metaDescription: null,
        type: link.type || "static",
        visibility: "published",
        parent: link.parent,
        order: link.order,
        description: link.description,
        navTitle: link.title,
        isStatic: link.isStatic,
      };
    });

    // 4. Manually inject Christmas page details so it shows in the SEO CMS manager without having a NavLink
    const christmasPage = pages.find((p) => p.slug === "christmas");
    if (christmasPage) {
      const idx = mergedData.findIndex((m) => m.slug === "christmas");
      if (idx === -1) {
        mergedData.push({
          id: "christmas-seo-link-id",
          pageId: christmasPage.id,
          title: "Christmas",
          slug: christmasPage.slug,
          metaTitle: christmasPage.metaTitle,
          metaDescription: christmasPage.metaDescription,
          type: "Main Link",
          visibility: christmasPage.visibility,
          parent: "-",
          order: 6,
          description: "Configure dynamic metadata and SEO properties for the Christmas landing page.",
          navTitle: "Christmas",
          isStatic: true,
        });
      }
    }

    // 5. Inject Blog Parent Row & all child blog pages
    const parentBlogIdx = mergedData.findIndex((m) => m.slug === "blog");
    let blogParentId = "blog-seo-parent-id";
    if (parentBlogIdx === -1) {
      mergedData.push({
        id: blogParentId,
        pageId: null,
        title: "Blog Index",
        slug: "blog",
        metaTitle: "Blog & Guides | Seven Stars",
        metaDescription: "Read the Seven Stars blog for local guides, stories, and dining updates.",
        type: "Main Link",
        visibility: "published",
        parent: "-",
        order: 7,
        description: "Configure SEO and meta tags for the main Blog page.",
        navTitle: "Blog",
        isStatic: true,
      });
    } else {
      blogParentId = mergedData[parentBlogIdx].id;
    }

    const blogPages = pages.filter((p) => p.type === "blog");
    blogPages.forEach((blog) => {
      mergedData.push({
        id: blog.id,
        pageId: blog.id,
        title: blog.title || "Untitled Blog",
        slug: `blog/${blog.slug}`,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        type: "Blog Post",
        visibility: blog.visibility,
        parent: blogParentId,
        order: 0,
        description: `SEO Configuration for the blog post: "${blog.title}".`,
        navTitle: blog.title || "Untitled Blog",
        isStatic: false,
      });
    });

    return NextResponse.json({ success: true, data: mergedData });
  } catch (error) {
    console.error("Error fetching pages for SEO:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
