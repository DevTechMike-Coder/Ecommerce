import { AppSidebar } from "@/components/adminCom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ScrollIndicator from "@/components/uiComponents/ScrollIndicator";
import PageTransition from "@/components/uiComponents/PageTransition";
import React from "react";
import { isAdmin, getAdminCount, getUserSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function NextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await isAdmin();
  
  if (!isAuthorized) {
    const session = await getUserSession();
    
    // If the user is logged in but not authorized, they are a normal user attempting to access admin
    if (session?.user) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
          <div className="flex max-w-md flex-col items-center space-y-4 rounded-xl border border-red-100 bg-white p-8 text-center shadow-lg">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
            <p className="text-gray-500">
              You do not have permission to access the admin panel. This area is restricted to administrators.
            </p>
            <Link 
              href="/"
              className="mt-4 rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }

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
        <PageTransition>{children}</PageTransition>
      </SidebarInset>
    </SidebarProvider>
  );
}

