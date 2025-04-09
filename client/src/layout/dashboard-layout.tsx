import { AppSidebar } from "@/components/sidebar/app-sidebar";
import NavTop from "@/components/sidebar/nav-top";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavTop />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
