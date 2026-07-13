"use client";

import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  tag?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  tag,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const wishlist = useWishlist();
  const isWishlisted = wishlist.isInWishlist(id);

  const onToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in first", {
        description: "You need to be logged in to add items to your wishlist.",
      });
      
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/nextecommerce/signIn?callbackURL=${callbackUrl}`);
      return;
    }

    try {
      if (isWishlisted) {
        await wishlist.removeItem(id, true);
        toast.success("Removed from wishlist", {
          description: `${name} has been removed from your wishlist.`,
        });
      } else {
        await wishlist.addItem(
          {
            id,
            name,
            price,
            image,
            category,
            tag,
          },
          true
        );
        toast.success("Added to wishlist", {
          description: `${name} has been added to your wishlist.`,
          icon: <Heart className="h-4 w-4 text-red-500 fill-red-500" />,
        });
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Something went wrong updating your wishlist.");
    }
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in first", {
        description: "You need to be logged in to add items to your cart.",
      });
      
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/nextecommerce/signIn?callbackURL=${callbackUrl}`);
      return;
    }
    
    cart.addItem({
      id,
      name,
      price,
      image,
      category,
      quantity: 1
    });

    toast.success("Added to cart", {
      description: `${name} has been added to your shopping cart.`,
      icon: <Check className="h-4 w-4 text-green-500" />,
    });
  };

  const onAddToCartAndRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in first", {
        description: "You need to be logged in to add items to your cart.",
      });
      
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/nextecommerce/signIn?callbackURL=${callbackUrl}`);
      return;
    }

    onAddToCart(e);
    router.push("/nextecommerce/cart");
  };

  return (
    <div
      className="group relative flex h-full flex-col rounded-[2.5rem] border border-border bg-card p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 rounded-[2rem] overflow-hidden bg-muted mb-6">
        {tag && tag !== "REGULAR" && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-4 py-1.5 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm">
              {tag}
            </span>
          </div>
        )}

        <button
          onClick={onToggleWishlist}
          aria-label="Add to favorites"
          className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/95 shadow-sm backdrop-blur-md transition-all hover:scale-110 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${
            isWishlisted ? "text-red-500 sm:opacity-100 sm:translate-y-0" : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart
            className="w-5 h-5 transition-transform active:scale-95 duration-200"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {/* Action icon or Quick View could go here, but for now we're simplifying */}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between space-y-4 px-4 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {category}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="line-clamp-2 text-base leading-tight font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
              {name}
            </h3>
            <p className="text-lg font-black text-foreground sm:text-xl">
              ${price}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-stretch sm:justify-end">
          <button
            onClick={onAddToCartAndRedirect}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-foreground transition-colors hover:bg-muted sm:h-12 sm:w-12"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-semibold sm:hidden">Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
