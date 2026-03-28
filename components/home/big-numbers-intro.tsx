"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const INFLUENCED_END = 1_000_000;
const ATTENDED_END = 109;
const CLIENTS_END = 54;

const DURATION_S = 1.35;

function formatInfluencedHa(n: number): string {
  const rounded = Math.round(n);
  if (rounded >= INFLUENCED_END) return "+1 Mi";
  const thousands = Math.floor(rounded / 1000);
  return `+${thousands} mil`;
}

/** Big numbers block: título + métricas com contagem na primeira vez que entra na viewport. */
export function BigNumbersIntro() {
  const blockRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(blockRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();

  const influencedMv = useMotionValue(0);
  const attendedMv = useMotionValue(0);
  const clientsMv = useMotionValue(0);

  const [influencedLabel, setInfluencedLabel] = useState(() =>
    formatInfluencedHa(0),
  );
  const [attendedLabel, setAttendedLabel] = useState("0 mil");
  const [clientsLabel, setClientsLabel] = useState("0");

  useMotionValueEvent(influencedMv, "change", (latest) => {
    setInfluencedLabel(formatInfluencedHa(latest));
  });
  useMotionValueEvent(attendedMv, "change", (latest) => {
    setAttendedLabel(`${Math.round(latest)} mil`);
  });
  useMotionValueEvent(clientsMv, "change", (latest) => {
    setClientsLabel(String(Math.round(latest)));
  });

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (reduceMotion) {
      influencedMv.set(INFLUENCED_END);
      attendedMv.set(ATTENDED_END);
      clientsMv.set(CLIENTS_END);
      return;
    }

    const a1 = animate(influencedMv, INFLUENCED_END, {
      duration: DURATION_S,
      ease: "easeOut",
    });
    const a2 = animate(attendedMv, ATTENDED_END, {
      duration: DURATION_S,
      ease: "easeOut",
    });
    const a3 = animate(clientsMv, CLIENTS_END, {
      duration: DURATION_S,
      ease: "easeOut",
    });

    void Promise.all([a1, a2, a3]).then(() => {
      influencedMv.set(INFLUENCED_END);
      attendedMv.set(ATTENDED_END);
      clientsMv.set(CLIENTS_END);
    });

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [
    isInView,
    reduceMotion,
    influencedMv,
    attendedMv,
    clientsMv,
  ]);

  return (
    <div
      ref={blockRef}
      className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="shrink-0 lg:max-w-md lg:pr-8">
        <h2 className="text-2xl font-bold text-primary md:text-3xl">
          Big numbers
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Indicadores de influência e atendimento
        </p>
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-wrap content-end items-end justify-between gap-x-4 gap-y-5 sm:gap-x-6 lg:max-w-3xl lg:justify-end lg:gap-x-8 lg:gap-y-0">
        <div className="min-w-22 flex-1 lg:flex-initial lg:text-right">
          <div className="text-xs text-muted-foreground uppercase tracking-wide sm:text-sm">
            Hectares influenciados
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums sm:text-3xl">
            {influencedLabel}
          </div>
        </div>
        <div className="min-w-22 flex-1 lg:flex-initial lg:text-right">
          <div className="text-xs text-muted-foreground uppercase tracking-wide sm:text-sm">
            Hectares atendidos
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums sm:text-3xl">
            {attendedLabel}
          </div>
        </div>
        <div className="min-w-22 flex-1 lg:flex-initial lg:text-right">
          <div className="text-xs text-muted-foreground uppercase tracking-wide sm:text-sm">
            Clientes ativos
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums sm:text-3xl">
            {clientsLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
