import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const customers = users.map((user) => {
      const paidOrders = user.orders.filter((o) => o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED");
      const totalSpent = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        orderCount: user.orders.length,
        totalSpent,
        lastOrderAt: user.orders[0]?.createdAt ?? null,
      };
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
