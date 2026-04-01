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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Collection() {
  return (
    <main className="min-h-screen">
      <Link href="/nextecommerce/nextHub">
        <Button
          className="flex items-center gap-2 cursor-pointer border border-gray-400 rounded-full"
          variant="outline"
        >
          <ChevronLeft />
          Back to NextHub
        </Button>
      </Link>

      <div className="flex items-center justify-center py-5">
        <h1 className="text-2xl font-bold tracking-tight uppercase">
          Product Collection
        </h1>
      </div>

      <section>
        {/* <div>
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 rounded-full px-5 py-2 outline-0"
          />
        </div> */}

        <div className="flex items-center gap-4 py-4">
          <div>
            <Select>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter By</SelectLabel>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="rating">Customer Reviews</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </main>
  );
}
