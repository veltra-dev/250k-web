import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  IconTarget,
  IconChartBar,
  IconPlant2,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | 250k Consultoria Agrícola",
  description:
    "Conheça nossos serviços de consultoria agrícola: planejamento, gestão e apoio técnico.",
};

const services: {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    title: "Planejamento estratégico",
    description:
      "Definição de metas, cenários e planos de ação alinhados à sua realidade e ao mercado.",
    icon: IconTarget,
  },
  {
    title: "Gestão e acompanhamento",
    description:
      "Indicadores, análises e suporte para acompanhar resultados e corrigir rumos quando necessário.",
    icon: IconChartBar,
  },
  {
    title: "Apoio técnico",
    description:
      "Conhecimento técnico aplicado a culturas, solo, clima e práticas para melhorar produtividade.",
    icon: IconPlant2,
  },
  {
    title: "Análise de mercado",
    description:
      "Visão sobre commodities, custos e oportunidades para decisões mais informadas.",
    icon: IconTrendingUp,
  },
];

export default function ServicosPage() {
  return (
    <>
      <Section
        title="Nossos serviços"
        subtitle="Soluções de consultoria agrícola para o seu negócio"
        variant="wide"
      >
        <div className="grid gap-8 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.title}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="bg-primary/5 p-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <h3 className="text-xl font-semibold text-primary">
                    {s.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/contato">Saiba mais</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
