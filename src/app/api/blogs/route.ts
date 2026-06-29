import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const seedBlogs = [
  {
    title: "Looking for the Perfect Pub in Abingdon?",
    excerpt: "Just a short 10-minute drive from Abingdon-on-Thames, the Seven Stars at Marsh Baldon offers the ultimate countryside dining experience.",
    slug: "pub-in-abingdon",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish1.webp",
    area: "Abingdon",
    readTime: "3 min read",
    date: "22 Jun 2026",
    tag: "Local SEO / Abingdon",
    views: 89,
    content: "<p>Just a short 10-minute drive from Abingdon-on-Thames, the Seven Stars at Marsh Baldon offers the ultimate countryside dining experience.</p><p>Nested on the picturesque village green, Seven Stars is renowned for its welcoming atmosphere, premium craft beers, fine wines, and seasonally curated menus. Whether you are seeking a relaxed Sunday roast, a casual pint with friends, or a beautiful dining room to celebrate a special occasion, Seven Stars has it all.</p><p>We pride ourselves on using locally sourced ingredients from Oxfordshire's finest farms. Stop by and enjoy our spacious beer garden, cozy interiors, and unmatched hospitality.</p>"
  },
  {
    title: "The Best Gastro Pub Experience Near Wallingford",
    excerpt: "Discover why food enthusiasts from Wallingford make the short journey to Marsh Baldon for our seasonal dishes and premium drinks selection.",
    slug: "best-pub-in-wallingford",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish2.webp",
    area: "Wallingford",
    readTime: "3 min read",
    date: "20 Jun 2026",
    tag: "Dining / Wallingford",
    views: 112,
    content: "<p>Discover why food enthusiasts from Wallingford make the short journey to Marsh Baldon for our seasonal dishes and premium drinks selection.</p><p>We offer a unique twist on classic British pub cuisine, mixing traditional recipes with modern culinary execution. Our chef focuses on sustainability and freshness, crafting dishes that change with the seasons.</p><p>Come visit us and experience our selection of fine cask ales, hand-selected wines, and high-end gastro pub menu items.</p>"
  },
  {
    title: "Your Cozy Country Pub Retreat Near Kennington",
    excerpt: "Escaping the bustle of Kennington is easy. Find comfort in our cozy atmosphere, glowing fireplaces, and freshly prepared local produce.",
    slug: "pub-in-kennington",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish5.webp",
    area: "Kennington",
    readTime: "3 min read",
    date: "18 Jun 2026",
    tag: "Atmosphere / Kennington",
    views: 74,
    content: "<p>Escaping the bustle of Kennington is easy. Find comfort in our cozy atmosphere, glowing fireplaces, and freshly prepared local produce.</p><p>The Seven Stars offers a warm, countryside escape just minutes from the city. Relax in our comfortable lounges, enjoy a hearty meal, and let our friendly team look after you.</p>"
  },
  {
    title: "A Scenic Beer Garden & Dining Near Berinsfield",
    excerpt: "Looking for an exceptional pub near Berinsfield? Enjoy our beautiful, expansive beer garden overlooking the village green and premium cocktails.",
    slug: "pub-in-berinsfield",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish6.webp",
    area: "Berinsfield",
    readTime: "3 min read",
    date: "15 Jun 2026",
    tag: "Garden / Berinsfield",
    views: 95,
    content: "<p>Looking for an exceptional pub near Berinsfield? Enjoy our beautiful, expansive beer garden overlooking the village green and premium cocktails.</p><p>Perfect for long summer afternoons or crisp autumn evenings, our outdoor seating area is one of the best in the region. We serve fresh drinks, light bites, and full meals directly to our garden tables.</p>"
  },
  {
    title: "Exceptional Gastro Dining Near Stadhampton",
    excerpt: "Only minutes from Stadhampton, the Seven Stars features local craft beers, fine wines, and handcrafted menus from our talented kitchen team.",
    slug: "pub-in-stadhampton",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish7.webp",
    area: "Stadhampton",
    readTime: "3 min read",
    date: "12 Jun 2026",
    tag: "Gastronomy / Stadhampton",
    views: 103,
    content: "<p>Only minutes from Stadhampton, the Seven Stars features local craft beers, fine wines, and handcrafted menus from our talented kitchen team.</p><p>Our pub is the ideal meeting place for foodies and families alike, offering top-tier hospitality and gourmet dishes.</p>"
  },
  {
    title: "A Traditional British Pub Experience Near Dorchester",
    excerpt: "Steeped in history and charm, we invite visitors from Dorchester-on-Thames to relax with our selection of fine cask ales and classic pub food.",
    slug: "pub-in-dorchester",
    image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish8.webp",
    area: "Dorchester",
    readTime: "3 min read",
    date: "10 Jun 2026",
    tag: "Heritage / Dorchester",
    views: 120,
    content: "<p>Steeped in history and charm, we invite visitors from Dorchester-on-Thames to relax with our selection of fine cask ales and classic pub food.</p><p>Experience historical pub tradition at its best. Cozy alcoves, exposed wooden beams, and friendly locals make the Seven Stars a home away from home.</p>"
  }
];

async function seedInitialBlogs() {
  for (const b of seedBlogs) {
    const page = await prisma.page.create({
      data: {
        title: b.title,
        slug: b.slug,
        type: "blog",
        visibility: "published",
        featuredImage: b.image,
        metaTitle: `${b.title} | Seven Stars`,
        metaDescription: b.excerpt,
      }
    });

    await prisma.section.create({
      data: {
        pageId: page.id,
        type: "BlogDetail",
        content: {
          excerpt: b.excerpt,
          content: b.content,
          area: b.area,
          readTime: b.readTime,
          tag: b.tag,
          views: b.views,
          date: b.date
        },
        order: 0
      }
    });
  }
}

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

    if (pages.length === 0 && !visibility && session) {
      await seedInitialBlogs();
      const freshPages = await prisma.page.findMany({
        where: { type: "blog" },
        include: {
          sections: {
            where: { type: "BlogDetail" }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, data: transformBlogPages(freshPages) });
    }

    return NextResponse.json({ success: true, data: transformBlogPages(pages) });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
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
    const {
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
