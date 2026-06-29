import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";



function transformBlogPages(pages: any[]) {
  return pages.map(page => {
    const blogDetail = page.sections?.find((s: any) => s.type === "BlogDetail")?.content || {};
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      visibility: page.visibility,
      featuredImage: page.featuredImage,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImage: page.ogImage,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      excerpt: blogDetail.excerpt || "",
      content: blogDetail.content || "",
      area: blogDetail.area || "",
      readTime: blogDetail.readTime || "",
      tag: blogDetail.tag || "",
      views: blogDetail.views !== undefined ? blogDetail.views : 0,
      date: blogDetail.date || new Date(page.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };
  });
}

export async function GET(request: Request) {
  const session = await auth();
  
  try {
    const { searchParams } = new URL(request.url);
    const visibility = searchParams.get("visibility");

    const whereClause: any = { type: "blog" };
    
    if (!session) {
      whereClause.visibility = "published";
    } else if (visibility) {
      whereClause.visibility = visibility;
    }

    const pages = await prisma.page.findMany({
      where: whereClause,
      include: {
        sections: {
          where: { type: "BlogDetail" }
        }
      },
      orderBy: { createdAt: "desc" }
    });



    return NextResponse.json({ success: true, data: transformBlogPages(pages) });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

function sanitizeSpaces(str: string | null | undefined): string {
  if (!str) return "";
  return str.replace(/\u00a0/g, " ").replace(/&nbsp;/gi, " ");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    let {
      title,
      slug: customSlug,
      excerpt,
      content,
      image,
      area,
      readTime,
      tag,
      views = 0,
      visibility = "draft",
      date,
      metaTitle,
      metaDescription,
    } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Sanitize spaces to prevent text wrapping issues
    title = sanitizeSpaces(title);
    excerpt = sanitizeSpaces(excerpt);
    content = sanitizeSpaces(content);
    metaTitle = metaTitle ? sanitizeSpaces(metaTitle) : "";
    metaDescription = metaDescription ? sanitizeSpaces(metaDescription) : "";

    // Slug generation
    let slug = customSlug || title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        type: "blog",
        visibility,
        featuredImage: image || null,
        metaTitle: metaTitle || `${title} | Seven Stars`,
        metaDescription: metaDescription || excerpt,
      }
    });

    const section = await prisma.section.create({
      data: {
        pageId: page.id,
        type: "BlogDetail",
        content: {
          excerpt,
          content,
          area: area || "",
          readTime: readTime || "",
          tag: tag || "",
          views: Number(views),
          date: date || new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })
        },
        order: 0
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        visibility: page.visibility,
        featuredImage: page.featuredImage,
        excerpt,
        content,
        area,
        readTime,
        tag,
        views,
        date
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    let {
      id,
      title,
      slug,
      excerpt,
      content,
      image,
      area,
      readTime,
      tag,
      views,
      visibility,
      date,
      metaTitle,
      metaDescription,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is required" }, { status: 400 });
    }

    // Sanitize spaces to prevent text wrapping issues
    if (title) title = sanitizeSpaces(title);
    if (excerpt) excerpt = sanitizeSpaces(excerpt);
    if (content) content = sanitizeSpaces(content);
    if (metaTitle) metaTitle = sanitizeSpaces(metaTitle);
    if (metaDescription) metaDescription = sanitizeSpaces(metaDescription);

    const existingPage = await prisma.page.findUnique({
      where: { id },
      include: { sections: true }
    });

    if (!existingPage || existingPage.type !== "blog") {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    // Check slug collision if slug changed
    let finalSlug = slug || existingPage.slug;
    if (slug && slug !== existingPage.slug) {
      const collision = await prisma.page.findUnique({ where: { slug } });
      if (collision) {
        finalSlug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title: title || existingPage.title,
        slug: finalSlug,
        visibility: visibility || existingPage.visibility,
        featuredImage: image !== undefined ? image : existingPage.featuredImage,
        metaTitle: metaTitle !== undefined ? metaTitle : existingPage.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingPage.metaDescription,
      }
    });

    const existingSection = existingPage.sections.find(s => s.type === "BlogDetail");

    const sectionContent = {
      ...(existingSection?.content as Record<string, any> || {}),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(area !== undefined && { area }),
      ...(readTime !== undefined && { readTime }),
      ...(tag !== undefined && { tag }),
      ...(views !== undefined && { views: Number(views) }),
      ...(date !== undefined && { date })
    };

    if (existingSection) {
      await prisma.section.update({
        where: { id: existingSection.id },
        data: { content: sectionContent }
      });
    } else {
      await prisma.section.create({
        data: {
          pageId: updatedPage.id,
          type: "BlogDetail",
          content: sectionContent,
          order: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPage.id,
        title: updatedPage.title,
        slug: updatedPage.slug,
        visibility: updatedPage.visibility,
        featuredImage: updatedPage.featuredImage,
        ...sectionContent
      }
    });

  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
