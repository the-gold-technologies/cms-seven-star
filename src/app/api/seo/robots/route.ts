import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.globalConfig.findUnique({
      where: { id: "global" },
    });

    const robotsTxt = config?.robotsTxt || "User-agent: *\nAllow: /\n\nSitemap: https://sevenstarsatmarshbaldon.co.uk/sitemap.xml";

    return new Response(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error generating robots:", error);
    return new Response("User-agent: *\nAllow: /", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}
