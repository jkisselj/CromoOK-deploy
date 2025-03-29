import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col">
        <AppSidebar className="fixed right-0 shrink-0 hidden lg:flex" />
        <SidebarInset className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
