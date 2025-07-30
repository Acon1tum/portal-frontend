"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SidebarWrapper } from "@/components/custom-ui/sidebar/sidebar-main";

export default function ManageUsersLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SidebarWrapper>{children}</SidebarWrapper>
    </Provider>
  );
} 