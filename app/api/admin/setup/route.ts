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

    let userEmail: string;
    if (!existingUser) {
        // 2. Create the user using better-auth server API (handles hashing)
        const result = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
            }
        });
        userEmail = result.user.email;
        
        // 3. Promote the newly created user to ADMIN
        await prisma.user.update({
            where: { email: userEmail },
            data: { role: "ADMIN" }
        });
    } else {
        // 4. If user exists, just promote them
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        });
        userEmail = updatedUser.email;
    }

    return NextResponse.json({ 
      message: "Admin setup successful!", 
      user: { email: userEmail, role: "ADMIN" } 
    });
  } catch (error: unknown) {
    console.error("[ADMIN_SETUP_POST]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}




export async function GET() {
  // Check if setup is already complete
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" }
  });

  return NextResponse.json({ adminCount });
}
