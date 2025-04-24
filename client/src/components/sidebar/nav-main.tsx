import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: { title: string; url: string; icon: any; isActive?: boolean; items?: { title: string; url: string; icon: any; }[]; }[] }) {
  const { setOpen, state } = useSidebar();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const handleItemClick = (e: React.MouseEvent, itemTitle: string) => {
    if (state === "collapsed") {
      e.preventDefault();
      setOpen(true);
    } else if (state === "expanded") {
      setOpenStates(prev => ({
        ...prev,
        [itemTitle]: !prev[itemTitle]
      }));
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openStates[item.title] || false}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={(e) => handleItemClick(e, item.title)}
                >
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          {subItem.icon && <subItem.icon className="size-4" />}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
