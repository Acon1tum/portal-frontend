// /app/components/custom-ui/sidebar/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  MessageCircleHeart,
  MessageSquare,
  PieChart,
  Settings2,
  SquareTerminal,
  User2Icon,
  UserCheck2,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { dummyData } from "@/utils/dummy-data";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/lib/auth-context";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard", // Updated route
      icon: SquareTerminal,
    },
    {
      title: "Chat",
      url: "/chat", // Updated route
      icon: MessageSquare,
    },
    {
      title: "Manage Users",
      url: "#", // Updated route (you can create this page later)
      icon: User2Icon,
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      NoAccessRole: ["Facilitator"],
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
          NoAccessRole: ["Facilitator"],
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      NoAccessRole: ["Doctor"],
      title: "Roles & Permissions",
      url: "#",
      icon: UserCheck2,
      items: [
        {
          title: "Role",
          url: "#", // Updated route (you can create this page later)
        },
        {
          title: "Permissions",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      NoAccessRole: ["Facilitator"],
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Create user object for NavUser component
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/default.jpg", // Default avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dummyData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
