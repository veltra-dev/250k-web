"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  IconComponents,
  IconFileText,
  IconHome,
  IconInbox,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconUsers,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoIcon from "@/assets/logo-icon";
import LogoLabel from "@/assets/logo-label";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Visão geral",
    icon: IconLayoutDashboard,
  },
  {
    href: "/admin/landing-pages",
    label: "Landing pages",
    icon: IconFileText,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: IconInbox,
  },
  {
    href: "/admin/users",
    label: "Usuários",
    icon: IconUsers,
  },
  {
    href: "/admin/studio",
    label: "Studio",
    icon: IconComponents,
  },
] as const;

const SIDEBAR_COLLAPSED_KEY = "250k-admin-sidebar-collapsed";

/** Rotas em que o header superior não aparece (marca e saída ficam na sidebar ou na tela cheia). */
export function adminPathOmitsTopHeader(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin/builder") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/dashboard") ||
    pathname === "/admin/landing-pages" ||
    pathname.startsWith("/admin/leads") ||
    pathname.startsWith("/admin/users") ||
    pathname.startsWith("/admin/studio")
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) return true;
  if (href === "/admin/landing-pages" && pathname.startsWith("/admin/builder")) {
    return true;
  }
  return false;
}

function userDisplayName(user: User): string {
  const meta = user.user_metadata as { full_name?: string; name?: string } | null;
  const fromMeta = meta?.full_name ?? meta?.name;
  if (fromMeta?.trim()) return fromMeta.trim();
  const local = user.email?.split("@")[0];
  return local?.trim() || "Usuário";
}

function userInitials(user: User): string {
  const name = userDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0]!.length >= 2) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (user.email?.slice(0, 2) ?? "??").toUpperCase();
}

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const collapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
      startTransition(() => setSidebarCollapsed(collapsed));
    } catch {
      /* ignore */
    }
  }, []);

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const hideChrome = pathname?.startsWith("/admin/login");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (hideChrome) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">{children}</div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-zinc-200/90 bg-[#F8F9FA] transition-[width] duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950",
          sidebarCollapsed ? "w-[76px]" : "w-[260px]",
        )}
        aria-label="Navegação do painel"
        data-collapsed={sidebarCollapsed ? "" : undefined}
      >
        <div
          className={cn(
            "shrink-0 pt-5",
            sidebarCollapsed
              ? "flex flex-col items-center gap-2 px-2 pb-3"
              : "flex flex-col gap-2 px-4 pb-3",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center gap-2",
              sidebarCollapsed && "flex-col",
            )}
          >
            <Link
              href="/"
              className={cn(
                "flex min-w-0 items-center text-primary transition-opacity hover:opacity-90",
                sidebarCollapsed
                  ? "justify-center"
                  : "flex-1 gap-2.5",
              )}
              aria-label="Ir para a página inicial do site"
            >
              <LogoIcon className="h-8 w-auto shrink-0" />
              {!sidebarCollapsed && (
                <LogoLabel className="h-5 w-auto min-w-0 shrink" />
              )}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={toggleSidebarCollapsed}
              aria-expanded={!sidebarCollapsed}
              aria-controls="admin-sidebar-sections"
              title={sidebarCollapsed ? "Expandir menu" : "Minimizar menu"}
            >
              {sidebarCollapsed ? (
                <IconLayoutSidebarLeftExpand className="size-5" />
              ) : (
                <IconLayoutSidebarLeftCollapse className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 border-b border-zinc-200/90 dark:border-zinc-800",
            sidebarCollapsed ? "mx-3" : "mx-5",
          )}
        />

        <nav
          id="admin-sidebar-sections"
          className={cn(
            "flex flex-1 flex-col gap-1.5 overflow-auto py-5",
            sidebarCollapsed ? "items-center px-2" : "px-3",
          )}
          aria-label="Seções"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  "flex items-center rounded-full text-sm font-medium transition-colors",
                  sidebarCollapsed
                    ? "justify-center p-2.5"
                    : "gap-3 px-3.5 py-2.5",
                  active
                    ? "bg-[#1A1C23] text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "size-[22px] shrink-0",
                    active
                      ? "text-current"
                      : "text-zinc-500 dark:text-zinc-500",
                  )}
                  aria-hidden
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{label}</span>
                )}
                {sidebarCollapsed && (
                  <span className="sr-only">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "shrink-0 border-t border-zinc-200/90 dark:border-zinc-800",
            sidebarCollapsed ? "flex flex-col items-center gap-2 p-2" : "px-4 pb-4 pt-3",
          )}
        >
          {!sidebarCollapsed ? (
            <Button variant="outline" size="sm" className="mb-3 w-full" asChild>
              <Link href="/">
                <IconHome className="size-4 shrink-0" />
                Ver site
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon-sm"
              className="mb-1 shrink-0"
              asChild
              title="Ver site"
            >
              <Link href="/" aria-label="Ver site">
                <IconHome className="size-5" />
              </Link>
            </Button>
          )}

          {user ? (
            sidebarCollapsed ? (
              <>
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                  title={userDisplayName(user)}
                  aria-hidden
                >
                  {userInitials(user)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={handleSignOut}
                  aria-label="Sair"
                >
                  <IconLogout className="size-5" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                  aria-hidden
                >
                  {userInitials(user)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {userDisplayName(user)}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={handleSignOut}
                  aria-label="Sair"
                >
                  <IconLogout className="size-5" />
                </Button>
              </div>
            )
          ) : null}
        </div>
      </aside>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain bg-background">
        {children}
      </main>
    </div>
  );
}
