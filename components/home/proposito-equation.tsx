import LogoLabel from "@/assets/logo-label";
import { cn } from "@/lib/utils";

function SvgPlus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SvgEquals({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 9h14M5 15h14" />
    </svg>
  );
}

function YieldChip({
  value,
  unit,
}: {
  value: string;
  unit: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-1.5 rounded-xl border border-border/80 bg-background/90 px-4 py-2.5 shadow-sm",
        "ring-1 ring-black/3 dark:ring-white/6",
      )}
    >
      <span className="font-bold tabular-nums text-primary tracking-tight text-2xl sm:text-3xl">
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
        {unit}
      </span>
    </div>
  );
}

/** Equação da marca: métricas + operadores em SVG + wordmark (mesma arte do header, sem foguete). */
export function PropositoEquation({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/12 bg-linear-to-br from-muted/35 via-background to-muted/20 px-5 py-6 sm:px-6 sm:py-7",
        className,
      )}
    >
      <svg
        className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 text-primary/6 dark:text-primary/9"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="0.35" />
      </svg>

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-4 sm:gap-x-4">
        <YieldChip value="85" unit="sc/ha" />
        <SvgPlus className="h-6 w-6 text-brand-orange sm:h-7 sm:w-7" />
        <YieldChip value="165" unit="sc/ha" />
        <SvgEquals className="h-6 w-6 text-brand-orange/90 sm:h-7 sm:w-7" />
        <LogoLabel
          className="h-8 w-auto shrink-0 sm:h-9 md:h-10"
          fillPrimary="var(--color-brand-green)"
          fillSecondary="var(--color-brand-orange)"
          aria-hidden
        />
      </div>

      <figcaption className="sr-only">
        85 sacas por hectare mais 165 sacas por hectare: resultado expresso na marca 250K
      </figcaption>
    </figure>
  );
}
