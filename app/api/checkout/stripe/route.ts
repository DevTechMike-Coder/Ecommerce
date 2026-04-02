import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { CHECKOUT_TAX_RATE } from "@/lib/checkout-math";
import {
  createStripeDraftOrder,
  deleteStripeDraftOrder,
  normalizeCheckoutPayload,
  resolveCheckoutError,
} from "@/lib/checkout";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

function getBaseUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    request.nextUrl.origin
  );
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let draftOrderId: string | null = null;

  try {
    const payload = normalizeCheckoutPayload(await request.json());
    const { order, snapshot } = await createStripeDraftOrder({
      userId: session.user.id,
      payload,
    });

    draftOrderId = order.id;

    const stripe = getStripeClient();
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${getBaseUrl(
        request
      )}/nextecommerce/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl(
        request
      )}/nextecommerce/checkout/cancel?orderId=${order.id}`,
      customer_email: payload.customer.email,
      client_reference_id: session.user.id,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
      line_items: [
        ...snapshot.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unitAmount * 100),
            product_data: {
              name: item.name,
            },
          },
        })),
        ...(snapshot.tax > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: Math.round(snapshot.tax * 100),
                  product_data: {
                    name: `Estimated tax (${Math.round(
                      CHECKOUT_TAX_RATE * 100
                    )}%)`,
                  },
                },
              },
            ]
          : []),
      ],
    });

    if (!stripeSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json({
      orderId: order.id,
      url: stripeSession.url,
    });
  } catch (error) {
    if (draftOrderId) {
      try {
        await deleteStripeDraftOrder(draftOrderId, session.user.id);
      } catch (cleanupError) {
        console.error("Stripe Draft Cleanup Error:", cleanupError);
      }
    }

    const resolvedError = resolveCheckoutError(error);

    return NextResponse.json(
      {
        error: resolvedError.message,
      },
      { status: resolvedError.status }
    );
  }
}
