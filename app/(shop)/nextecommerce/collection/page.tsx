"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, SlidersHorizontal, X, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/uiComponents/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  images: string[];
  collectionTag: string;
  category: { name: string };
}

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter, Sort and Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Derive unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category.name));
    return Array.from(cats).sort();
  }, [products]);

  // Handle Filtering, Sorting, and Searching
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.name === selectedCategory);
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "lowToHigh") {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === "highToLow") {
        return Number(b.price) - Number(a.price);
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSortBy("newest");
    setSearchQuery("");
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <Button
            asChild
            className="rounded-full border border-gray-200 text-sm hover:bg-neutral-100 transition-colors"
            variant="outline"
          >
            <Link href="/nextecommerce/nextHub" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to NextHub
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl md:text-5xl">
              Product Collection
            </h1>
            <p className="max-w-2xl text-sm text-neutral-500 font-medium sm:text-base">
              Browse our complete catalog featuring premium materials and progressive design.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-[2.5rem] border border-neutral-100 bg-white/60 backdrop-blur-md p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Refine Results
              </p>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Filter and sort the collection
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:min-w-180">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-neutral-200 bg-white shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-primary/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 min-w-[180px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-12 rounded-2xl border-neutral-200 bg-white shadow-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-all">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-neutral-100 p-2 shadow-xl">
                    <SelectGroup>
                      <SelectLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-4 py-2">Select Category</SelectLabel>
                      <SelectItem value="all" className="rounded-xl py-3 cursor-pointer">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="rounded-xl py-3 cursor-pointer">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-12 rounded-2xl border-neutral-200 bg-white shadow-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-all">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-neutral-100 p-2 shadow-xl">
                    <SelectGroup>
                      <SelectLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-4 py-2">Sort By</SelectLabel>
                      <SelectItem value="newest" className="rounded-xl py-3 cursor-pointer">Newest Arrivals</SelectItem>
                      <SelectItem value="lowToHigh" className="rounded-xl py-3 cursor-pointer">Price: Low to High</SelectItem>
                      <SelectItem value="highToLow" className="rounded-xl py-3 cursor-pointer">Price: High to Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {(selectedCategory !== "all" || sortBy !== "newest" || searchQuery !== "") && (
                <Button 
                  onClick={clearFilters}
                  variant="ghost" 
                  className="h-12 w-12 rounded-2xl p-0 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-1 gap-6 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-4/5 rounded-[2.5rem]" />
                  <div className="px-4 space-y-3">
                    <Skeleton className="h-3 w-16 rounded-full" />
                    <Skeleton className="h-5 w-full rounded-lg" />
                    <Skeleton className="h-5 w-20 rounded-lg" />
                  </div>
                </div>
              ))
            : filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  category={product.category.name}
                  image={product.images?.[0]}
                  tag={product.collectionTag}
                />
              ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-neutral-100 p-6 mb-4">
              <Search className="h-10 w-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No matching products</h3>
            <p className="mt-2 text-neutral-500 font-medium">Try adjusting your filters or search keywords.</p>
            <Button 
              onClick={clearFilters}
              variant="outline" 
              className="mt-6 rounded-full border-neutral-300"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
