"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ANCHORS = [
  { label: "Consultoria", id: "consultoria" },
  { label: "Treinamentos e Palestras", id: "treinamentos-e-palestras" },
  { label: "Pesquisa e Desenvolvimento", id: "pesquisa-e-desenvolvimento" },
  { label: "Agricultura de Precisão", id: "agricultura-de-precisao" },
  { label: "Assessoria em Compras", id: "assessoria-de-compras" },
] as const;

export function ServicosAnchorNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(ANCHORS[0].id);
  const linkRefsMap = useRef<Record<string, HTMLAnchorElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/servicos") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    ANCHORS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  // When active section changes, scroll the active nav link into view with page padding from the left
  const PAGE_PADDING_PX = 16; // pl-4
  useEffect(() => {
    if (!activeId) return;
    const link = linkRefsMap.current[activeId];
    const container = scrollContainerRef.current;
    if (!link || !container) return;
    const targetScrollLeft = link.offsetLeft - PAGE_PADDING_PX;
    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <nav
      className="sticky top-12 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90"
      aria-label="Navegação por serviço"
    >
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden md:overflow-visible"
      >
        <div className="flex flex-nowrap gap-2 py-3 md:py-4 min-w-max md:min-w-0 md:justify-center pl-4 pr-4 md:container md:mx-auto md:max-w-6xl md:flex-wrap">
          {ANCHORS.map(({ label, id }) => (
            <Link
              key={id}
              ref={(el) => {
                linkRefsMap.current[id] = el;
              }}
              href={`#${id}`}
              className={cn(
                "inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                activeId === id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
