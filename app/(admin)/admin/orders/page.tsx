"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingBag,
  Calendar,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  userId: string;
  status: string;
  paymentMethod: string;
  paymentReference: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  totalAmount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

const STATUS_FILTERS = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const url = status === "ALL" ? "/api/admin/orders" : `/api/admin/orders?status=${status}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
        toast.success("Order status updated", {
          description: `Order ${orderId.slice(0, 8)} status changed to ${nextStatus}`,
        });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("An error occurred updating order status");
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "DELIVERED":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 md:px-10 py-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase flex items-center gap-3">
            Orders <ShoppingBag className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage transactions, fulfillments, shipping statuses, and customer orders.
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "default" : "outline"}
            className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300"
          >
            {filter}
          </Button>
        ))}
      </motion.div>

      {/* Filter and Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search orders by Order ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border/60 rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground focus:outline-hidden focus:border-primary/85 transition-colors"
        />
      </motion.div>

      {/* Orders List */}
      <motion.div variants={itemVariants} className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4 py-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-medium">
              No orders found for the selected status.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">
                  <th className="py-3 font-semibold">Order ID</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Method</th>
                  <th className="py-3 font-semibold">Amount</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {filteredOrders.map((order) => {
                  const isExpanded = !!expandedOrders[order.id];
                  return (
                    <tr key={order.id} className="hover:bg-muted/10 transition-colors border-b border-border/20 last:border-0">
                      <td colSpan={7} className="p-0">
                        <table className="w-full text-left">
                          <tbody>
                            <tr className="align-middle">
                              <td className="py-4 px-2 font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                                {order.id}
                              </td>
                              <td className="py-4 px-2">
                                <div className="font-bold text-foreground">
                                  {order.customerName || order.user.name || "Anonymous"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {order.customerEmail || order.user.email}
                                </div>
                              </td>
                              <td className="py-4 px-2 text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                <span className="text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-full">
                                  {order.paymentMethod === "STRIPE" ? "CARD" : "COD"}
                                </span>
                              </td>
                              <td className="py-4 px-2 font-bold text-foreground">
                                ${Number(order.totalAmount).toFixed(2)}
                              </td>
                              <td className="py-4 px-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border-none outline-hidden cursor-pointer ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt} className="bg-card text-foreground">
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-4 px-2 text-right">
                                <Button
                                  variant="ghost"
                                  onClick={() => toggleExpand(order.id)}
                                  className="rounded-xl flex items-center gap-1 ml-auto text-xs"
                                >
                                  {isExpanded ? (
                                    <>
                                      Hide Items <ChevronUp className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      View Items <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                            {/* Expanded Section */}
                            <tr className="border-none">
                              <td colSpan={7} className="p-0">
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="bg-secondary/40 border-t border-border/40 p-6 space-y-4 overflow-hidden"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                        {/* Shipping Info */}
                                        <div className="space-y-2">
                                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Shipping Information
                                          </h4>
                                          <div className="text-sm space-y-1 text-foreground">
                                            <p className="font-semibold">{order.customerName}</p>
                                            <p>{order.customerPhone || "No phone number provided"}</p>
                                            <p>{order.addressLine1}</p>
                                            {order.addressLine2 && <p>{order.addressLine2}</p>}
                                            <p>
                                              {order.city}, {order.state} {order.postalCode}
                                            </p>
                                            <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground pt-1">
                                              {order.country}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-3">
                                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Purchased Items
                                          </h4>
                                          <div className="divide-y divide-border/30">
                                            {order.orderItems.map((item) => (
                                              <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                  <div className="h-10 w-8 rounded-md bg-muted overflow-hidden relative border border-border/60">
                                                    {item.product.images[0] ? (
                                                      <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                      />
                                                    ) : (
                                                      <Package className="w-5 h-5 absolute inset-0 m-auto text-muted-foreground/45" />
                                                    )}
                                                  </div>
                                                  <div>
                                                    <p className="font-semibold text-foreground">{item.product.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                                <span className="font-bold text-foreground">
                                                  ${(item.quantity * Number(item.price)).toFixed(2)}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.main>
  );
}
