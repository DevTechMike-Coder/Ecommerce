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
    <>
      <ScrollIndicator />
      <NavBar /> {children} <Footer />
    </>
  );
}
