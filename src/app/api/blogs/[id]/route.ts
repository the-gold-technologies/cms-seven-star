import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        type: "blog"
      },
      include: {
        sections: {
          where: { type: "BlogDetail" }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    const blogDetail = page.sections?.[0]?.content as Record<string, any> || {};
    const blog = {
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

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const page = await prisma.page.findFirst({
      where: { id, type: "blog" }
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
