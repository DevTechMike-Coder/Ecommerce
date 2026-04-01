"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  collectionTag: string;
  images: string[];
  category: { name: string };
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the product");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50/30 px-4 pb-20 sm:px-6 lg:px-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 sm:text-4xl">
            Inventory
          </h1>
          <p className="text-neutral-500 font-medium">
            Manage your product catalog and stock levels.
          </p>
        </div>

        <Button asChild className="flex h-auto w-full items-center gap-3 rounded-2xl bg-neutral-900 px-6 py-5 text-white shadow-xl shadow-black/10 transition-all hover:-translate-y-1 hover:bg-neutral-800 sm:w-auto sm:px-8 sm:py-6">
          <Link href="/admin/product/addProduct">
            <Plus className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Add New Product
            </span>
          </Link>
        </Button>
      </div>

      <div className="space-y-4 lg:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[2rem] border border-neutral-100 bg-white p-5 shadow-lg shadow-neutral-200/40"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-2xl" />
                <Skeleton className="h-16 rounded-2xl" />
                <Skeleton className="h-16 rounded-2xl" />
                <Skeleton className="h-16 rounded-2xl" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <Alert className="rounded-3xl border-2 border-dashed bg-neutral-50/50">
            <AlertCircle className="h-5 w-5 text-neutral-400" />
            <AlertTitle className="font-bold uppercase tracking-tight text-neutral-900">
              No Products Found
            </AlertTitle>
            <AlertDescription className="text-neutral-500">
              Your inventory is currently empty. Click &quot;Add New Product&quot; to get started.
            </AlertDescription>
          </Alert>
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="rounded-[2rem] border border-neutral-100 bg-white p-5 shadow-lg shadow-neutral-200/40"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="text-neutral-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <p className="break-words text-base font-bold text-neutral-900">
                    {product.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-neutral-600">
                      {product.category.name}
                    </span>
                    {product.collectionTag !== "REGULAR" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-primary">
                        {product.collectionTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Status
                  </p>
                  <div className="mt-2">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Price
                  </p>
                  <p className="mt-2 text-base font-black text-neutral-900">
                    ${product.price}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Stock
                  </p>
                  <p className="mt-2 text-sm font-bold text-neutral-600">
                    {product.stock} units
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-bold text-neutral-600">
                    {product.category.name}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full flex-1 rounded-2xl border-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  <Link href={`/admin/product/editProduct/${product.id}`}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  onClick={() => deleteProduct(product.id)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-neutral-200 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden overflow-x-auto rounded-[2.5rem] border border-neutral-100 bg-white shadow-2xl shadow-neutral-200/50 lg:block">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Product
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Category
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Price
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Stock
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-14 h-14 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><Skeleton className="h-4 w-20 rounded" /></td>
                  <td className="px-8 py-6"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-8 py-6"><Skeleton className="h-4 w-14 rounded" /></td>
                  <td className="px-8 py-6"><Skeleton className="h-4 w-16 rounded" /></td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-xl" />
                      <Skeleton className="w-9 h-9 rounded-xl" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20">
                  <Alert className="max-w-md mx-auto rounded-3xl border-2 border-dashed bg-neutral-50/50">
                    <AlertCircle className="h-5 w-5 text-neutral-400" />
                    <AlertTitle className="text-neutral-900 font-bold uppercase tracking-tight">No Products Found</AlertTitle>
                    <AlertDescription className="text-neutral-500">
                      Your inventory is currently empty. Click &quot;Add New Product&quot; to get started.
                    </AlertDescription>
                  </Alert>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-neutral-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-900">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {product.collectionTag !== "REGULAR" && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-tighter">
                              {product.collectionTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-neutral-600">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-neutral-900">
                      ${product.price}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-neutral-500">
                      {product.stock} units
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        size="icon"
                        variant="outline"
                        className="rounded-xl border-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white"
                      >
                        <Link href={`/admin/product/editProduct/${product.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => deleteProduct(product.id)}
                        variant="outline"
                        className="rounded-xl border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
