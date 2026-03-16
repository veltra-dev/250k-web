import { AdminHeader } from "./admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
