import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminSidebar } from "@/components/sidebars/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(core)/_admin/_layout-default")({
  component: MainLayout,
});
export default function MainLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
