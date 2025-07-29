// /app/main/layout.tsx
"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { AppSidebar } from "@/components/custom-ui/sidebar/side-bar-components/app-sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </Provider>
  );
}