// /app/components/custom-ui/sidebar/admin-sidebar.tsx
"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  UserCog,
  Bell,
  Building,
  Lock,
  FileText,
  BarChart,
  AlertTriangle,
  Database,
  MessageSquare
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

const adminNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Chat",
      url: "/admin/chat", // Updated route
      icon: MessageSquare,
    },
    {
      title: "User Management",
      url: "/admin/manage-users",
      icon: Users,
      // items: [
      //   {
      //     title: "Owner Accounts",
      //     url: "/admin/owners",
      //   },
      //   {
      //     title: "Registration Approvals",
      //     url: "/admin/users/approvals",
      //   },
      //   {
      //     title: "Account Recovery",
      //     url: "/admin/users/recovery",
      //   },
      // ],
    },
    {
      title: "Role",
      url: "/admin/user-roles",
      icon: Shield,
      // items: [
      //   {
      //     title: "Password Policies",
      //     url: "/admin/security/password-policies",
      //   },
      //   {
      //     title: "MFA Settings",
      //     url: "/admin/security/mfa-settings",
      //   },
      //   {
      //     title: "Account Lockout Rules",
      //     url: "/admin/security/lockout-rules",
      //   },
      // ],
    },
    // {
    //   title: "Monitoring",
    //   url: "/admin/monitoring",
    //   icon: BarChart,
    //   items: [
    //     {
    //       title: "System Audit Logs",
    //       url: "/admin/monitoring/audit-logs",
    //     },
    //     {
    //       title: "Security Alerts",
    //       url: "/admin/monitoring/security-alerts",
    //     },
    //     {
    //       title: "Platform Usage Stats",
    //       url: "/admin/monitoring/usage-stats",
    //     },
    //   ],
    // },
    // {
    //   title: "Content Management",
    //   url: "/admin/content",
    //   icon: FileText,
    //   items: [
    //     {
    //       title: "Industry Categories",
    //       url: "/admin/content/industries",
    //     },
    //     {
    //       title: "Terms & Conditions",
    //       url: "/admin/content/terms",
    //     },
    //     {
    //       title: "Email Templates",
    //       url: "/admin/content/emails",
    //     },
    //   ],
    // },
    // {
    //   title: "System Settings",
    //   url: "/admin/settings",
    //   icon: Settings,
    //   items: [
    //     {
    //       title: "General Configuration",
    //       url: "/admin/settings/general",
    //     },
    //     {
    //       title: "Notification Settings",
    //       url: "/admin/settings/notifications",
    //     },
    //     {
    //       title: "Integration Settings",
    //       url: "/admin/settings/integrations",
    //     },
    //   ],
    // },
  ],
  // Admin specific teams/areas
  sections: [
    {
      name: "System Health",
      url: "/admin/health",
      icon: AlertTriangle,
    },
    {
      name: "Data Management",
      url: "/admin/data",
      icon: Database,
    },
    {
      name: "Business Verification",
      url: "/admin/verification",
      icon: Building,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // Create user object for NavUser component
  const userData = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: "/avatars/admin.jpg", // Default avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dummyData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}