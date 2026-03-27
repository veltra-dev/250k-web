"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import { useId, useRef } from "react";
import {
  IconAdjustmentsHorizontal,
  IconChartHistogram,
  IconLeaf,
  IconSeeding,
  IconShoppingCart,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

type Step = {
  title: string;
  description: string;
  Icon: IconComp;
};

const STEPS: Step[] = [
  {
    title: "Diagnóstico do Solo",
    description:
      "Base científica: entender limitações e potenciais antes de qualquer decisão de campo.",
    Icon: IconLeaf,
  },
  {
    title: "Inteligência de Dados",
    description:
      "Transformar informações dispersas em indicadores claros para acompanhar a safra.",
    Icon: IconChartHistogram,
  },
  {
    title: "Estratégia Agronômica",
    description:
      "Plano coerente entre cultura, janela e meta de produtividade para toda a área.",
    Icon: IconSeeding,
  },
  {
    title: "Eficiência no Manejo",
    description:
      "Operação alinhada: timing, doses e práticas que reduzem perdas e variabilidade.",
    Icon: IconAdjustmentsHorizontal,
  },
  {
    title: "Inteligência de Compras",
    description:
      "Compras e insumos conectadas à estratégia, com foco em custo e resultado.",
    Icon: IconShoppingCart,
  },
  {
    title: "Alta Produtividade",
    description:
      "Resultado sistêmico: tetos de produtividade sustentados por processo e dados.",
    Icon: IconTrendingUp,
  },
];

/** Node centers — curva moderada para leitura; trilha ocupa coluna central larga. */
const NODE_POSITIONS: ReadonlyArray<{ cx: number; cy: number }> = [
  { cx: 50, cy: 52 },
  { cx: 62, cy: 148 },
  { cx: 38, cy: 258 },
  { cx: 62, cy: 368 },
  { cx: 38, cy: 478 },
  { cx: 50, cy: 588 },
];

const SPINE_D =
  "M 50 32 L 50 52 C 50 95 68 118 62 148 C 44 200 32 232 38 258 C 56 305 64 338 62 368 C 44 418 32 452 38 478 C 44 530 48 560 50 588 L 50 620";

/** Coluna central 5rem — alinhada ao trilho absoluto (mesma largura). */
const timelineGridCols =
  "grid-cols-1 gap-y-2 gap-x-2 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)]";

function JourneyNode({
  index,
  p,
  greenPhase,
  scrollYProgress,
  reduceMotion,
}: {
  index: number;
  p: { cx: number; cy: number };
  greenPhase: boolean;
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const t0 = 0.05 + index * 0.118;
  const t1 = t0 + 0.08;
  const opacity = useTransform(scrollYProgress, [t0, t1], [0, 1]);

  if (reduceMotion) {
    return (
      <g>
        <circle
          cx={p.cx}
          cy={p.cy}
          r="8"
          className={
            greenPhase
              ? "fill-background stroke-brand-green dark:stroke-[hsl(150_25%_55%)]"
              : "fill-background stroke-brand-orange dark:stroke-[hsl(11_50%_58%)]"
          }
          strokeWidth="2.5"
        />
        <circle
          cx={p.cx}
          cy={p.cy}
          r="3"
          className={
            greenPhase
              ? "fill-brand-green dark:fill-[hsl(150_25%_52%)]"
              : "fill-brand-orange dark:fill-[hsl(11_55%_55%)]"
          }
        />
      </g>
    );
  }

  return (
    <motion.g style={{ opacity }}>
      <circle
        cx={p.cx}
        cy={p.cy}
        r="8"
        className={
          greenPhase
            ? "fill-background stroke-brand-green dark:stroke-[hsl(150_25%_55%)]"
            : "fill-background stroke-brand-orange dark:stroke-[hsl(11_50%_58%)]"
        }
        strokeWidth="2.5"
      />
      <circle
        cx={p.cx}
        cy={p.cy}
        r="3"
        className={
          greenPhase
            ? "fill-brand-green dark:fill-[hsl(150_25%_52%)]"
            : "fill-brand-orange dark:fill-[hsl(11_55%_55%)]"
        }
      />
    </motion.g>
  );
}

function JourneySpine({
  scrollYProgress,
  reduceMotion,
}: {
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `journey-spine-gradient-${uid}`;

  const pathLength = useTransform(scrollYProgress, [0, 0.78], [0, 1]);

  return (
    <svg
      className="h-full min-h-full w-full"
      viewBox="0 0 100 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-brand-green)" />
          <stop offset="45%" stopColor="var(--color-brand-green)" />
          <stop offset="100%" stopColor="var(--color-brand-orange)" />
        </linearGradient>
      </defs>
      {reduceMotion ? (
        <path
          d={SPINE_D}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          d={SPINE_D}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />
      )}
      {NODE_POSITIONS.map((p, i) => {
        const greenPhase = i < 3;
        return (
          <JourneyNode
            key={i}
            index={i}
            p={p}
            greenPhase={greenPhase}
            scrollYProgress={scrollYProgress}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </svg>
  );
}

function TimelineStepItem({
  step,
  index,
  scrollYProgress,
  reduceMotion,
}: {
  step: Step;
  index: number;
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const isLeft = index % 2 === 0;
  const { Icon } = step;
  const stepLabel = `Etapa ${index + 1}`;
  const greenPhase = index < 3;

  const tStart = 0.07 + index * 0.115;
  const tEnd = tStart + 0.11;
  const opacity = useTransform(scrollYProgress, [tStart, tEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [tStart, tStart + 0.07], [18, 0]);
  const barScale = useTransform(scrollYProgress, [tStart + 0.04, tEnd], [0.08, 1]);

  const contentInner = (
    <div
      className={cn(
        "relative flex max-w-44 flex-col gap-1 rounded-md sm:max-w-46 md:max-w-42",
        isLeft ? "md:items-end md:text-right" : "md:items-start md:text-left",
      )}
    >
      <h3
        className={cn(
          "text-sm font-bold leading-tight tracking-tight md:text-[0.9375rem]",
          greenPhase
            ? "text-brand-green dark:text-[hsl(150_25%_62%)]"
            : "text-brand-orange dark:text-[hsl(11_55%_62%)]",
        )}
      >
        {step.title}
      </h3>
      <p className="text-[0.7rem] font-semibold leading-snug text-muted-foreground md:text-xs">
        {step.description}
      </p>
      <div
        className={cn(
          "mt-0.5 flex items-center gap-1.5",
          isLeft ? "md:flex-row-reverse" : "md:flex-row",
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md border shadow-sm md:size-8",
            greenPhase
              ? "border-brand-green/30 bg-brand-green/12 text-brand-green dark:text-[hsl(150_25%_62%)]"
              : "border-brand-orange/30 bg-brand-orange/12 text-brand-orange dark:text-[hsl(11_55%_62%)]",
          )}
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.35} />
        </span>
        {reduceMotion ? (
          <span
            className={cn(
              "hidden h-0.5 shrink-0 rounded-full md:block md:w-10 lg:w-14",
              greenPhase ? "bg-brand-green/50" : "bg-brand-orange/50",
            )}
            aria-hidden
          />
        ) : (
          <motion.span
            className={cn(
              "hidden h-0.5 shrink-0 rounded-full origin-center md:block md:w-10 lg:w-14",
              greenPhase ? "bg-brand-green/50" : "bg-brand-orange/50",
            )}
            style={{
              scaleX: barScale,
              transformOrigin: isLeft ? "100% 50%" : "0% 50%",
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );

  const badgeInner = (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[0.6rem] font-semibold text-white shadow-sm md:px-2.5 md:py-1 md:text-[0.65rem]",
        greenPhase ? "bg-brand-green" : "bg-brand-orange",
      )}
    >
      {stepLabel}
    </span>
  );

  const wrapMotion = (node: ReactNode) =>
    reduceMotion ? (
      node
    ) : (
      <motion.div style={{ opacity, y }}>{node}</motion.div>
    );

  return (
    <li className={cn("grid items-center", timelineGridCols)}>
      {isLeft ? (
        <>
          <div className="flex justify-start md:justify-end">
            {wrapMotion(contentInner)}
          </div>
          <div className="hidden min-h-px w-full md:block" aria-hidden />
          <div className="flex items-center justify-start md:items-center">
            {wrapMotion(badgeInner)}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-start md:justify-end md:items-center">
            {wrapMotion(badgeInner)}
          </div>
          <div className="hidden min-h-px w-full md:block" aria-hidden />
          <div className="flex justify-start md:justify-start">
            {wrapMotion(contentInner)}
          </div>
        </>
      )}
    </li>
  );
}

export function CasesJourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.86", "end 0.32"],
  });

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col py-0 md:max-w-104"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden md:flex md:justify-center"
        aria-hidden
      >
        <div className="relative h-full w-20 shrink-0">
          <JourneySpine
            scrollYProgress={scrollYProgress}
            reduceMotion={!!reduceMotion}
          />
        </div>
      </div>

      <ol
        className="relative z-10 flex w-full flex-1 flex-col justify-between gap-2 md:gap-2 lg:gap-2.5"
        aria-label="Jornada em etapas"
      >
        {STEPS.map((step, index) => (
          <TimelineStepItem
            key={step.title}
            step={step}
            index={index}
            scrollYProgress={scrollYProgress}
            reduceMotion={!!reduceMotion}
          />
        ))}
      </ol>
    </div>
  );
}
