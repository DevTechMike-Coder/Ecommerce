import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-utils";

const VALID_STATUSES = new Set([
  "PENDING_PAYMENT",
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const nextStatus = String(body?.status ?? "").toUpperCase();

    if (!VALID_STATUSES.has(nextStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) return null;

      const wasCancelled = order.status === "CANCELLED";
      const willBeCancelled = nextStatus === "CANCELLED";

      // Restock when an order transitions INTO cancelled from a non-cancelled state.
      if (willBeCancelled && !wasCancelled) {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // Deduct stock again if an admin reverses a cancellation.
      if (!willBeCancelled && wasCancelled) {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: nextStatus },
        include: {
          user: { select: { id: true, name: true, email: true } },
          orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
        },
      });
    });

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
