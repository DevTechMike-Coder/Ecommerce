"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import PageTransition from "@/components/uiComponents/PageTransition";

import { useEffect } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { authClient } from "@/lib/auth-client";

interface ShopClientWrapperProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export default function ShopClientWrapper({
  children,
  navbar,
  footer,
}: ShopClientWrapperProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const wishlist = useWishlist();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      wishlist.fetchWishlist();
    } else {
      wishlist.clearWishlist();
    }
  }, [session, wishlist.fetchWishlist, wishlist.clearWishlist]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-screen flex-col overflow-x-clip"
    >
      <ScrollIndicator />
      {mounted ? navbar : <div className="h-16 sm:h-20" />}
      <main className="flex-1 w-full pt-16 sm:pt-20">
        <PageTransition>{children}</PageTransition>
      </main>
      {mounted ? footer : null}
    </motion.div>
  );
}
