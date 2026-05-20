import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: name.trim() },
    });

    return NextResponse.json({ success: true, user: { name: updatedUser.name } });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
