import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check if any admin already exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (adminExists) {
      return NextResponse.json({ error: "Admin already exists. Setup is locked." }, { status: 400 });
    }

    const { email, name, password, secret } = await request.json();

    if (!email || !name || !password || !secret) {
      return NextResponse.json({ error: "Email, Name, Password, and Setup Secret are required" }, { status: 400 });
    }

    // Verify setup secret from environment
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Invalid Setup Secret" }, { status: 401 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    let user;
    if (!existingUser) {
        // 2. Create the user using better-auth server API (handles hashing)
        user = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
            }
        });
        
        // 3. Promote the newly created user to ADMIN
        await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        });
    } else {
        // 4. If user exists, just promote them
        user = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        });
    }

    return NextResponse.json({ 
      message: "Admin setup successful!", 
      user: { email: user.email, role: "ADMIN" } 
    });
  } catch (error: any) {
    console.error("[ADMIN_SETUP_POST]", error);
    const errorMessage = error.message || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: error.statusCode || 500 });
  }
}



export async function GET() {
  // Check if setup is already complete
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" }
  });

  return NextResponse.json({ adminCount });
}

