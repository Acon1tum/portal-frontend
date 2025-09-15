"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";
import { RoleBasedHeader } from "@/components/custom-ui/header/role-based-header";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <>
      {user?.role !== UserRole.CORPORATE_PROFESSIONAL && <RoleBasedHeader />}
      <div>
        {" "}
        {/* Add padding to account for fixed header */}
        {children}
      </div>
    </>
  );
}
