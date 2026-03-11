import { AppSidebar } from "@/components/adminCom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import React from "react";

export default function NextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="m-4" />
        <ScrollIndicator />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
