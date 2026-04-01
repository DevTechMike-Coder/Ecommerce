import Footer from "@/components/pagecomponents/footer";
import NavBar from "@/components/pagecomponents/navbar";
import ShopClientWrapper from "@/components/uiComponents/ShopClientWrapper";
import React from "react";

export default async function NextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopClientWrapper navbar={<NavBar />} footer={<Footer />}>
      {children}
    </ShopClientWrapper>
  );
}


