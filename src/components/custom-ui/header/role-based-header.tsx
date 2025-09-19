"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Newspaper,
} from "lucide-react";

export function RoleBasedHeader() {
  const { user } = useAuth();
  const router = useRouter();

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
        </div>
      </div>
    </header>
  );
}
