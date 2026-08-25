import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const PAGE_SLUG = "terms-of-service";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const DEFAULT_TERMS_OF_SERVICE = {
      title: "Terms of Service",
      introduction:
        "Please read these Terms of Service carefully before accessing our website, making inquiries, or placing table bookings at Seven Stars.",
      content: `<h3>1. Acceptance of Terms</h3><p>By accessing or using any part of our website or reservation service, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access the website or use our booking services.</p><h3>2. Bookings, Cancellations and Deposits</h3><p>We use third-party tools (such as OpenTable) to manage reservations. When making a reservation, you agree to provide accurate contact and identity information. The following booking rules apply:</p><ul><li><strong>Standard Reservations:</strong> Bookings can be modified or canceled up to 24 hours prior to your scheduled time without penalty.</li><li><strong>Special Events & Holidays:</strong> For major holidays (such as Christmas Day), deposits or credit card authorizations may be required. Cancellations made outside our stated promotional window will forfeit the deposit.</li><li><strong>Late Arrivals:</strong> Tables will be held for a maximum of 15 minutes. If you are running late, please call us to avoid cancellation.</li></ul><h3>3. Age Restrictions and Alcohol Policy</h3><p>We are a fully licensed pub serving alcohol, seasonal cocktails, and wine. The following licensing laws must be adhered to at all times:</p><ul><li>Under local laws, you must be 18 years or older to purchase and consume alcohol on our premises. We operate a strict "Challenge 25" policy; please bring valid physical photo identification (passport or driver's license).</li><li>Minors are welcome in designated family dining areas, but must be accompanied and supervised by a parent or guardian at all times.</li></ul><h3>4. User Conduct and Behavior</h3><p>We pride ourselves on providing a warm, family-friendly, and safe countryside pub environment. We reserve the right to refuse service or ask patrons to leave our premises if they behave in a disruptive, abusive, or dangerous manner to our staff or fellow patrons.</p><h3>5. Intellectual Property</h3><p>All content published on this website (including text, menu descriptions, high-resolution graphics, logos, layouts, and photographs) is the intellectual property of Seven Stars and is protected by copyright laws. You may not copy, republish, or distribute any material without our prior written consent.</p><h3>6. Limitation of Liability</h3><p>We do not guarantee that our website will be uninterrupted or error-free. We shall not be held liable for any direct, indirect, or consequential damages resulting from your use of the website or the inability to complete an online booking request.</p><h3>7. Modifications to Services and Terms</h3><p>We reserve the right to modify these Terms of Service or our menu offerings at any time. Changes will take effect immediately upon their publication on this page.</p><h3>8. Governing Law</h3><p>These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and any disputes will be decided exclusively by the courts of the United Kingdom.</p>`,
    };

    let page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
      include: {
        sections: true,
      },
    });

    if (!page) {
      page = await prisma.page.create({
        data: {
          title: "Terms of Service",
          slug: PAGE_SLUG,
          type: "static",
          visibility: "published",
          sections: {
            create: {
              type: "TermsOfServiceContent",
              content: DEFAULT_TERMS_OF_SERVICE,
              order: 0,
            },
          },
        },
        include: {
          sections: true,
        },
      });
    } else {
      const hasSection = page.sections.some(
        (s) => s.type === "TermsOfServiceContent",
      );
      if (!hasSection) {
        const newSection = await prisma.section.create({
          data: {
            pageId: page.id,
            type: "TermsOfServiceContent",
            content: DEFAULT_TERMS_OF_SERVICE,
            order: 0,
          },
        });
        page.sections.push(newSection);
      }
    }

    const sectionsMap: Record<string, unknown> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    return NextResponse.json({ success: true, data: sectionsMap });
  } catch (error) {
    console.error("Error fetching terms-of-service page content:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, content } = body;

    if (!section || typeof section !== "string") {
      return NextResponse.json(
        { success: false, error: "'section' (string) is required" },
        { status: 400 },
      );
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { success: false, error: "'content' (object) is required" },
        { status: 400 },
      );
    }

    const page = await prisma.page.upsert({
      where: { slug: PAGE_SLUG },
      create: {
        title: "Terms of Service",
        slug: PAGE_SLUG,
        type: "static",
        visibility: "published",
      },
      update: {},
    });

    const existingSection = await prisma.section.findFirst({
      where: { pageId: page.id, type: section },
    });

    let savedSection;
    if (existingSection) {
      savedSection = await prisma.section.update({
        where: { id: existingSection.id },
        data: { content },
      });
    } else {
      const sectionCount = await prisma.section.count({
        where: { pageId: page.id },
      });
      savedSection = await prisma.section.create({
        data: {
          pageId: page.id,
          type: section,
          content,
          order: sectionCount,
        },
      });
    }

    return NextResponse.json({ success: true, data: savedSection });
  } catch (error) {
    console.error("Error saving terms-of-service page section:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
