import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const PAGE_SLUG = "privacy-policy";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const DEFAULT_PRIVACY_POLICY = {
      title: "Privacy Policy",
      introduction:
        "We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.",
      content: `<h3>1. Important Information and Who We Are</h3><p>Seven Stars, located in Marsh Baldon, Oxford (referred to as "we", "us" or "our" in this privacy policy) is the controller and responsible for this website.</p><p>If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact us using the details set out below.</p><h3>2. The Data We Collect About You</h3><p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p><ul><li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li><li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li><li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li><li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li><li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li></ul><h3>3. How We Use Your Personal Data</h3><p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p><ul><li>Where we need to perform the contract we are about to enter into or have entered into with you (such as processing your booking or reservation).</li><li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li><li>Where we need to comply with a legal obligation.</li></ul><h3>4. Cookies</h3><p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. For more information about the cookies we use, please refer to our Cookie Banner preferences.</p><h3>5. Data Security</h3><p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p><h3>6. Your Legal Rights</h3><p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and the right to withdraw consent.</p><h3>7. Contact Details</h3><p>If you have any questions or wish to contact us regarding your personal data, you can email us at info@sevenstarsatmarshbaldon.co.uk or visit us in person in Marsh Baldon, Oxford.</p>`,
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
          title: "Privacy Policy",
          slug: PAGE_SLUG,
          type: "static",
          visibility: "published",
          sections: {
            create: {
              type: "PrivacyPolicyContent",
              content: DEFAULT_PRIVACY_POLICY,
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
        (s) => s.type === "PrivacyPolicyContent",
      );
      if (!hasSection) {
        const newSection = await prisma.section.create({
          data: {
            pageId: page.id,
            type: "PrivacyPolicyContent",
            content: DEFAULT_PRIVACY_POLICY,
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
    console.error("Error fetching privacy-policy page content:", error);
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
        title: "Privacy Policy",
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
    console.error("Error saving privacy-policy page section:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
