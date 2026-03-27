import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 min-w-0 pb-20">
        {children}
      </main>
    </div>
  );
}
