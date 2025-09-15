import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { CorporateProfessionalSidebar } from "./side-bar-components/corporate-professional-sidebar";
import { UserRole } from "@/utils/types";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({
  children,
}: SidebarWrapperProps) {
  const { user } = useAuth();

  const renderSidebar = () => {
    if (user?.role === UserRole.CORPORATE_PROFESSIONAL) {
      return <CorporateProfessionalSidebar />;
    } else {
      return null;
    }
  };

  return (
    <>
      <SidebarProvider>
        {renderSidebar()}
        <SidebarInset>
          <div className="flex flex-1 flex-col p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}