"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== UserRole.CORPORATE_PROFESSIONAL) {
      router.push("/posts");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For CORPORATE_PROFESSIONAL users, render children directly
  // The sidebar is handled by SidebarWrapper in the parent layout
  if (user?.role === UserRole.CORPORATE_PROFESSIONAL) {
    return <>{children}</>;
  }

  // For non-CORPORATE_PROFESSIONAL users, redirect to posts
  return null;
}
