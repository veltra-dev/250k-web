"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNav } from "./admin-nav";
import LogoIcon from "@/assets/logo-icon";
import LogoLabel from "@/assets/logo-label";

export function AdminHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin/builder")) return null;

  return (
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
  );
}
