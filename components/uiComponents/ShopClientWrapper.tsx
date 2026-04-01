"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FlatlineReveal from "@/components/uiComponents/FlatlineReveal";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import PageTransition from "@/components/uiComponents/PageTransition";

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
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <AnimatePresence mode="wait">
        {!isAppReady ? (
          <FlatlineReveal
            key="splash"
            isSplash
            onComplete={() => setIsAppReady(true)}
          />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex min-h-screen flex-col overflow-x-clip"
          >
            <ScrollIndicator />
            {navbar}
            <main className="flex-1 w-full pt-16 sm:pt-20">
              <PageTransition>{children}</PageTransition>
            </main>
            {footer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
