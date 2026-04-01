"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface FlatlineRevealProps {
  children?: ReactNode;
  isSplash?: boolean;
  onComplete?: () => void;
}

export default function FlatlineReveal({
  children,
  isSplash = false,
  onComplete,
}: FlatlineRevealProps) {
  useEffect(() => {
    if (isSplash && onComplete) {
      const timer = setTimeout(onComplete, 1800); // Wait for line + partial fade
      return () => clearTimeout(timer);
    }
  }, [isSplash, onComplete]);

  return (
    <div
      className={
        isSplash
          ? "fixed inset-0 z-100 flex items-center justify-center bg-background select-none"
          : "relative flex flex-col items-center w-full"
      }
    >
      {/* Horizontal line that draws itself */}
      <motion.div
        className={isSplash ? "w-full" : "w-full flex items-center justify-center mb-10"}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-px bg-linear-to-r from-transparent via-foreground/40 to-transparent mx-auto"
          initial={{ width: "0%" }}
          animate={{ width: isSplash ? "100%" : "80%" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>


      {/* Content fades in after line finishes */}
      {children && (
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

