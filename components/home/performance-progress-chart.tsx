"use client";

import type { MotionValue } from "motion/react";
import { useId, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

import { useMonotonicScrollProgress } from "@/hooks/use-monotonic-scroll-progress";

const LEVELS = [30, 50, 80, 100] as const;

function useBarMotion(
  scrollYProgress: MotionValue<number>,
  baseY: number,
  targetH: number,
  t0: number,
  t1: number,
) {
  const fill = useTransform(scrollYProgress, [t0, t1], [0, 1]);
  const height = useTransform(fill, (v) => v * targetH);
  const y = useTransform(height, (h) => baseY - h);
  const labelOp = useTransform(
    scrollYProgress,
    [t1 - 0.05, t1 + 0.03],
    [0.2, 1],
  );
  return { fill, height, y, labelOp };
}

export function PerformanceProgressChart() {
  const uid = useId().replace(/:/g, "");
  const barGradId = `perf-bar-${uid}`;
  const arrowGradId = `perf-arrow-${uid}`;
  const clipId = `arrow-clip-${uid}`;

  const viewW = 200;
  const viewH = 88;
  const baseY = 74;
  const maxBar = 46;
  const barW = 26;
  const gap = 14;
  const startX = 20;

  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  // Caminho da curva e da ponta
  const curvePath = "M 8 66 Q 58 12 174 11";
  const headPath = "M 184 11 L 171 5 L 174.5 11 L 171 17 Z";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.94", "end 0.62"],
  });
  const progress = useMonotonicScrollProgress(scrollYProgress);

  const targets = LEVELS.map((pct) => (pct / 100) * maxBar);
  const b0 = useBarMotion(progress, baseY, targets[0]!, 0.06, 0.2);
  const b1 = useBarMotion(progress, baseY, targets[1]!, 0.18, 0.34);
  const b2 = useBarMotion(progress, baseY, targets[2]!, 0.3, 0.46);
  const b3 = useBarMotion(progress, baseY, targets[3]!, 0.42, 0.58);
  const barMotions = [b0, b1, b2, b3];

  // A animação agora é na LARGURA da máscara de corte (de 0 até a largura total da view)
  const clipWidth = useTransform(progress, [0.52, 0.96], [0, viewW]);
  const arrowOpacity = useTransform(progress, [0.48, 0.56], [0, 1]);

  return (
    <figure ref={containerRef} className="mt-4 w-full max-w-md">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full"
        role="img"
        aria-label="Gráfico de progressão de performance: 30%, 50%, 80% e 100%."
      >
        <defs>
          <linearGradient
            id={barGradId}
            x1="0"
            y1="0"
            x2={viewW}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--color-brand-green)" />
            <stop offset="45%" stopColor="var(--color-brand-green)" />
            <stop offset="100%" stopColor="var(--color-brand-orange)" />
          </linearGradient>
          <linearGradient
            id={arrowGradId}
            x1="0"
            y1="0"
            x2={viewW}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--color-brand-green)" />
            <stop offset="45%" stopColor="var(--color-brand-green)" />
            <stop offset="100%" stopColor="var(--color-brand-orange)" />
          </linearGradient>

          {/* Máscara que vai crescer da esquerda pra direita revelando a seta */}
          <clipPath id={clipId}>
            <motion.rect
              x="0"
              y="0"
              height={viewH}
              style={{ width: clipWidth }}
            />
          </clipPath>
        </defs>

        {/* BARRAS */}
        {LEVELS.map((pct, i) => {
          const x = startX + i * (barW + gap);
          const targetH = targets[i]!;
          const { height, y, labelOp } = barMotions[i]!;

          if (reduceMotion) {
            return (
              <g key={pct}>
                <rect
                  x={x}
                  y={baseY - targetH}
                  width={barW}
                  height={targetH}
                  rx={3}
                  fill={`url(#${barGradId})`}
                />
                <text
                  x={x + barW / 2}
                  y={viewH - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: "9px", fontWeight: 600 }}
                >
                  {pct}%
                </text>
              </g>
            );
          }

          return (
            <g key={pct}>
              <motion.rect
                x={x}
                width={barW}
                rx={3}
                fill={`url(#${barGradId})`}
                style={{ height, y }}
              />
              <motion.text
                x={x + barW / 2}
                y={viewH - 4}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: "9px", fontWeight: 600, opacity: labelOp }}
              >
                {pct}%
              </motion.text>
            </g>
          );
        })}

        {/* SETA (Curva + Ponta Agrupadas e Mascaradas) */}
        {reduceMotion ? (
          <g>
            <path
              d={curvePath}
              fill="none"
              stroke={`url(#${arrowGradId})`}
              strokeWidth={2.8}
              strokeLinecap="butt"
            />
            <path d={headPath} fill={`url(#${arrowGradId})`} />
          </g>
        ) : (
          <motion.g
            clipPath={`url(#${clipId})`}
            style={{ opacity: arrowOpacity }}
          >
            <path
              d={curvePath}
              fill="none"
              stroke={`url(#${arrowGradId})`}
              strokeWidth={2.8}
              strokeLinecap="butt"
            />
            <path d={headPath} fill={`url(#${arrowGradId})`} />
          </motion.g>
        )}
      </svg>
    </figure>
  );
}
