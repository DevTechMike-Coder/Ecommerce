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
    if (adminCount === 0) {
      // If no admin exists, redirect to the one-time setup page
      return redirect("/admin/setup");
    } else {
      // If an admin already exists, deny access and redirect to public login
      return redirect("/nextecommerce/signIn");
    }
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

