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
    <div className="flex flex-col min-h-screen">
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
            className="flex flex-col min-h-screen"
          >
            <ScrollIndicator />
            {navbar}
            <main className="flex-1 pt-20 px-4 md:px-6 lg:px-8 container mx-auto">
              <PageTransition>{children}</PageTransition>
            </main>
            {footer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
