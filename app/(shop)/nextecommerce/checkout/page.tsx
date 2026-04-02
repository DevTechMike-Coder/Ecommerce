"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { calculateCheckoutTotals } from "@/lib/checkout-math";
import type {
  CheckoutPaymentOption,
  CheckoutRequestPayload,
} from "@/lib/checkout-types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type CustomerFormState = CheckoutRequestPayload["customer"];

interface PaymentOption {
  id: CheckoutPaymentOption;
  name: string;
  description: string;
  icon: ReactNode;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const paymentMethods: PaymentOption[] = [
  {
    id: "paymentOnDelivery",
    name: "Cash on Delivery",
    description: "Place the order now and pay when it reaches you.",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: "stripe",
    name: "Stripe Checkout",
    description: "Continue to Stripe's hosted page for secure card payment.",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

const initialCustomerState: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

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

function getClientValidationError(customer: CustomerFormState) {
  if (!customer.name.trim()) return "Please enter your full name.";
  if (!customer.email.trim()) return "Please enter your email address.";
  if (!/^\S+@\S+\.\S+$/.test(customer.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!customer.phone.trim()) return "Please enter your phone number.";
  if (!customer.addressLine1.trim()) return "Please enter your delivery address.";
  if (!customer.city.trim()) return "Please enter your city.";
  if (!customer.country.trim()) return "Please enter your country.";

  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const isHydrated = useCartHydrated();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [selected, setSelected] =
    useState<CheckoutPaymentOption>("paymentOnDelivery");
  const [customer, setCustomer] = useState<CustomerFormState>(initialCustomerState);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      name: current.name || session.user.name || "",
      email: current.email || session.user.email || "",
    }));
  }, [session]);

  const totals = calculateCheckoutTotals(
    cart.items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }))
  );

  const handleFieldChange =
    (field: keyof CustomerFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setCustomer((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in first", {
        description: "You need to be logged in before placing an order.",
      });

      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/nextecommerce/signIn?callbackURL=${callbackUrl}`);
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const validationError = getClientValidationError(customer);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      const payload: CheckoutRequestPayload = {
        customer,
        items: cart.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };
      const endpoint =
        selected === "stripe" ? "/api/checkout/stripe" : "/api/checkout/cod";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to process checkout right now.");
      }

      if (selected === "stripe") {
        if (!data?.url) {
          throw new Error("Stripe checkout URL was not returned.");
        }

        window.location.assign(data.url);
        return;
      }

      cart.clearCart();
      router.push(
        `/nextecommerce/checkout/success?method=paymentOnDelivery&orderId=${encodeURIComponent(
          data.orderId
        )}`
      );
    } catch (error) {
      toast.error("Checkout failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while processing checkout.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (cart.items.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Add products to your cart before heading to checkout.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full px-8">
            <Link href="/nextecommerce/cart">Back to cart</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/nextecommerce/collection">Continue shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Confirm your delivery details, then choose between cash on delivery and
          Stripe Checkout.
        </p>
      </div>

      {!session && !isSessionPending && (
        <Card className="mb-6 border-amber-300/60 bg-amber-50/70">
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Sign in before placing an order. Your cart is still here, but the
                checkout routes require an authenticated account.
              </p>
            </div>
            <Button asChild size="sm" className="rounded-full">
              <Link
                href={`/nextecommerce/signIn?callbackURL=${encodeURIComponent(
                  "/nextecommerce/checkout"
                )}`}
              >
                Sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-sm">
            <CardHeader className="border-b bg-secondary/20 pb-4">
              <CardTitle className="text-base font-semibold">
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkout-name">Full name</Label>
                <Input
                  id="checkout-name"
                  value={customer.name}
                  onChange={handleFieldChange("name")}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-email">Email address</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={customer.email}
                  onChange={handleFieldChange("email")}
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-phone">Phone number</Label>
                <Input
                  id="checkout-phone"
                  value={customer.phone}
                  onChange={handleFieldChange("phone")}
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-country">Country</Label>
                <Input
                  id="checkout-country"
                  value={customer.country}
                  onChange={handleFieldChange("country")}
                  placeholder="Nigeria"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="checkout-address-line-1">Address line 1</Label>
                <Input
                  id="checkout-address-line-1"
                  value={customer.addressLine1}
                  onChange={handleFieldChange("addressLine1")}
                  placeholder="12 Example Street"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="checkout-address-line-2">
                  Address line 2
                </Label>
                <Input
                  id="checkout-address-line-2"
                  value={customer.addressLine2}
                  onChange={handleFieldChange("addressLine2")}
                  placeholder="Apartment, suite, landmark"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-city">City</Label>
                <Input
                  id="checkout-city"
                  value={customer.city}
                  onChange={handleFieldChange("city")}
                  placeholder="Lagos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-state">State / Region</Label>
                <Input
                  id="checkout-state"
                  value={customer.state}
                  onChange={handleFieldChange("state")}
                  placeholder="Lagos State"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="checkout-postal-code">Postal code</Label>
                <Input
                  id="checkout-postal-code"
                  value={customer.postalCode}
                  onChange={handleFieldChange("postalCode")}
                  placeholder="100001"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pb-4 pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  2
                </div>
                <CardTitle className="text-base font-semibold">
                  Payment Method
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="px-0">
              <div className="grid gap-3 md:grid-cols-2">
                {paymentMethods.map((method) => {
                  const isSelected = selected === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelected(method.id)}
                      className="group relative text-left"
                    >
                      <Card
                        className={`relative rounded-[1.75rem] transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                            : "border-border bg-card shadow-sm"
                        }`}
                      >
                        <CardContent className="flex items-start gap-4 p-5">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:bg-accent"
                            }`}
                          >
                            {method.icon}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-semibold ${
                                  isSelected ? "text-primary" : "text-foreground"
                                }`}
                              >
                                {method.name}
                              </h3>
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-sm">
                <CardHeader className="border-b bg-secondary/20 pb-4">
                  <CardTitle className="text-base font-semibold">
                    {selected === "paymentOnDelivery"
                      ? "Cash on Delivery"
                      : "Stripe Checkout"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {selected === "paymentOnDelivery" ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="leading-relaxed">
                        The order is created immediately and marked pending for
                        delivery. Stock is reserved as soon as you place it, and
                        payment is collected when the package reaches you.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-sm text-muted-foreground">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="leading-relaxed">
                          Card details are not collected on this page. When you
                          continue, you will be redirected to Stripe&apos;s hosted
                          Checkout page to complete payment securely.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {["Visa", "Mastercard", "Verve"].map((network) => (
                          <div
                            key={network}
                            className="rounded-2xl border border-dashed border-border/70 bg-background px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            {network}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-[2rem] border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/50 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      {currencyFormatter.format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {currencyFormatter.format(totals.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-muted-foreground">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">
                    {currencyFormatter.format(totals.tax)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  {currencyFormatter.format(totals.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start gap-3 rounded-2xl bg-secondary/20 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Secure checkout flow</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Order totals are recalculated on the server from the database
                    before anything is created.
                  </p>
                </div>
              </div>

              <Button
                className="h-12 w-full rounded-full text-sm font-semibold"
                onClick={handleCheckout}
                disabled={isProcessing || isSessionPending}
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isProcessing
                  ? "Processing..."
                  : selected === "stripe"
                  ? "Continue to Stripe Checkout"
                  : "Place Cash on Delivery Order"}
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                By continuing, you confirm the delivery details above and accept
                the server-calculated order total.
              </p>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/nextecommerce/cart">Return to cart</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
