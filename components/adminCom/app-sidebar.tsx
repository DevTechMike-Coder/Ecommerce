"use client";

import {
  Settings,
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/product", icon: ShoppingCart },
  { title: "Customers", url: "/admin/customers", icon: Users },
  { title: "Orders", url: "/admin/orders", icon: Truck },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-background/50 backdrop-blur-xl transition-[width] duration-300"
    >
      <SidebarHeader className="p-4 pt-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4 transition-all duration-300 overflow-hidden">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group transition-all duration-300"
        >
          <div className="shrink-0 w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-xl tracking-tighter">
              N
            </span>
          </div>
          <div className="flex flex-col opacity-100 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 transition-all duration-300 overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              NextHub Admin
            </h1>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap">
              Management Suite
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4 group-data-[collapsible=icon]:px-1 transition-all duration-300">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 group-data-[collapsible=icon]:gap-3">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`
                        group h-11 rounded-xl transition-all duration-300
                        group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11
                        group-data-[collapsible=icon]:mx-auto
                        ${
                          isActive
                            ? "bg-primary! text-primary-foreground! shadow-lg shadow-primary/25"
                            : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                        }
                      `}
                    >
                      <a href={item.url} className="flex items-center">
                        <item.icon
                          className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 group-data-[collapsible=icon]:mx-auto ${isActive ? "text-primary-foreground!" : "text-muted-foreground group-hover:text-primary"}`}
                        />
                        <span
                          className={`ml-3 font-semibold tracking-tight text-sm opacity-100 group-data-[collapsible=icon]:hidden transition-opacity ${isActive ? "text-primary-foreground!" : ""}`}
                        >
                          {item.title}
                        </span>
                        {isActive && (
                          <ChevronRight className="ml-auto w-4 h-4 opacity-80 group-data-[collapsible=icon]:hidden" />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
