import Link from "next/link";
import type { ComponentType } from "react";
import {
  FlaskConical,
  GraduationCap,
  Handshake,
  ShoppingCart,
  Sprout,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const SERVICES: { name: string; id: string }[] = [
  { name: "Consultoria", id: "consultoria" },
  { name: "Treinamentos e palestras", id: "treinamentos-e-palestras" },
  { name: "Pesquisa e desenvolvimento", id: "pesquisa-e-desenvolvimento" },
  { name: "Agricultura de precisão", id: "agricultura-de-precisao" },
  { name: "Assessoria de compras", id: "assessoria-de-compras" },
];

const SERVICE_ICONS: Record<
  string,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
    consultoria: Handshake,
    "treinamentos-e-palestras": GraduationCap,
    "pesquisa-e-desenvolvimento": FlaskConical,
    "agricultura-de-precisao": Target,
    "assessoria-de-compras": ShoppingCart,
  };

export function HomeServicesStrip() {
  return (
    <Section
      title="Nossos serviços"
      subtitle="Soluções para produtividade e sustentabilidade no campo"
      className="bg-muted/30"
      variant="wide"
    >
      <div className="rounded-2xl border border-border/60 bg-background/60 p-4 sm:p-6">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0 md:justify-center">
            {SERVICES.map(({ name, id }) => {
              const Icon = SERVICE_ICONS[id] ?? Sprout;
              return (
                <Link
                  key={id}
                  href={`/servicos#${id}`}
                  className="group flex w-[260px] shrink-0 items-start gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-4 transition-colors hover:border-accent/40 hover:bg-accent/5 md:w-full md:min-w-0 md:flex-col md:items-center md:text-center md:py-5 md:px-6 md:justify-self-center"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                      {name}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Ver detalhes
                    </span>
                  </span>
                </Link>
              );
            })}
        </div>
        <div className="flex justify-center">
          <Button
            asChild
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/servicos">Saiba mais</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}