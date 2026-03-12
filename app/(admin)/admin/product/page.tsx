"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, Tag, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50/30 pb-20 px-4 md:px-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-10">
        <div className="space-y-1">
          <h1 className="text-4xl uppercase font-black tracking-tighter text-neutral-900">
            Inventory
          </h1>
          <p className="text-neutral-500 font-medium">Manage your product catalog and stock levels.</p>
        </div>

        <Link href="/admin/product/addProduct">
          <Button className="flex items-center gap-3 rounded-2xl px-8 py-6 h-auto bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl shadow-black/10 transition-all hover:-translate-y-1">
            <Plus className="w-5 h-5" /> 
            <span className="font-bold uppercase tracking-wider text-sm">Add New Product</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl shadow-neutral-200/50 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Product</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Category</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Price</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Stock</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {loading ? (
               <tr>
                <td colSpan={6} className="text-center py-20 text-neutral-400 font-medium">Loading products...</td>
               </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-neutral-400 font-medium">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="group hover:bg-neutral-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
                         {product.images?.[0] ? (
                           <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><Package className="text-neutral-300" /></div>
                         )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-900">{product.name}</p>
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
                    <span className="text-sm font-medium text-neutral-600">{product.category.name}</span>
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
                    <p className="font-black text-neutral-900">${product.price}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-neutral-500">{product.stock} units</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100">
                      <Button size="icon" variant="outline" className="rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" onClick={() => deleteProduct(product.id)} variant="outline" className="rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
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
