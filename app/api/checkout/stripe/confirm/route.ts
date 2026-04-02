import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import {
  CheckoutError,
  finalizeStripeOrder,
  resolveCheckoutError,
} from "@/lib/checkout";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      typeof payload.sessionId !== "string" ||
      !payload.sessionId.trim()
    ) {
      throw new CheckoutError("Stripe session ID is required.");
    }

    const sessionId = payload.sessionId.trim();
    const stripe = getStripeClient();
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = stripeSession.metadata?.orderId;
    const stripeUserId = stripeSession.metadata?.userId;

    if (stripeUserId && stripeUserId !== session.user.id) {
      throw new CheckoutError(
        "This Stripe session belongs to a different user.",
        403
      );
    }

    if (!orderId) {
      throw new CheckoutError("Missing order reference from Stripe session.");
    }

    if (stripeSession.payment_status !== "paid") {
      throw new CheckoutError("Payment has not been completed yet.", 409);
    }

    const order = await finalizeStripeOrder({
      orderId,
      sessionId,
      userId: session.user.id,
    });

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
    });
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
