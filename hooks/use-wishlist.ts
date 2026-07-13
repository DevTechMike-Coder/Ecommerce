"use client";

import { create } from "zustand";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  category: string;
  tag?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: WishlistItem, sessionExists: boolean) => Promise<void>;
  removeItem: (id: string, sessionExists: boolean) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/user/wishlist");
      if (res.ok) {
        const data = await res.json();
        set({ items: data });
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (product: WishlistItem, sessionExists: boolean) => {
    const current = get().items;
    if (current.some(item => item.id === product.id)) return;
    
    set({ items: [...current, product] });

    if (sessionExists) {
      try {
        const res = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id })
        });
        if (!res.ok) {
          set({ items: current });
          toast.error("Failed to sync wishlist with server");
        }
      } catch (error) {
        set({ items: current });
        console.error("Failed to add to wishlist database:", error);
      }
    }
  },
  removeItem: async (id: string, sessionExists: boolean) => {
    const current = get().items;
    set({ items: current.filter(item => item.id !== id) });

    if (sessionExists) {
      try {
        const res = await fetch(`/api/user/wishlist?productId=${id}`, {
          method: "DELETE"
        });
        if (!res.ok) {
          set({ items: current });
          toast.error("Failed to remove item from server");
        }
      } catch (error) {
        set({ items: current });
        console.error("Failed to delete from wishlist database:", error);
      }
    }
  },
  isInWishlist: (id: string) => {
    return get().items.some(item => item.id === id);
  },
  clearWishlist: () => set({ items: [] })
}));
