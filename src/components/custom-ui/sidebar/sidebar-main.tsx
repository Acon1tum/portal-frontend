import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./side-bar-components/app-sidebar";
import { OwnerSidebar } from "./side-bar-components/owner-sidebar";
import { AdminSidebar } from "./side-bar-components/admin-sidebar";
import React from "react";
import { ModeToggle } from "@/components/theme-trigger";
import { usePathname } from "next/navigation";

interface SidebarWrapperProps {
  children: React.ReactNode;
  breadcrumbItems?: {
    label: string;
    href?: string;
    active?: boolean;
  }[];
}

export function SidebarWrapper({
  children,
  breadcrumbItems = [{ label: "Dashboard", active: true }],
}: SidebarWrapperProps) {
  const pathname = usePathname();
  
  // Determine which sidebar to render based on the current path
  const renderSidebar = () => {
    if (pathname.startsWith("/admin")) {
      return <AdminSidebar />;
    } else if (pathname.startsWith("/owner")) {
      return <OwnerSidebar />;
    } else {
      return <AppSidebar />;
    }
  };

  return (
    <>
      <SidebarProvider>
        {renderSidebar()}
        <SidebarInset>
          {/* <header className="flex h-10 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={item.label}>
                      {index > 0 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                      <BreadcrumbItem
                        className={
                          index < breadcrumbItems.length - 1
                            ? "hidden md:block"
                            : ""
                        }
                      >
                        {item.active ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href || "#"}>
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
               </div>
            <div className="flex items-center gap-2 px-4">
              <ModeToggle />
            </div>
          </header> */}
          <div className="flex flex-1 flex-col p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}