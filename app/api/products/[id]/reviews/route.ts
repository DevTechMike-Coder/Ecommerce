import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const count = reviews.length;
    const avgRating = count > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1))
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: avgRating,
      reviewCount: count
    });
  } catch (error) {
    console.error("[REVIEWS_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  try {
    const { id: productId } = await params;
    const body = await request.json();
    const { rating, comment } = body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
    }

    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json({ error: "Review comment is required" }, { status: 400 });
    }

    // Ensure product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create review
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment: comment.trim(),
        userId: session.user.id,
        productId,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("[REVIEWS_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
