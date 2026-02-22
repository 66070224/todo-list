"use server";

import { auth } from "@/auth";
import AppSidebar from "@/components/AppSidebar";
import SiteHeader from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function HomePage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader header="Home" />
      </SidebarInset>
    </SidebarProvider>
  );
}
