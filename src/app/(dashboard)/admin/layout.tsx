"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SidebarWrapper } from "@/components/custom-ui/sidebar/sidebar-main";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";
import { usePathname } from "next/navigation";

export default function GroupLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Hide header padding for chat page
  const isChatPage = pathname?.includes('/admin/chat');

  return (
    <Provider store={store}>
      <div
        className={
          user?.role !== UserRole.CORPORATE_PROFESSIONAL && !isChatPage ? "pt-16" : ""
        }
      >
        <SidebarWrapper>{children}</SidebarWrapper>
      </div>
      
      {/* Hide any global role-based header for chat page */}
      {isChatPage && (
        <style jsx global>{`
          header {
            display: none !important;
          }
          .role-based-header {
            display: none !important;
          }
        `}</style>
      )}
    </Provider>
  );
}
