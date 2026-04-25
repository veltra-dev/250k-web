"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoIcon from "@/assets/logo-icon";
import LogoLabel from "@/assets/logo-label";
import { adminPathOmitsTopHeader } from "@/components/admin/admin-dashboard-shell";
import { AdminNav } from "./admin-nav";

export function AdminHeader() {
  const pathname = usePathname();
  if (adminPathOmitsTopHeader(pathname)) return null;

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-primary hover:opacity-90"
          aria-label="250k - Administração"
        >
          <LogoIcon className="h-6 w-auto" />
          <LogoLabel className="h-4 w-auto" />
        </Link>
        <AdminNav />
      </div>
    </header>
  );
}
