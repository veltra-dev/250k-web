"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import type Lenis from "lenis";
import { useLenisInstance } from "@/components/layout/lenis-instance-context";
import { markSolucoesFirstScroll } from "@/lib/solucoes-first-scroll-store";

const SCROLL_PX = 2;

/**
 * Mounts scroll listeners and calls `markSolucoesFirstScroll()` once.
 * Does not rely on React context (RSC + Server AboutBlock breaks context to nested clients).
 */
export function SolucoesFirstScrollProvider({ children }: { children: ReactNode }) {
  const doneRef = useRef(false);
  const { scrollY } = useScroll();
  const lenis = useLenisInstance();

  const mark = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    markSolucoesFirstScroll();
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.scrollY > SCROLL_PX || scrollY.get() > SCROLL_PX) {
      mark();
    }
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > SCROLL_PX) mark();
  });

  useEffect(() => {
    if (!lenis) return;

    const onLenisScroll = (l: Lenis) => {
      if (l.scroll > SCROLL_PX) mark();
    };

    const onVirtualScroll = (e: { deltaY: number }) => {
      if (Math.abs(e.deltaY) > 0.5) mark();
    };

    const offScroll = lenis.on("scroll", onLenisScroll);
    const offVirtual = lenis.on("virtual-scroll", onVirtualScroll);

    if (lenis.scroll > SCROLL_PX) mark();

    return () => {
      offScroll();
      offVirtual();
    };
  }, [lenis]);

  useEffect(() => {
    if (lenis) return;
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (window.scrollY > SCROLL_PX) mark();
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    const vv = window.visualViewport;
    vv?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("scroll", onScroll, { capture: true });
      vv?.removeEventListener("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    if (lenis) return;
    const onWheel = () => mark();
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [lenis]);

  return <>{children}</>;
}
