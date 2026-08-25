import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { checkAndAutoRefreshToken } from "@/lib/instagramAutoRefresh";

export const dynamic = "force-dynamic";

const DEFAULT_PRIVACY_POLICY = {
  title: "Privacy Policy",
  introduction:
    "We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.",
  content: `<h3>1. Important Information and Who We Are</h3><p>Seven Stars, located in Marsh Baldon, Oxford (referred to as "we", "us" or "our" in this privacy policy) is the controller and responsible for this website.</p><p>If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact us using the details set out below.</p><h3>2. The Data We Collect About You</h3><p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p><ul><li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li><li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li><li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li><li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li><li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li></ul><h3>3. How We Use Your Personal Data</h3><p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p><ul><li>Where we need to perform the contract we are about to enter into or have entered into with you (such as processing your booking or reservation).</li><li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li><li>Where we need to comply with a legal obligation.</li></ul><h3>4. Cookies</h3><p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. For more information about the cookies we use, please refer to our Cookie Banner preferences.</p><h3>5. Data Security</h3><p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p><h3>6. Your Legal Rights</h3><p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and the right to withdraw consent.</p><h3>7. Contact Details</h3><p>If you have any questions or wish to contact us regarding your personal data, you can email us at info@sevenstarsatmarshbaldon.co.uk or visit us in person in Marsh Baldon, Oxford.</p>`,
};

const DEFAULT_TERMS_OF_SERVICE = {
  title: "Terms of Service",
  introduction:
    "Please read these Terms of Service carefully before accessing our website, making inquiries, or placing table bookings at Seven Stars.",
  content: `<h3>1. Acceptance of Terms</h3><p>By accessing or using any part of our website or reservation service, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access the website or use our booking services.</p><h3>2. Bookings, Cancellations and Deposits</h3><p>We use third-party tools (such as OpenTable) to manage reservations. When making a reservation, you agree to provide accurate contact and identity information. The following booking rules apply:</p><ul><li><strong>Standard Reservations:</strong> Bookings can be modified or canceled up to 24 hours prior to your scheduled time without penalty.</li><li><strong>Special Events & Holidays:</strong> For major holidays (such as Christmas Day), deposits or credit card authorizations may be required. Cancellations made outside our stated promotional window will forfeit the deposit.</li><li><strong>Late Arrivals:</strong> Tables will be held for a maximum of 15 minutes. If you are running late, please call us to avoid cancellation.</li></ul><h3>3. Age Restrictions and Alcohol Policy</h3><p>We are a fully licensed pub serving alcohol, seasonal cocktails, and wine. The following licensing laws must be adhered to at all times:</p><ul><li>Under local laws, you must be 18 years or older to purchase and consume alcohol on our premises. We operate a strict "Challenge 25" policy; please bring valid physical photo identification (passport or driver's license).</li><li>Minors are welcome in designated family dining areas, but must be accompanied and supervised by a parent or guardian at all times.</li></ul><h3>4. User Conduct and Behavior</h3><p>We pride ourselves on providing a warm, family-friendly, and safe countryside pub environment. We reserve the right to refuse service or ask patrons to leave our premises if they behave in a disruptive, abusive, or dangerous manner to our staff or fellow patrons.</p><h3>5. Intellectual Property</h3><p>All content published on this website (including text, menu descriptions, high-resolution graphics, logos, layouts, and photographs) is the intellectual property of Seven Stars and is protected by copyright laws. You may not copy, republish, or distribute any material without our prior written consent.</p><h3>6. Limitation of Liability</h3><p>We do not guarantee that our website will be uninterrupted or error-free. We shall not be held liable for any direct, indirect, or consequential damages resulting from your use of the website or the inability to complete an online booking request.</p><h3>7. Modifications to Services and Terms</h3><p>We reserve the right to modify these Terms of Service or our menu offerings at any time. Changes will take effect immediately upon their publication on this page.</p><h3>8. Governing Law</h3><p>These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and any disputes will be decided exclusively by the courts of the United Kingdom.</p>`,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;
    const targetSlug = slug.startsWith("blog/") ? slug.substring(5) : slug;

    let page = await prisma.page.findUnique({
      where: { slug: targetSlug },
      include: {
        sections: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (
      !page &&
      (targetSlug === "privacy-policy" || targetSlug === "terms-of-service")
    ) {
      const isPrivacy = targetSlug === "privacy-policy";
      const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
      const sectionType = isPrivacy
        ? "PrivacyPolicyContent"
        : "TermsOfServiceContent";
      const defaultContent = isPrivacy
        ? DEFAULT_PRIVACY_POLICY
        : DEFAULT_TERMS_OF_SERVICE;

      page = await prisma.page.create({
        data: {
          title,
          slug: targetSlug,
          type: "static",
          visibility: "published",
          sections: {
            create: {
              type: sectionType,
              content: defaultContent,
              order: 0,
            },
          },
        },
        include: {
          sections: true,
        },
      });
    }

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    const {
      metaTitle,
      metaDescription,
      targetKeywords,
      canonicalUrl,
      noIndex,
      featuredImage,
      ogTitle,
      ogDescription,
      ogImage,
      headingOptions,
      schema,
      ...rest
    } = page;

    if (targetSlug === "events" && page.sections) {
      for (const section of page.sections) {
        if (section.type === "EventsArchive" && section.content) {
          section.content = (await checkAndAutoRefreshToken(
            section.content as Record<string, any>,
            "events",
            "EventsArchive"
          )) as any;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...rest,
        seo: {
          metaTitle,
          metaDescription,
          targetKeywords,
          canonicalUrl,
          noIndex,
          featuredImage,
          ogTitle,
          ogDescription,
          ogImage,
          headingOptions,
          schema,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, slug } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Page id is required" },
        { status: 400 },
      );
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
      },
    });

    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    // Delete associated NavLink if it exists
    await prisma.navLink.deleteMany({
      where: { url: `/${slug}` },
    });

    await prisma.page.delete({
      where: { id: page.id },
    });

    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
