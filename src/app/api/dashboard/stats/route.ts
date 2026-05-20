import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [enquiryCount, pageCount, sectionCount, navLinkCount] = await Promise.all([
      prisma.enquiry.count(),
      prisma.page.count(),
      prisma.section.count(),
      prisma.navLink.count(),
    ]);

    // Fetch all pages with section counts
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        visibility: true,
        type: true,
        _count: {
          select: { sections: true },
        },
      },
      orderBy: {
        slug: "asc",
      },
    });

    // Fetch 2 most recent enquiries for system activity log
    const recentEnquiries = await prisma.enquiry.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        createdAt: true,
      },
    });

    // Fetch 2 most recently updated pages for system activity log
    const recentPages = await prisma.page.findMany({
      take: 2,
      orderBy: { updatedAt: "desc" },
      select: {
        title: true,
        slug: true,
        updatedAt: true,
      },
    });

    // Merge and sort activities dynamically
    const activities = [
      ...recentEnquiries.map((e) => ({
        type: "enquiry",
        text: `New enquiry from ${e.name}`,
        time: e.createdAt.toISOString(),
      })),
      ...recentPages.map((p) => ({
        type: "page",
        text: `Layout "${p.title || p.slug}" updated`,
        time: p.updatedAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        enquiries: enquiryCount,
        pages: pageCount,
        sections: sectionCount,
        navLinks: navLinkCount,
        pagesList: pages.map((page) => ({
          id: page.id,
          title: page.title || page.slug.charAt(0).toUpperCase() + page.slug.slice(1),
          slug: page.slug,
          visibility: page.visibility,
          type: page.type,
          sectionsCount: page._count.sections,
        })),
        activities,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
