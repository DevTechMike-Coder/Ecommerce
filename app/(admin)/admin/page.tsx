"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Activity,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Stats {
  totalRevenue: number;
  salesCount: number;
  customerCount: number;
  productCount: number;
  recentOrders: {
    id: string;
    customerName: string | null;
    customerEmail: string | null;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  salesChartData: { date: string; revenue: number }[];
  categorySales: { name: string; value: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  if (loading) {
    return (
      <main className="px-4 md:px-10 py-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border/60 p-6 rounded-3xl bg-card">
              <Skeleton className="h-4 w-24 mb-3 rounded" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[320px] rounded-3xl" />
          </div>
          <div>
            <Skeleton className="h-[320px] rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 md:px-10 py-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Title Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time store statistics, order logs, and inventory categories.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
          <TrendingUp className="w-4 h-4" /> Live Metrics
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={`$${Number(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-5 h-5" />}
          description="Total settled payments"
        />
        <StatCard
          title="Sales"
          value={`+${stats?.salesCount || 0}`}
          icon={<ShoppingBag className="w-5 h-5" />}
          description="Total completed checkouts"
        />
        <StatCard
          title="Customers"
          value={stats?.customerCount || 0}
          icon={<Users className="w-5 h-5" />}
          description="Registered store shoppers"
        />
        <StatCard
          title="Stock Level"
          value={stats?.productCount || 0}
          icon={<Package className="w-5 h-5" />}
          description="Distinct products cataloged"
        />
      </motion.div>

      {/* Charts & Categorization Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          {stats && <SalesChart data={stats.salesChartData} />}
        </div>

        {/* Categories Distribution */}
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Categories</h2>
            <p className="text-xs text-muted-foreground mb-6">Product distribution count per category</p>
            <div className="space-y-4">
              {stats?.categorySales.map((cat, i) => {
                const totalProducts = stats.productCount || 1;
                const percent = Math.round((cat.value / totalProducts) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">{cat.name}</span>
                      <span className="text-muted-foreground">{cat.value} items ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-6 border-t border-border/40 mt-6">
            <Link
              href="/admin/product"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              Manage Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Orders Row */}
      <motion.div variants={itemVariants} className="bg-card border border-border/60 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">The latest transactions placed on the store</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-full transition-colors"
          >
            All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">
                <th className="py-3 font-semibold">Order ID</th>
                <th className="py-3 font-semibold">Customer</th>
                <th className="py-3 font-semibold">Date</th>
                <th className="py-3 font-semibold">Amount</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {stats?.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                stats?.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-4 font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                      {order.id}
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-foreground">
                        {order.customerName || "Anonymous"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.customerEmail || "No Email"}
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 font-bold text-foreground">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.main>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="border border-border/60 p-6 rounded-3xl bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex items-start justify-between">
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {value}
        </p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
        {icon}
      </div>
    </div>
  );
}

function SalesChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data || data.length === 0) return null;

  const revenues = data.map((d) => d.revenue);
  const maxRevenue = Math.max(...revenues, 100);
  const minRevenue = Math.min(...revenues, 0);
  const range = maxRevenue - minRevenue;

  const width = 600;
  const height = 250;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (data.length - 1);
    const y =
      paddingTop +
      chartHeight -
      ((d.revenue - minRevenue) / (range || 1)) * chartHeight;
    return { x, y, val: d.revenue, date: d.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${
          paddingTop + chartHeight
        } L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  return (
    <div className="w-full bg-card border border-border/60 p-6 rounded-3xl shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Revenue Trend</h2>
          <p className="text-xs text-muted-foreground">Daily paid sales for the last 7 days</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
          <Activity className="w-3.5 h-3.5 animate-pulse" /> Active Tracking
        </div>
      </div>

      <div className="relative w-full h-[250px]">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + ratio * chartHeight;
            const val = maxRevenue - ratio * range;
            return (
              <g key={index} className="opacity-30">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="var(--muted-foreground)"
                  fontSize="9"
                  textAnchor="end"
                  className="font-medium"
                >
                  ${Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPath && (
            <motion.path
              d={areaPath}
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          )}

          {/* The line path */}
          {linePath && (
            <motion.path
              d={linePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          )}

          {/* Dots on line */}
          {points.map((p, i) => (
            <g key={i} className="group/dot cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="var(--primary)"
                className="opacity-0 group-hover/dot:opacity-15 transition-opacity"
              />
            </g>
          ))}

          {/* X axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 10}
              fill="var(--muted-foreground)"
              fontSize="9"
              textAnchor="middle"
              className="font-medium"
            >
              {p.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
