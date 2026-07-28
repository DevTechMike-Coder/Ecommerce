import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

// Removed local isAdmin definition


export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: {
        select: { rating: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const formatted = products.map((p) => {
    const reviewCount = p.reviews.length;
    const averageRating = reviewCount > 0
      ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      images: p.images,
      stock: p.stock,
      categoryId: p.categoryId,
      collectionTag: p.collectionTag,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      category: p.category,
      averageRating,
      reviewCount,
    };
  });

  return NextResponse.json(formatted);
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
