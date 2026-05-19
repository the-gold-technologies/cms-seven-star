import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Count Enquiries from the Enquiry table
    const enquiryCount = await prisma.enquiry.count();

    return NextResponse.json({
      success: true,
      data: {
        enquiries: enquiryCount,
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
