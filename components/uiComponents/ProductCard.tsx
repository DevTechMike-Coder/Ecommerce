"use client";

import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

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
      className="group relative bg-card rounded-[2.5rem] border border-border p-3 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2"
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
          aria-label="Add to favorites"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Heart
            className="w-5 h-5"
            fill={isHovered ? "currentColor" : "none"}
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
      <div className="px-4 pb-4 space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {category}
          </p>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="font-black text-xl text-foreground">${price}</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button 
            onClick={onAddToCartAndRedirect}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border group/btn transition-colors hover:bg-muted cursor-pointer text-foreground"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
