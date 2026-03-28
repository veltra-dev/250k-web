"use client";

import { Archivo } from "next/font/google";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const COUNT_START = 200;
const COUNT_END = 250;

function YieldChip({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          archivo.className,
          "tabular-nums text-primary tracking-tight text-2xl sm:text-5xl",
        )}
      >
        {value}
      </span>
      <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
        {unit}
      </span>
    </div>
  );
}

function Operator({ children }: { children: string }) {
  return (
    <span
      className={cn(
        archivo.className,
        "shrink-0 select-none leading-none text-brand-orange text-2xl sm:text-3xl",
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

/** Equação da marca: métricas Archivo 800, operadores em texto, 250K com contagem ao entrar na viewport (uma vez). */
export function PropositoEquation({ className }: { className?: string }) {
  const resultRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(resultRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const countMv = useMotionValue(COUNT_START);
  const [displayValue, setDisplayValue] = useState(COUNT_START);
  const hasAnimated = useRef(false);

  useMotionValueEvent(countMv, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (reduceMotion) {
      countMv.set(COUNT_END);
      return;
    }

    const controls = animate(countMv, COUNT_END, {
      duration: 1.2,
      ease: "easeOut",
    });

    void controls.then(() => {
      countMv.set(COUNT_END);
    });

    return () => controls.stop();
  }, [isInView, reduceMotion, countMv]);

  return (
    <figure className={cn("px-5 sm:px-0", className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-6">
        <YieldChip value="85" unit="sc/ha" />
        <Operator>+</Operator>
        <YieldChip value="165" unit="sc/ha" />
        <Operator>=</Operator>
        <span
          ref={resultRef}
          className={cn(
            archivo.className,
            "inline-flex shrink-0 items-baseline gap-0 tabular-nums tracking-tight",
            "text-4xl sm:text-7xl",
          )}
          aria-label={`Resultado: ${displayValue} mil sacas`}
        >
          <span className="text-primary">{displayValue}</span>
          <span className="text-brand-orange">K</span>
        </span>
      </div>

      <figcaption className="sr-only">
        85 sacas por hectare mais 165 sacas por hectare: resultado expresso na
        marca 250K
      </figcaption>
    </figure>
  );
}
