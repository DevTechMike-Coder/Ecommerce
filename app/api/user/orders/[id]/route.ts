import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const cancellableStatuses = new Set(["PENDING", "PENDING_PAYMENT"]);
const deletableStatuses = new Set(["CANCELLED", "PENDING_PAYMENT"]);

export const runtime = "nodejs";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
        include: {
          orderItems: true,
        },
      });

      if (!order) {
        return null;
      }

      const status = order.status.toUpperCase();

      if (!cancellableStatuses.has(status)) {
        throw new Error(
          status === "CANCELLED"
            ? "This order has already been cancelled."
            : "Only pending orders can be cancelled."
        );
      }

      const updated = await tx.order.updateMany({
        where: {
          id: order.id,
          userId: session.user.id,
          status: order.status,
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (updated.count !== 1) {
        throw new Error("This order changed while the request was processing. Refresh and try again.");
      }

      if (status === "PENDING") {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return tx.order.findUnique({
        where: {
          id: order.id,
        },
      });
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to cancel order.",
      },
      { status: 409 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!deletableStatuses.has(order.status.toUpperCase())) {
      return NextResponse.json(
        {
          error: "Only cancelled or unpaid pending-payment orders can be deleted.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: {
          orderId: order.id,
        },
      });

      await tx.order.delete({
        where: {
          id: order.id,
        },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete Order Error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete order.",
      },
      { status: 500 }
    );
  }
}
