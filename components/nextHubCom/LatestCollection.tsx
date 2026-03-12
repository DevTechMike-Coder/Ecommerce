"use client";

import { useState, useEffect } from "react";
import ProductCard from "../uiComponents/ProductCard";

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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Sort by creation date if available, or just slice
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
    <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-2 rounded-full">
           New Arrivals
        </h2>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-900">
           Latest Collection
        </h1>
        <p className="text-sm md:text-base text-neutral-500 font-medium max-w-lg">
          Discover our latest drops featuring premium materials and progressive design.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-4/5 bg-neutral-100 rounded-[2.5rem] animate-pulse" />
          ))
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category.name}
              image={product.images?.[0]}
              tag={product.collectionTag}
            />
          ))
        )}
      </div>

      <div className="mt-20 flex justify-center">
         <button className="group flex items-center gap-4 px-10 py-5 rounded-full border-2 border-neutral-900 text-neutral-900 font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all">
            View All Products
            <div className="w-2 h-2 rounded-full bg-current transition-transform group-hover:scale-150" />
         </button>
      </div>
    </section>
  );
}
