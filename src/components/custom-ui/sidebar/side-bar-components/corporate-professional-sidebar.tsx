// /app/components/custom-ui/sidebar/corporate-professional-sidebar.tsx
"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Newspaper,
  User,
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
import { useAuth } from "@/lib/auth-context";

const corporateProfessionalNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Post Management",
      url: "/post-management",
      icon: Newspaper,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ],
};

export function CorporateProfessionalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Create user object for NavUser component
  const userData = {
    name: user?.name || "Corporate Professional",
    email: user?.email || "professional@example.com",
    avatar: "/avatars/professional.jpg", // Default avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dummyData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={corporateProfessionalNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}