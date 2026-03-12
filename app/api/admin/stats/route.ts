import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalRevenueData, salesCount, customerCount, productCount] = await Promise.all([
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count()
    ]);

    const revenue = totalRevenueData._sum?.totalAmount;
    
    return NextResponse.json({
      totalRevenue: revenue ? Number(revenue) : 0,
      salesCount,
      customerCount,
      productCount
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
