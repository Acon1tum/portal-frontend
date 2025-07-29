"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RootState } from "@/lib/store";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    NoAccessRole?: string[];
    items?: {
      title: string;
      url: string;
      NoAccessRole?: string[];
    }[];
  }[];
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = !user;
  const userRole = String(user?.role);
  console.log(userRole);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="scroll-none">
        {items.map((item) => {
          // Check role-based access for main menu items
          if (item.NoAccessRole) {
            // If the user is still loading or there's no role, do not display restricted items
            if (loading || !userRole) return null;

            // Determine if the user's role is included in the restricted roles
            const noAccess = Array.isArray(item.NoAccessRole)
              ? item.NoAccessRole.includes(userRole)
              : item.NoAccessRole === userRole;

            if (noAccess) return null;
          }

          const hasSubItems = item.items && item.items.length > 0;

          // For items without subitems
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                
              </SidebarMenuItem>
            );
          }

          // Filter sub-items based on role access
          const filteredSubItems =
            item.items?.filter((subItem) => {
              if (subItem.NoAccessRole) {
                if (loading || !userRole) return false;

                const noAccess = Array.isArray(subItem.NoAccessRole)
                  ? subItem.NoAccessRole.includes(userRole)
                  : subItem.NoAccessRole === userRole;

                return !noAccess;
              }
              return true;
            }) ?? [];

          // Skip rendering this section if all sub-items are filtered out
          if (filteredSubItems.length === 0) return null;

          // For items with subitems
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible scroll-none"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {filteredSubItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
