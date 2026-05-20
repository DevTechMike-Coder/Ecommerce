"use client";

import { useState, useSyncExternalStore } from "react";
import SplashScreen from "./SplashScreen";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

export default function SplashScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const hasSeenSplash =
    isMounted && sessionStorage.getItem("hasSeenSplashScreen") === "true";
  const showSplash = isMounted && !hasSeenSplash && !isDismissed;

  const handleComplete = () => {
    sessionStorage.setItem("hasSeenSplashScreen", "true");
    setIsDismissed(true);
  };

  return (
    <div className="relative min-h-screen">
      {isMounted && showSplash && (
        <SplashScreen key="app-splash" onComplete={handleComplete} />
      )}
      <div
        className={`transition-opacity duration-700 ease-out ${
          showSplash
            ? "opacity-0 pointer-events-none max-h-screen overflow-hidden"
            : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
