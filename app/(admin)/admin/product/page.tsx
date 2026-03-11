import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Product() {
  return (
    <main className="px-4 md:px-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
        <h1 className="text-3xl md:text-4xl uppercase font-bold tracking-tight">
          Products
        </h1>

        <Link href="/admin/product/addProduct">
          <Button
            className="flex items-center gap-2 rounded-full cursor-pointer w-full sm:w-auto"
            variant="outline"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>
    </main>
  );
}
