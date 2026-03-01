import { cn } from "@/lib/utils";

const maxWidthClass = {
  default: "max-w-4xl",
  wide: "max-w-6xl",
  narrow: "max-w-2xl",
} as const;

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof maxWidthClass;
}

export function Section({
  title,
  subtitle,
  children,
  className,
  variant = "default",
}: SectionProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className={cn("container mx-auto px-4", maxWidthClass[variant])}>
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
