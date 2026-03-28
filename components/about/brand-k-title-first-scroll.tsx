"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { splitBrandKTitle } from "@/lib/solucoes-brand-title";
import {
  getSolucoesFirstScrollSnapshot,
  subscribeSolucoesFirstScroll,
} from "@/lib/solucoes-first-scroll-store";
import { cn } from "@/lib/utils";

export function BrandKTitleFirstScroll({ title }: { title: string }) {
  const hasScrolled = useSyncExternalStore(
    subscribeSolucoesFirstScroll,
    getSolucoesFirstScrollSnapshot,
    () => false,
  );
  const reduceMotion = useReducedMotion();

  const { before, accent, after } = splitBrandKTitle(title);
  if (!accent) return <>{title}</>;

  const showOrange = Boolean(reduceMotion || hasScrolled);

  return (
    <>
      {before}
      <motion.span
        className={cn(
          "inline-block",
          !reduceMotion && "will-change-[color]",
        )}
        initial={false}
        animate={{
          color: showOrange
            ? "var(--brand-k-mark-active)"
            : "var(--brand-k-mark-idle)",
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          ease: "easeOut",
        }}
      >
        {accent}
      </motion.span>
      {after}
    </>
  );
}
