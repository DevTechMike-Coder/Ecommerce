import { AppSidebar } from "@/components/adminCom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import React from "react";
import { isAdmin, getAdminCount } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function NextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await isAdmin();
  
  if (!isAuthorized) {
    const adminCount = await getAdminCount();
    // Dynamically redirect to signup if no admin exists, otherwise to login
    return redirect(adminCount === 0 ? "/admin/signup" : "/admin/login");
  }



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

