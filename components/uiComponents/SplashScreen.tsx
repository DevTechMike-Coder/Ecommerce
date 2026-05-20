"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    // Simulate a loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Random increments to make it feel organic and authentic
        let increment = 0;
        if (prev < 30) {
          increment = Math.floor(Math.random() * 15) + 5; // Fast start
        } else if (prev < 70) {
          increment = Math.floor(Math.random() * 8) + 2;  // Slow down slightly
        } else {
          increment = Math.floor(Math.random() * 12) + 3; // Final sprint
        }
        
        const nextProgress = prev + increment;
        return nextProgress > 100 ? 100 : nextProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Allow the 100% progress state to be visible briefly before exiting
      const timeout = setTimeout(() => {
        setIsExiting(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  useEffect(() => {
    if (isExiting) {
      // Trigger onComplete after exit animation finishes
      const timeout = setTimeout(() => {
        onComplete();
      }, 850); // Matches the exit animation duration

      return () => clearTimeout(timeout);
    }
  }, [isExiting, onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.82, y: 18, filter: "blur(10px)" },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 16,
        stiffness: 180,
        duration: 0.9,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring" as const, damping: 12, stiffness: 150 } 
    },
  };

  const brandText = "NEXT ECOMMERCE";

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center select-none overflow-hidden transition-all ${
        isExiting ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at top, color-mix(in oklab, var(--foreground) 12%, transparent) 0%, transparent 42%), radial-gradient(circle at bottom right, color-mix(in oklab, var(--muted-foreground) 10%, transparent) 0%, transparent 34%), linear-gradient(180deg, color-mix(in oklab, var(--background) 10%, black) 0%, color-mix(in oklab, var(--background) 2%, black) 100%)",
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)"
      }}
    >
      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-foreground/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-80 w-80 rounded-full bg-muted-foreground/8 blur-[120px] pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative flex flex-col items-center space-y-8 z-10">
        
        {/* Animated Glowing Logo Mark */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate={isReady ? "show" : "hidden"}
          className="relative group cursor-default"
        >
          {/* Rotating Outer Gradient Glow */}
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-white/45 via-neutral-300/25 to-white/45 blur opacity-60 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt" />
          
          {/* Main Logo Container */}
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-background/95 p-0.5"
            style={{
              boxShadow: "0 0 45px rgba(255, 255, 255, 0.12)",
            }}
          >
            {/* Spinning inner gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/90 via-neutral-300/55 to-white/80 opacity-70 animate-spin [animation-duration:12s]" />
            
            {/* Inner Content */}
            <div className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-background/95">
              <span className="bg-linear-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-5xl font-black tracking-tighter text-transparent select-none">
                N
              </span>
            </div>
          </div>
        </motion.div>

        {/* Brand Text Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isReady ? "show" : "hidden"}
          className="flex space-x-1 sm:space-x-1.5"
        >
          {brandText.split("").map((char, index) => {
            if (char === " ") {
              return <span key={index} className="w-2 sm:w-3" />;
            }
            return (
              <motion.span
                key={index}
                variants={letterVariants}
                className="bg-linear-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text font-sans text-2xl font-extrabold tracking-widest text-transparent sm:text-3xl"
              >
                {char}
              </motion.span>
            );
          })}
        </motion.div>

        {/* Sleek Progress Bar Container */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <div className="relative h-0.75 w-56 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="relative h-full rounded-full bg-linear-to-r from-white via-neutral-100 to-neutral-400"
            >
              {/* Progress Glow Dot */}
              <div
                className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-white animate-pulse"
                style={{
                  boxShadow:
                    "0 0 8px rgba(255, 255, 255, 0.55), 0 0 14px rgba(255, 255, 255, 0.3)",
                }}
              />
            </motion.div>
          </div>
          
          {/* Progress Percentage Display */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono tracking-widest text-white/60 select-none">
              LOADING
            </span>
            <span className="min-w-10 text-right font-mono text-xs font-bold text-white">
              {progress}%
            </span>
          </div>
        </div>

      </div>

      {/* Futuristic bottom subtext */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/35 sm:text-xs">
          POWERED BY NEXT.JS 16
        </span>
      </motion.div>
    </div>
  );
}
