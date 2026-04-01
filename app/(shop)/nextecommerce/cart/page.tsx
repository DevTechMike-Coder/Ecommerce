"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
} from "lucide-react";
import React, { useSyncExternalStore } from "react";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";

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

export default function Cart() {
  const cart = useCart();
  const isHydrated = useCartHydrated();
  const storeHomeHref = "/nextecommerce/nextHub";

  if (!isHydrated) {
    return null; // Or a skeleton loader
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shipping = 0; // Could be dynamic
  const tax = subtotal * 0.08; // Example 8% tax
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6">
          <ShoppingBasket className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button asChild className="mt-8 px-8 rounded-full" size="lg">
          <Link href={storeHomeHref}>
            Start Shopping
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex-1 px-4 pt-20 md:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Your Cart
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review your items before checkout.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-full self-start text-muted-foreground"
        >
          <Link href={storeHomeHref}>
            <ArrowLeft size={16} />
            Return Home
          </Link>
        </Button>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden rounded-2xl border-border/60 shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                        <ShoppingBasket size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-2">
                      <div>
                        <h2 className="font-semibold truncate max-w-[200px] sm:max-w-none">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                      </div>

                      <button 
                        onClick={() => cart.removeItem(item.id)}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-destructive"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <p className="text-base font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <div className="flex items-center rounded-full border border-border/70">
                        <button 
                          onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-start">
             <Button 
               variant="outline" 
               className="text-muted-foreground rounded-full"
               onClick={() => cart.clearCart()}
             >
               Clear Cart
             </Button>
          </div>
        </div>

        <aside className="mt-2">
          <Card className="rounded-2xl border-border/60 shadow-sm lg:sticky lg:top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium text-muted-foreground">
                  {shipping > 0 ? `+$${shipping.toFixed(2)}` : "Free"}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Tax (8%)</p>
                <p className="font-medium text-muted-foreground">
                  +${tax.toFixed(2)}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-base font-semibold">Total</p>
                <p className="text-lg font-semibold">${total.toFixed(2)}</p>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button className="w-full rounded-full" size="lg">
                Checkout
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Shipping and taxes are calculated at checkout.
              </p>
            </CardFooter>
          </Card>
        </aside>
      </section>
    </main>
  );
}
