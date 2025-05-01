import { AppSidebar } from "@/components/sidebar/app-sidebar";
import NavTop from "@/components/sidebar/nav-top";

import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/use-toast";
import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";

function DashboardLayoutInner() {
  const location = useLocation();
  const { setOpenMobile, setOpen, isMobile } = useSidebar();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      window.scrollTo(0, 0);

      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }

      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, setOpenMobile, setOpen, isMobile]);

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <NavTop />
        <Outlet />
      </SidebarInset>
      <Toaster />
    </>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutInner />
    </SidebarProvider>
  );
}
