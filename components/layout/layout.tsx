"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFAB } from "@/components/layout/whatsapp-fab";
import { FloatingWeatherWidget } from "@/components/layout/floating-weather-widget";

const STUDIO_PATH = "/studio";
const ADMIN_PATH = "/admin";
const TOP_LEVEL_ROUTES = [
  "",
  "contato",
  "blog",
  "servicos",
  "solucoes",
  "sobre",
  "questionario",
  "admin",
  "studio",
];

function isLandingPagePath(pathname: string | null): boolean {
  if (!pathname || pathname === "/") return false;
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 && !TOP_LEVEL_ROUTES.includes(segments[0]);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith(STUDIO_PATH);
  const isAdmin = pathname?.startsWith(ADMIN_PATH);
  const isLandingPage = isLandingPagePath(pathname ?? null);
  const isQuestionario = pathname?.startsWith("/questionario") ?? false;

  if (isStudio || isAdmin || isLandingPage) {
    return <div className="flex flex-1 flex-col min-h-0">{children}</div>;
  }

  if (isQuestionario) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWeatherWidget />
        <WhatsAppFAB />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWeatherWidget />
      <WhatsAppFAB />
    </>
  );
}
