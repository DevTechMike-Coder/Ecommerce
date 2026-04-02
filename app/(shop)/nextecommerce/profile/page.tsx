"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Settings,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  Loader2,
  AlertCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "settings"
  >("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/nextecommerce/signIn");
    }
  }, [session, isSessionPending, router]);

  useEffect(() => {
    if (session?.user && activeTab === "orders") {
      fetchOrders();
    }
  }, [session, activeTab]);

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const response = await fetch("/api/user/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Could not load your orders. Please try again later.");
      console.error(err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PAYMENT_PROCESSING":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "PENDING_PAYMENT":
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "PAID":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "SHIPPED":
        return <Truck className="w-3.5 h-3.5" />;
      case "PAYMENT_PROCESSING":
        return <Loader2 className="w-3.5 h-3.5" />;
      case "PENDING_PAYMENT":
      case "PENDING":
        return <Clock className="w-3.5 h-3.5" />;
      case "CANCELLED":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>

      {/* Header Profile Section */}
      <section className="relative mb-12 overflow-hidden rounded-[2.5rem] border border-border/50 bg-secondary/30 p-8 md:p-12">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-2xl md:h-40 md:w-40">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <User className="h-16 w-16 text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {user.name}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">{user.email}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 text-sm border border-border/40">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 text-sm border border-border/40">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Verified Account</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-destructive border border-destructive/20">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Card className="rounded-3xl border-border/50 bg-secondary/10 overflow-hidden group hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Orders</CardTitle>
                      <CardDescription>
                        You haven&apos;t placed many orders lately.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        className="group rounded-full p-0 h-auto hover:bg-transparent"
                        onClick={() => setActiveTab("orders")}
                      >
                        <span className="text-primary font-semibold">
                          View order history
                        </span>
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-border/50 bg-secondary/10 overflow-hidden group hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Account Safety</CardTitle>
                      <CardDescription>
                        Your account is secured with encryption.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        className="group rounded-full p-0 h-auto hover:bg-transparent"
                        onClick={() => setActiveTab("settings")}
                      >
                        <span className="text-primary font-semibold">
                          Security settings
                        </span>
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-[2rem] border border-border/50 bg-secondary/5 p-8">
                  <h3 className="text-xl font-bold mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                        Email Address
                      </p>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-lg font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Order History</h2>
                  {orders.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {orders.length} total orders
                    </Badge>
                  )}
                </div>

                {isOrdersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-48 w-full rounded-[2rem]"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-[2rem] border border-dashed border-border/50">
                    <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold">No orders found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      Looks like you haven&apos;t placed any orders yet.
                    </p>
                    <Button asChild className="rounded-full px-8">
                      <Link href="/nextecommerce/collection">
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="group overflow-hidden rounded-[2rem] border border-border/50 bg-background transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
                      >
                        <div className="border-b border-border/40 bg-secondary/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Order ID
                              </p>
                              <p className="text-xs font-mono font-medium">
                                #{order.id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Placed On
                              </p>
                              <p className="text-xs font-medium">
                                {format(
                                  new Date(order.createdAt),
                                  "MMM dd, yyyy",
                                )}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Total
                              </p>
                              <p className="text-xs font-bold text-primary">
                                ${Number(order.totalAmount).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 flex items-center gap-1.5 ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="font-semibold text-[10px] uppercase tracking-wider">
                              {order.status}
                            </span>
                          </Badge>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4">
                            {order.orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4"
                              >
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20">
                                  {item.product.images[0] ? (
                                    <Image
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      width={64}
                                      height={64}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Package className="h-6 w-6 text-muted-foreground/30" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold truncate text-sm">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold">
                                    ${Number(item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-border/40 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs font-bold gap-2"
                            >
                              Order Details
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="rounded-[2.5rem] border border-border/50 bg-secondary/10 p-8">
                  <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
                  <p className="text-muted-foreground mb-8">
                    Manage your profile information and security preferences.
                  </p>

                  <div className="space-y-8 max-w-xl">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          Full Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full rounded-2xl border border-border/50 bg-background py-3 pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 opacity-60">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          Email Address (Read-Only)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full rounded-2xl border border-border/50 bg-background/50 py-3 pl-12 pr-4 text-sm cursor-not-allowed"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic mt-1">
                          To change your email, please contact customer support.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3 sm:flex-row">
                      <Button className="rounded-full px-8 font-bold">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full px-8 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50"
                      >
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] border border-destructive/20 bg-linear-to-br from-destructive/12 via-destructive/6 to-background p-6 sm:p-8">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-destructive/10 blur-3xl" />

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 shrink-0 rounded-2xl border border-destructive/20 bg-destructive/15 p-3 text-destructive shadow-sm">
                        <AlertCircle className="h-6 w-6" />
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-destructive/80">
                            High Risk
                          </p>
                          <h3 className="text-xl font-bold text-destructive sm:text-2xl">
                            Danger Zone
                          </h3>
                          <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                            Deleting your account is permanent. Your profile,
                            order history, and saved account data cannot be
                            recovered after this action.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-destructive/15 bg-background/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          Proceed only if you are certain you no longer need
                          access to this account.
                        </div>
                      </div>
                    </div>

                    <div className="sm:shrink-0">
                      <Button
                        variant="destructive"
                        className="w-full rounded-full px-6 font-bold shadow-lg shadow-destructive/15 sm:w-auto sm:px-8"
                      >
                        Delete Account Permanently
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
