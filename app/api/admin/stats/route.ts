import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalRevenueData,
      salesCount,
      customerCount,
      productCount,
      recentOrders,
      lastSevenDaysOrders,
      categories
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          totalAmount: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.order.findMany({
        where: {
          status: "PAID",
          createdAt: { gte: sevenDaysAgo }
        },
        select: {
          totalAmount: true,
          createdAt: true
        }
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      })
    ]);

    const revenue = totalRevenueData._sum?.totalAmount;

    // Generate last 7 days labels and aggregate sales in JS
    const salesMap: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      salesMap[dateStr] = 0;
    }

    lastSevenDaysOrders.forEach(order => {
      const dateStr = order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (salesMap[dateStr] !== undefined) {
        salesMap[dateStr] += Number(order.totalAmount);
      }
    });

    const salesChartData = Object.entries(salesMap).map(([date, revenue]) => ({
      date,
      revenue: Number(revenue.toFixed(2))
    }));

    const categorySales = categories.map(cat => ({
      name: cat.name,
      value: cat._count.products
    }));
    
    return NextResponse.json({
      totalRevenue: revenue ? Number(revenue) : 0,
      salesCount,
      customerCount,
      productCount,
      recentOrders,
      salesChartData,
      categorySales
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
