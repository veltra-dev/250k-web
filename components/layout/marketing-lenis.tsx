"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useLenisInstanceSetter } from "@/components/layout/lenis-instance-context";

function isMarketingLenisRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  if (pathname === "/solucoes" || pathname === "/sobre" || pathname === "/blog") {
    return true;
  }
  if (pathname.startsWith("/blog/")) return true;
  return false;
}

export function MarketingLenis() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const setLenisInstance = useLenisInstanceSetter();

  const marketing = isMarketingLenisRoute(pathname);
  const enabled = marketing && !reduceMotion;
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (!enabled) {
      setLenisInstance?.(null);
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    setLenisInstance?.(lenis);

    return () => {
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
      setLenisInstance?.(null);
    };
  }, [enabled, setLenisInstance]);

  useEffect(() => {
    if (!enabled) return;
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, searchKey, enabled]);

  return null;
}
