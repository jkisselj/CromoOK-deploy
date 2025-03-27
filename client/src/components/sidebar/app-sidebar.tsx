import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  Map,
  BarChart2,
  Brain,
  Settings,
  Filter,
  CalendarRange,
  ClipboardCheck,
  ListTodo,
  BanknoteIcon,
  Clock,
  UserPlus,
  LayoutDashboard,
  Building2,
  Shield,
  UserCog,
  Calculator,
  CreditCard as PaymentIcon,
  Percent,
  FileSpreadsheet,
  MessageCircle,
  Bell,
  Star,
  MapPinned,
  Navigation,
  LineChart,
  TrendingUp,
  UserSquare,
  FileBarChart,
  Sparkles,
  FileText,
  Palette,
  ScanSearch,
  GitBranch,
  Lock,
  HardDrive,
  Scale,
  FileCheck,
  Plus
} from "lucide-react";

import { Link } from "react-router-dom";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/hooks/useAuthContext";

const data = {
  getNavMain: (isAuthenticated: boolean) => [
    {
      title: "Locations",
      url: "/locations",
      icon: MapPin,
      items: [
        { title: "All Locations", url: "/locations", icon: Building2 },
        ...(isAuthenticated ? [
          { title: "Add Location", url: "/locations/new", icon: Plus }
        ] : []),
        { title: "Search and Filters", url: "#", icon: Filter },
        { title: "Availability Calendar", url: "#", icon: CalendarRange },
      ],
    },
    {
      title: "Booking",
      url: "#",
      icon: Calendar,
      items: [
        { title: "Request and Confirmation", url: "#", icon: ClipboardCheck },
        { title: "Status Management", url: "#", icon: ListTodo },
        { title: "Cancellation and Refund", url: "#", icon: BanknoteIcon },
        { title: "Shooting Schedule", url: "#", icon: Clock },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        { title: "Registration and Login", url: "#", icon: UserPlus },
        { title: "Customer Dashboard", url: "#", icon: LayoutDashboard },
        { title: "Owner Dashboard", url: "#", icon: Building2 },
        { title: "Admin Panel", url: "#", icon: Shield },
        { title: "Roles and Permissions", url: "#", icon: UserCog },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      items: [
        { title: "Cost Calculation", url: "#", icon: Calculator },
        { title: "Payment System Integration", url: "#", icon: PaymentIcon },
        { title: "Platform Commission", url: "#", icon: Percent },
        { title: "Financial Reporting", url: "#", icon: FileSpreadsheet },
      ],
    },
    {
      title: "Communication",
      url: "#",
      icon: MessageSquare,
      items: [
        { title: "Built-in Chat", url: "#", icon: MessageCircle },
        { title: "Notifications", url: "#", icon: Bell },
        { title: "Reviews and Ratings", url: "#", icon: Star },
      ],
    },
    {
      title: "Map",
      url: "#",
      icon: Map,
      items: [
        { title: "Map Integration", url: "#", icon: MapPinned },
        { title: "Location Display", url: "#", icon: Map },
        { title: "Route Building", url: "#", icon: Navigation },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart2,
      items: [
        { title: "Statistics and Reports", url: "#", icon: LineChart },
        { title: "Location Popularity", url: "#", icon: TrendingUp },
        { title: "User Behavior", url: "#", icon: UserSquare },
        { title: "Admin Reports", url: "#", icon: FileBarChart },
      ],
    },
    {
      title: "AI / ML",
      url: "#",
      icon: Brain,
      items: [
        { title: "Recommendations", url: "#", icon: Sparkles },
        { title: "Description Generation", url: "#", icon: FileText },
        { title: "Style-based Matching", url: "#", icon: Palette },
        { title: "Object Recognition", url: "#", icon: ScanSearch },
      ],
    },
    {
      title: "System Capabilities",
      url: "#",
      icon: Settings,
      items: [
        { title: "CI/CD", url: "#", icon: GitBranch },
        { title: "Security and Access", url: "#", icon: Lock },
        { title: "Storage and Files", url: "#", icon: HardDrive },
        { title: "Scalability", url: "#", icon: Scale },
        { title: "GDPR Compliance", url: "#", icon: FileCheck },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon" side="right" {...props}>
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center justify-center w-full py-4 transition-all duration-200"
        >
          <span className="text-xl font-semibold text-sidebar-foreground transition-all text-center">
            <span className="group-data-[collapsible=icon]:hidden">SceneHunter</span>
            <span className="hidden group-data-[collapsible=icon]:inline">SH</span>
          </span>
        </Link>
        <SidebarSeparator className="w-full" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.getNavMain(!!user)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}