"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SuccessState =
  | { status: "loading" }
  | { status: "success"; orderId: string; method: "paymentOnDelivery" | "stripe" }
  | { status: "error"; message: string };

function useCartHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeHydrate = useCart.persist.onHydrate(onStoreChange);
      const unsubscribeFinishHydration =
        useCart.persist.onFinishHydration(onStoreChange);

      return () => {
        unsubscribeHydrate();
        unsubscribeFinishHydration();
      };
    },
    () => useCart.persist.hasHydrated(),
    () => false
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const cart = useCart();
  const isHydrated = useCartHydrated();
  const hasRun = useRef(false);
  const [state, setState] = useState<SuccessState>({ status: "loading" });

  useEffect(() => {
    if (!isHydrated || hasRun.current) {
      return;
    }

    const method = searchParams.get("method");
    const orderId = searchParams.get("orderId");
    const stripeSessionId = searchParams.get("session_id");

    hasRun.current = true;

    if (method === "paymentOnDelivery" && orderId) {
      cart.clearCart();
      setState({
        status: "success",
        orderId,
        method: "paymentOnDelivery",
      });
      return;
    }

    if (!stripeSessionId) {
      setState({
        status: "error",
        message: "Missing Stripe checkout session reference.",
      });
      return;
    }

    const confirmStripeOrder = async () => {
      try {
        const response = await fetch("/api/checkout/stripe/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: stripeSessionId,
          }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || "Unable to confirm Stripe payment.");
        }

        cart.clearCart();
        setState({
          status: "success",
          orderId: data.orderId,
          method: "stripe",
        });
      } catch (error) {
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to confirm your payment right now.",
        });
      }
    };

    void confirmStripeOrder();
  }, [cart, isHydrated, searchParams]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full rounded-[2rem] border-border/60 shadow-sm">
        <CardHeader className="border-b bg-secondary/20 pb-6 text-center">
          <CardTitle className="text-2xl font-semibold">
            Checkout Status
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6 text-center sm:p-8">
          {state.status === "loading" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/30">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Confirming your order</p>
                <p className="text-sm text-muted-foreground">
                  We are verifying your checkout and finalizing the order record.
                </p>
              </div>
            </div>
          )}

          {state.status === "success" && (
            <div className="space-y-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-semibold">Order confirmed</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {state.method === "stripe"
                    ? "Stripe payment was confirmed and your order has been marked as paid."
                    : "Your cash on delivery order has been created and marked as pending."}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-2 font-mono text-sm font-semibold">
                  #{state.orderId.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild className="rounded-full px-8">
                  <Link href="/nextecommerce/profile">View orders</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/nextecommerce/collection">Keep shopping</Link>
                </Button>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <div className="space-y-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-semibold">We could not finalize the order</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {state.message}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild className="rounded-full px-8">
                  <Link href="/nextecommerce/checkout">Return to checkout</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/nextecommerce/profile">Open profile</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-border/60 bg-background p-4 text-left text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                If you completed payment but still see an error here, refresh this
                page once while you remain signed in. The confirmation route is
                idempotent and will not create duplicate paid orders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function CheckoutSuccessFallback() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full rounded-[2rem] border-border/60 shadow-sm">
        <CardContent className="space-y-4 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/30">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">Loading checkout result</p>
            <p className="text-sm text-muted-foreground">
              Preparing your confirmation details.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
