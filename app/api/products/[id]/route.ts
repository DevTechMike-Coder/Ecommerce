import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

// Removed local isAdmin definition

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
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
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
