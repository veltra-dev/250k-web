"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFAB } from "@/components/layout/whatsapp-fab";

const STUDIO_PATH = "/studio";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith(STUDIO_PATH);

  if (isStudio) {
    return (
      <div className="flex flex-1 flex-col min-h-0 h-screen">
        {children}
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
