"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Newspaper,
  User,
  LogOut,
  ChevronsUpDown,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

export function RoleBasedHeader() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getRoleDisplayInfo = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return { label: "Super Admin", color: "bg-red-100 text-red-800" };
      case UserRole.EXHIBITOR:
        return { label: "Exhibitor", color: "bg-orange-100 text-orange-800" };
      case UserRole.SPONSOR:
        return { label: "Sponsor", color: "bg-yellow-100 text-yellow-800" };
      case UserRole.JOBSEEKER:
        return { label: "Job Seeker", color: "bg-green-100 text-green-800" };
      case UserRole.MANNING_AGENCY:
        return {
          label: "Manning Agency",
          color: "bg-purple-100 text-purple-800",
        };
      case UserRole.VISITOR:
        return { label: "Visitor", color: "bg-blue-100 text-blue-800" };
      case UserRole.CORPORATE_PROFESSIONAL:
        return {
          label: "Corporate Professional",
          color: "bg-cyan-100 text-cyan-800",
        };
      default:
        return { label: role, color: "bg-gray-100 text-gray-800" };
    }
  };

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return "/admin";
      case UserRole.EXHIBITOR:
      case UserRole.SPONSOR:
        return "/owner";
      case UserRole.CORPORATE_PROFESSIONAL:
        return "/dashboard";
      default:
        return "/posts";
    }
  };

  const roleInfo = user?.role ? getRoleDisplayInfo(user.role) : null;

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="md:max-w-[80dvw] max-w-[90dvw] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Marino Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(getDashboardPath(user?.role || UserRole.VISITOR))
              }
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/posts")}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Posts
            </Button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profilePicture || "/avatars/default.jpg"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="w-full flex items-center justify-baseline gap-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    {roleInfo && (
                      <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                    )}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  <span>Toggle theme</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
