"use client";

import * as React from "react";
import { AudioWaveform, Command } from "lucide-react"; // Import React components for logos
import { cn } from "@/lib/utils"; // Utility function for class names

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Define a type for the logo, which can either be a string (image path) or a React component
type Logo = string | React.ElementType;

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: Logo; // Updated type to support both string and React component
    plan: string;
  }[];
}) {
  const { isMobile, open } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className={cn("flex items-center justify-between gap-2 ", "peer-data-[state=collapsed]:justify-center ")}> {/* Add gap for spacing */}
        <SidebarMenuButton
          size="lg"
          className={cn(
            "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2",
            !open && "hidden" // Hide the button when the sidebar is not open
          )}
        >
          {/* Render the logo conditionally */}
          {!isMobile && (
            <div
              className={cn(
                "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-opacity duration-200 ease-linear"
              )}
            >
              {typeof activeTeam.logo === "string" ? (
                <img
                  src={activeTeam.logo}
                  alt={`${activeTeam.name} Logo`}
                  className="size-6 rounded-sm " // Adjust size and styling as needed
                />
              ) : (
                <activeTeam.logo className="size-4" />
              )}
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
        <SidebarTrigger className="flex justify-start " /> 
      </SidebarMenuItem>
    </SidebarMenu>
  );
}