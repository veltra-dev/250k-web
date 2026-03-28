"use client";

import { useEffect } from "react";
import type { MotionValue } from "motion/react";
import { useMotionValue } from "motion/react";

/** Scroll progress that only increases so animations do not run backwards when scrolling up. */
export function useMonotonicScrollProgress(scrollYProgress: MotionValue<number>) {
  const locked = useMotionValue(0);

  useEffect(() => {
    const bump = (v: number) => {
      locked.set(Math.max(locked.get(), v));
    };
    bump(scrollYProgress.get());
    return scrollYProgress.on("change", bump);
  }, [scrollYProgress, locked]);

  return locked;
}
