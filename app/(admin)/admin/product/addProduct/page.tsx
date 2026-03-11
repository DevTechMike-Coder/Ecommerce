import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddProduct() {
  return (
    <main className="px-4 md:px-10">
      <div className="py-4">
        <Link href="/admin/product">
          <Button
            variant="outline"
            className="rounded-3xl cursor-pointer flex items-center gap-2"
          >
            <ChevronLeft /> Return Back
          </Button>
        </Link>
      </div>

      <div className="py-4">
        <h1 className="text-4xl font-bold tracking-tight uppercase">Add New Products</h1>
      </div>
    </main>
  );
}
