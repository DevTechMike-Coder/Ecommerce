import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

// Removed local isAdmin definition


export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, price, stock, categoryId, images, collectionTag } = await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        categoryId,
        images: images || [],
        collectionTag: collectionTag || "REGULAR",
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const err = error as Error;
    console.error("[PRODUCTS_POST] ERROR:", err.message, err.stack);
    return NextResponse.json({ message: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
