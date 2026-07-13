"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Heart, Trash2, ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your wishlist");
      router.push("/nextecommerce/signIn?callbackURL=/nextecommerce/wishlist");
    }
  }, [session, isPending, router]);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    cart.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || undefined,
      category: item.category,
      quantity: 1,
    });

    toast.success("Added to cart", {
      description: `${item.name} has been added to your shopping cart.`,
    });
  };

  const handleRemove = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    await wishlist.removeItem(id, !!session);
    toast.success("Removed from wishlist", {
      description: `${name} has been removed from your wishlist.`,
    });
  };

  if (isPending || !session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/nextecommerce/nextHub" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground flex items-center gap-3">
            My Wishlist <Heart className="text-red-500 fill-red-500 w-8 h-8 animate-pulse" />
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your saved items. Click to add them directly to your shopping cart.
          </p>
        </div>
        <div className="text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full w-fit">
          {wishlist.items.length} {wishlist.items.length === 1 ? "Item" : "Items"} saved
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10">
        <AnimatePresence mode="popLayout">
          {wishlist.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-border/60 bg-card/30 backdrop-blur-xs px-6"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your wishlist is empty</h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Looks like you haven&apos;t added any items to your wishlist yet. Explore our shop and save your favorite items!
              </p>
              <Link
                href="/nextecommerce/nextHub"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                Start Exploring
              </Link>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {wishlist.items.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col rounded-[2rem] border border-border bg-card p-3 transition-all hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]"
                >
                  {/* Image */}
                  <div className="relative aspect-4/5 rounded-[1.5rem] overflow-hidden bg-muted mb-4">
                    {item.tag && item.tag !== "REGULAR" && (
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-foreground shadow-sm">
                        {item.tag}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleRemove(e, item.id, item.name)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground backdrop-blur-md transition-all hover:scale-110 hover:text-red-500 shadow-sm"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <ShoppingBag size={40} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between space-y-4 px-3 pb-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {item.category}
                      </p>
                      <h3 className="line-clamp-2 text-base font-bold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-lg font-black text-foreground">
                        ${item.price}
                      </p>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="flex-1 flex h-10 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-xs font-bold transition-all duration-300 hover:scale-[1.02] shadow-sm"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
