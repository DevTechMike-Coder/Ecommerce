"use client";

import { useState, useEffect } from "react";
import ProductCard from "../uiComponents/ProductCard";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  collectionTag: string;
  category: { name: string };
}

export default function LatestCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
      const updateLimit = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setDisplayLimit(2); // Mobile — show 2 products
        } else if (width < 1024) {
          setDisplayLimit(4); // Tablet
        } else {
          setDisplayLimit(10); // Desktop
        }
      };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Keep up to 10 for desktop
          setProducts(data.slice(0, 10));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-24">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-2 rounded-full">
          New Arrivals
        </h2>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-neutral-900 sm:text-5xl md:text-6xl">
          Latest Collection
        </h1>
        <p className="text-sm md:text-base text-neutral-500 font-medium max-w-lg">
          Discover our latest drops featuring premium materials and progressive
          design.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 min-[560px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {loading
          ? Array.from({ length: displayLimit }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-4/5 rounded-[2.5rem]" />
                <div className="px-4 space-y-3">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-5 w-full rounded-lg" />
                  <Skeleton className="h-5 w-20 rounded-lg" />
                </div>
              </div>
            ))
          : products.slice(0, displayLimit).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category.name}
                image={product.images?.[0]}
                tag={product.collectionTag}
              />
            ))}
      </div>


      <div className="mt-20 flex justify-center">
        <Link
          href="/nextecommerce/collection"
          className="flex w-full max-w-sm items-center justify-center gap-4 rounded-full border-2 border-neutral-900 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white sm:w-auto sm:max-w-none sm:px-10 sm:py-5"
        >
          View All Products
          <div className="h-2 w-2 rounded-full bg-current" />
        </Link>
      </div>
    </section>
  );
}
