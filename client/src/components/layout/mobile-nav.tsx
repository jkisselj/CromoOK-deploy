import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Plus, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const location = useLocation();
    const { user } = useAuthContext();
    const { isMobile } = useSidebar();

    if (!isMobile) return null;

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const navItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "Locations", icon: MapPin, path: "/locations" },
        ...(user ? [{ label: "Add", icon: Plus, path: "/locations/new" }] : []),
        { label: user ? "Profile" : "Sign In", icon: User, path: user ? "/profile" : "/auth/login" },
    ];

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-2 flex justify-around items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-colors",
                            isActive(item.path)
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-xs">{item.label}</span>
                    </Link>
                ))}

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground h-auto"
                            size="sm"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="text-xs">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0">
                    </SheetContent>
                </Sheet>
            </div>

            <div className="lg:hidden h-16"></div>
        </>
    );
}