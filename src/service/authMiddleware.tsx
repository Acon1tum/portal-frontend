"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/utils/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  allowedRoles, 
  redirectTo = "/auth" 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, requiredRole, allowedRoles, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for different role-based routes
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/auth">
      {children}
    </AuthGuard>
  );
}

export function OwnerGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard 
      allowedRoles={[UserRole.EXHIBITOR, UserRole.SPONSOR, UserRole.SUPERADMIN]} 
      redirectTo="/auth"
    >
      {children}
    </AuthGuard>
  );
}

export function AuthenticatedGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard redirectTo="/auth">
      {children}
    </AuthGuard>
  );
}