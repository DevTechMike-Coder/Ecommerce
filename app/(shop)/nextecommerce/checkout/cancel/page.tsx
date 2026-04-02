import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full rounded-[2rem] border-border/60 shadow-sm">
        <CardHeader className="border-b bg-secondary/20 pb-6 text-center">
          <CardTitle className="text-2xl font-semibold">
            Checkout Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <AlertCircle className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">No charge was captured.</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can return to checkout and choose Stripe again, or switch to
              cash on delivery.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-8">
              <Link href="/nextecommerce/checkout">Back to checkout</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/nextecommerce/cart">Back to cart</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
