"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  PackagePlus,
  Info,
  DollarSign,
  Layers,
  Box,
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/image-upload";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        alert("Product published successfully! ✨");
        router.push("/admin/product");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Header section with glassmorphism blur */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin/product"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1 mb-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Inventory
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase flex items-center gap-3">
              <PackagePlus className="w-8 h-8 text-primary" /> Create New
              Product
            </h1>
          </div>
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-6 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold text-lg"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Essential Details
                </h2>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                  Product Name
                </label>
                <input
                  required
                  className="w-full text-xl p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none"
                  placeholder="e.g. Ultra Horizon Slim Sneaker"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none resize-none"
                  placeholder="Tell the story behind this product..."
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Media & Visuals
                </h2>
              </div>
              <ImageUpload
                value={productData.images}
                onChange={(url) =>
                  setProductData({
                    ...productData,
                    images: [...productData.images, url],
                  })
                }
                onRemove={(url) =>
                  setProductData({
                    ...productData,
                    images: productData.images.filter((i) => i !== url),
                  })
                }
              />
            </section>
          </div>

          {/* Pricing & Category Sidebar */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6 sticky top-32">
              <div className="flex items-center gap-2 pb-2 border-b">
                <DollarSign className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Pricing & Stock
                </h2>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                  Price (USD)
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors font-bold">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full pl-8 p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-xl"
                    placeholder="0.00"
                    value={productData.price}
                    onChange={(e) =>
                      setProductData({ ...productData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                  Inventory Stock
                </label>
                <div className="relative group">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="number"
                    className="w-full pl-10 p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold"
                    placeholder="Quantity"
                    value={productData.stock}
                    onChange={(e) =>
                      setProductData({ ...productData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider">
                  Category
                </label>
                <select
                  required
                  className="w-full p-4 bg-neutral-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium appearance-none"
                  value={productData.categoryId}
                  aria-label="Category"
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      categoryId: e.target.value,
                    })
                  }
                >
                  <option value="">Choose a Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Products will be visible in the shop immediately after
                  publishing. Ensure pricing and stock counts are accurate.
                </p>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}
