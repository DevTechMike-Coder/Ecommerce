import Footer from "@/components/pagecomponents/footer";
import NavBar from "@/components/pagecomponents/navbar";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import React from "react";

export default function NextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollIndicator />
      <NavBar />
      <main className="flex-1 pt-20 px-4 md:px-6 lg:px-8 container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
