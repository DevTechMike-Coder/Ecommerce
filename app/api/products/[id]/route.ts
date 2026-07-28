import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

function isPrismaError(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = product.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      images: product.images,
      stock: product.stock,
      categoryId: product.categoryId,
      collectionTag: product.collectionTag,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category,
      reviews,
      averageRating,
      reviewCount,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("[PRODUCT_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const orderItemCount = await prisma.orderItem.count({
      where: {
        productId: id,
      },
    });

    if (orderItemCount > 0) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it is part of existing customer orders. Set its stock to 0 instead.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.wishlistItem.deleteMany({
        where: {
          productId: id,
        },
      }),
      prisma.review.deleteMany({
        where: {
          productId: id,
        },
      }),
      prisma.product.delete({
        where: {
          id,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    if (isPrismaError(error, "P2003")) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it is part of existing customer orders. Set its stock to 0 instead.",
        },
        { status: 409 }
      );
    }
    if (isPrismaError(error, "P2025")) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
