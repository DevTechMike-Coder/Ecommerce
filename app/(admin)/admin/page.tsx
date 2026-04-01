"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    salesCount: 0,
    customerCount: 0,
    productCount: 0,
  });
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

  return (
    <main className="px-4 md:px-10">
      <div className="pt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border p-6 rounded-2xl bg-card">
              <Skeleton className="h-4 w-24 mb-3 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Revenue"
              value={`$${Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            />
            <StatCard
              title="Sales"
              value={`+${stats.salesCount}`}
            />
            <StatCard
              title="Customers"
              value={stats.customerCount}
            />
            <StatCard
              title="Stock Level"
              value={stats.productCount}
            />
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="border border-border p-6 rounded-2xl bg-card transition-all hover:shadow-md">
      <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h1>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
