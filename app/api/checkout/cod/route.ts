import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import {
  createCashOnDeliveryOrder,
  normalizeCheckoutPayload,
  resolveCheckoutError,
} from "@/lib/checkout";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = normalizeCheckoutPayload(await request.json());
    const { order, snapshot } = await createCashOnDeliveryOrder({
      userId: session.user.id,
      payload,
    });

    return NextResponse.json(
      {
        orderId: order.id,
        totalAmount: snapshot.total,
      },
      { status: 201 }
    );
  } catch (error) {
    const resolvedError = resolveCheckoutError(error);

    return NextResponse.json(
      {
        error: resolvedError.message,
      },
      { status: resolvedError.status }
    );
  }
}
