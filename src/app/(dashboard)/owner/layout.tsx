"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SidebarWrapper } from "@/components/custom-ui/sidebar/sidebar-main";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/utils/types";

export default function GroupLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  return (
    <Provider store={store}>
      <div className={user?.role !== UserRole.CORPORATE_PROFESSIONAL ? "pt-16" : ""}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </div>
    </Provider>
  );
}