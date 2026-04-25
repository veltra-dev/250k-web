import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AdminHeader } from "./admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AdminHeader />
      <div className="flex min-h-0 flex-1">
        <AdminDashboardShell>{children}</AdminDashboardShell>
      </div>
    </div>
  );
}
