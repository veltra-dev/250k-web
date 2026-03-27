import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const maxWidthClass = {
  default: "max-w-4xl",
  wide: "max-w-6xl",
  narrow: "max-w-2xl",
} as const;

interface SectionProps {
  id?: string;
  title?: string;
  afterTitle?: ReactNode;
  subtitle?: string;
  subtitleClassName?: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof maxWidthClass;
}

export function Section({
  id,
  title,
  afterTitle,
  subtitle,
  subtitleClassName,
  children,
  className,
  variant = "default",
}: SectionProps) {
  const showHeader = title || subtitle || afterTitle;

  return (
    <section id={id} className={cn("py-12 md:py-16", className)}>
      <div className={cn("container mx-auto px-4", maxWidthClass[variant])}>
        {showHeader && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {title}
              </h2>
            )}
            {afterTitle && <div className="mt-4">{afterTitle}</div>}
            {subtitle && (
              <p
                className={cn(
                  "text-muted-foreground text-lg",
                  subtitleClassName,
                  afterTitle ? "mt-6" : "mt-2",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
