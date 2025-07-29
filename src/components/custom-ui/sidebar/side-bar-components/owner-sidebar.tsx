// /app/components/custom-ui/sidebar/owner-sidebar.tsx
"use client";

import * as React from "react";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  Bell,
  Settings,
  Building2,
  LineChart,
  FileText,
  Clock
} from "lucide-react";

import Dashboard from "@/app/(dashboard)/dashboard/page";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { useAuth } from "@/lib/auth-context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { dummyData } from "@/utils/dummy-data";

export function OwnerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const ownerNavData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/owner",
        icon: LayoutDashboard,
      },
      // {
      //   title: "Profile",
      //   url: "/owner/profile",
      //   icon: User,
      // },
      {
        title: "Messages",
        url: "/owner/messages",
        icon: MessageSquare,
        badge: 7, // Number of unread messages
      },
      {
        title: "Connections",
        url: "/owner/connections",
        icon: Users,
        items: [
          {
            title: "All Connections",
            url: "/owner/connections",
          },
          {
            title: "Connection Requests",
            url: "/owner/connections/requests",
            badge: 2, // Number of connection requests
          },
        ],
      },
      {
        title: "Company",
        url: "/owner/company",
        icon: Building2,
        items: [
          {
            title: "Business Information",
            url: "/owner/company/business-info",
          },
          {
            title: "Team Activity Logs",
            url: "/owner/company/activity",
          },
          {
            title: "Documents",
            url: "/owner/company/documents",
          },
        ],
      }, 

      {
        title: "Notifications",
        url: "/owner/notifications",
        icon: Bell,
        badge: 3, // Number of unread notifications
        items: [
          {
            title: "Notification Center",
            url: "/owner/notifications",
          },
          {
            title: "Notification Settings",
            url: "/owner/notifications/settings",
          },
          {
            title: "Login Activity",
            url: "/owner/notifications/activity",
          },
        ],
      },
        {
        title: "Settings",
        url: "/owner/settings",
        icon: Settings,
        items: [
          {
            title: "General Settings",
            url: "/owner/settings",
          },
          {
            title: "Password Management",
            url: "/owner/settings/password",
          },
          {
            title: "MFA Setup",
            url: "/owner/settings/mfa",
          },
        ],
      },
    ],
    // Owner specific links
    business: [
      {
        name: "Analytics",
        url: "/owner/analytics",
        icon: LineChart,
      },
      {
        name: "Documents",
        url: "/owner/documents",
        icon: FileText,
      },
      {
        name: "Scheduled Meetings",
        url: "/owner/meetings",
        icon: Clock,
      },
    ],
  };

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
        <NavMain items={ownerNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}