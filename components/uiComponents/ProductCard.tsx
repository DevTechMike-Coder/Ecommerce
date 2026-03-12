"use client";

import Image from "next/image";
import { MoveRight, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  tag?: string;
}

export default function ProductCard({ name, price, image, category, tag }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-[2.5rem] border border-neutral-100 p-3 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 rounded-[2rem] overflow-hidden bg-neutral-50 mb-6">
        {tag && tag !== "REGULAR" && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-neutral-900 shadow-sm">
              {tag}
            </span>
          </div>
        )}
        
        <button 
          aria-label="Add to favorites"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Heart className="w-5 h-5" fill={isHovered ? "currentColor" : "none"} />
        </button>

        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-200">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-neutral-900 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-black/10">
                Quick View
            </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {category}
          </p>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-bold text-lg text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="font-black text-xl text-neutral-900">
              ${price}
            </p>
          </div>
        </div>

        <button className="w-full flex items-center justify-between group/btn py-1">
            <span className="text-xs font-bold uppercase tracking-widest group-hover/btn:translate-x-1 transition-transform">
                Add to Cart
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover/btn:scale-110 transition-all">
                <MoveRight className="w-4 h-4" />
            </div>
        </button>
      </div>
    </div>
  );
}
