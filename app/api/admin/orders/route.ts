import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = request.nextUrl.searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status && status !== "ALL" ? { status } : undefined,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch Admin Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
