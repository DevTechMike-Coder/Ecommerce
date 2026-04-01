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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button
            asChild
            className="rounded-full border border-gray-400 text-sm"
            variant="outline"
          >
            <Link href="/nextecommerce/nextHub">
              <ChevronLeft />
              Back to NextHub
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
              Product Collection
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Browse the catalog with responsive filters and sorting controls
              that stay usable on smaller screens.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-border/50 bg-card/40 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Refine Results
            </p>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Filter and sort the collection
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[26rem]">
            <div className="min-w-0">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Filter By</SelectLabel>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviews">Customer Reviews</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-full">
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
        </div>
      </section>

      <section className="rounded-[2rem] border border-dashed border-border/60 bg-background/60 px-6 py-12 text-center shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Collection grid placeholder
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The control layout now scales cleanly across mobile and desktop. When
          you wire the product listing into this page, the shell is already set
          up to handle responsive content without layout shifts.
        </p>
      </section>
    </main>
  );
}
