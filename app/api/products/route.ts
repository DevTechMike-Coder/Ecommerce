import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function isAdmin() {
  if (process.env.NODE_ENV === "development") return true;
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, price, stock, categoryId, images } = await request.json();

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock: parseInt(stock),
      categoryId,
      images: images || [],
    }
  });

  return NextResponse.json(product, { status: 201 });
}
