import {
  ChevronsUpDown,
  LogOut,
  LogIn,
  User,
  Settings,
  HelpCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function NavUser() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { isMobile } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutDialog(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            <ThemeToggle />
            <Link to="/auth/login" className="w-full">
              <SidebarMenuButton
                size="lg"
                className="w-full flex items-center justify-center gap-2 hover:bg-sidebar-accent"
              >
                <LogIn className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
              </SidebarMenuButton>
            </Link>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const getInitials = () => {
    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:mb-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="flex-1">
                <SidebarMenuButton
                  size="lg"
                  className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-lg border">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.email}
                    />
                    <AvatarFallback className="rounded-lg text-sm font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight max-w-[120px] md:max-w-[150px]">
                    <span className="truncate font-medium">
                      {user.user_metadata?.name || user.email}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 p-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg border">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.name || user.email}
                      />
                      <AvatarFallback className="rounded-lg text-sm font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 leading-tight">
                      <span className="truncate font-medium">
                        {user.user_metadata?.name || user.email}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/help" className="flex items-center cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="cursor-pointer text-red-500 hover:text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}