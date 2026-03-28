"use client";

import { useEffect, useRef } from "react";

const BRAND_COLORS = ["#22352D", "#B14F32", "#ffffff", "#F59E0B", "#10B981"];

export function ConfettiOverlay({
  active,
  durationMs,
}: {
  active: boolean;
  durationMs: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let resetInstance: (() => void) | null = null;

    void (async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled || canvasRef.current !== canvas) return;

      const fire = confetti.create(canvas, {
        resize: true,
        disableForReducedMotion: true,
      });

      resetInstance = () => {
        fire.reset();
      };

      const ticks = Math.min(300, Math.max(100, Math.round(durationMs / 9)));

      const burst = {
        particleCount: 95,
        spread: 72,
        startVelocity: 48,
        colors: [...BRAND_COLORS],
        ticks,
      };

      void fire({
        ...burst,
        angle: 60,
        origin: { x: 0.2, y: 0.12 },
      });

      void fire({
        ...burst,
        angle: 120,
        origin: { x: 0.8, y: 0.12 },
      });
    })();

    return () => {
      cancelled = true;
      resetInstance?.();
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <div className="questionario-resultado-confetti pointer-events-none fixed inset-0 z-100">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
