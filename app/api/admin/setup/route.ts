import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if any admin already exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (adminExists) {
      return NextResponse.json({ error: "Admin already exists. Setup is locked." }, { status: 400 });
    }

    const { email, name, secret } = await request.json();

    if (!email || !name || !secret) {
      return NextResponse.json({ error: "Email, Name, and Setup Secret are required" }, { status: 400 });
    }

    // Verify setup secret from environment
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Invalid Setup Secret" }, { status: 401 });
    }

    // Find the user by email and promote them to ADMIN
    // This assumes the user has already signed up via the normal flow or social login
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    });

    return NextResponse.json({ 
      message: "Admin setup successful!", 
      user: { email: user.email, role: user.role } 
    });
  } catch (error) {

    console.error("[ADMIN_SETUP_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  // Check if setup is already complete
  const adminExists = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  return NextResponse.json({ setupComplete: !!adminExists });
}
