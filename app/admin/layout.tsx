import Link from "next/link";
import { AdminNav } from "./admin-nav";
import LogoIcon from "@/assets/logo-icon";
import LogoLabel from "@/assets/logo-label";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-primary hover:opacity-90"
            aria-label="250k - Administração"
          >
            <LogoIcon className="h-6 w-auto" />
            <LogoLabel className="h-4 w-auto" />
          </Link>
          <AdminNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
