import type { Metadata } from "next";
import "./globals.css"
import { Toaster } from "@/components/ui/sonner";
import SplashScreenProvider from "@/components/uiComponents/SplashScreenProvider";

export const metadata: Metadata = {
  title: "Next Ecommerce",
  description: "A premium ecommerce experience built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SplashScreenProvider>
          {children}
        </SplashScreenProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
