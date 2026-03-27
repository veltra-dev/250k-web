"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ANCHORS = [
  { beforeK: "PD", after: "", id: "pd-k" },
  { beforeK: "FIELD", after: "", id: "field-k" },
  { beforeK: "FINANCE", after: "", id: "finance-k" },
  { beforeK: "SOLO CHEC", after: "", id: "solo-chec-k" },
  { beforeK: "CERTIFICA", after: "", id: "certifica-k" },
  { beforeK: "250", after: "ACADEMY", id: "academy" },
] as const;

export function SolucoesAnchorNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(ANCHORS[0].id);
  const linkRefsMap = useRef<Record<string, HTMLAnchorElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/solucoes") return;

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

  useEffect(() => {
    if (!activeId) return;

    const link = linkRefsMap.current[activeId];
    const container = scrollContainerRef.current;
    if (!link || !container) return;

    const PAGE_PADDING_PX = 16; // pl-4
    const targetScrollLeft = link.offsetLeft - PAGE_PADDING_PX;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <nav
      className="sticky top-12 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90"
      aria-label="Navegação por núcleo"
    >
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden md:overflow-visible"
      >
        <div className="flex flex-nowrap gap-2 py-3 md:py-4 min-w-max md:min-w-0 md:justify-center pl-4 pr-4 md:container md:mx-auto md:max-w-6xl md:flex-wrap">
          {ANCHORS.map(({ beforeK, after, id }) => {
            const isActive = activeId === id;
            return (
              <Link
                key={id}
                ref={(el) => {
                  linkRefsMap.current[id] = el;
                }}
                href={`#${id}`}
                className={cn(
                  "group inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium tracking-tight transition-colors duration-200",
                  isActive
                    ? "bg-brand-green/12 text-primary shadow-sm ring-1 ring-brand-green/25 dark:bg-brand-green/18 dark:text-[hsl(150_25%_90%)] dark:ring-brand-green/35"
                    : "text-muted-foreground hover:bg-brand-green/10 hover:text-primary dark:hover:bg-brand-green/12",
                )}
              >
                <span>{beforeK}</span>
                <span className="font-semibold text-brand-orange dark:text-[hsl(11_55%_62%)]">
                  K
                </span>
                {after ? (
                  <span className="ml-1.5">{after}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
