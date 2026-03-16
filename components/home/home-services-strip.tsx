import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const SERVICES: { name: string; id: string }[] = [
  { name: "Consultoria", id: "consultoria" },
  { name: "Treinamentos e palestras", id: "treinamentos-e-palestras" },
  { name: "Pesquisa e desenvolvimento", id: "pesquisa-e-desenvolvimento" },
  { name: "Agricultura de precisão", id: "agricultura-de-precisao" },
  { name: "Assessoria de compras", id: "assessoria-de-compras" },
];

export function HomeServicesStrip() {
  return (
    <Section
      title="Nossos serviços"
      subtitle="Soluções para produtividade e sustentabilidade no campo"
      className="bg-muted/30"
      variant="wide"
    >
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {SERVICES.map(({ name, id }) => (
          <Link
            key={id}
            href={`/servicos#${id}`}
            className="inline-flex items-center rounded-full border-2 border-primary/20 bg-background px-4 py-2.5 text-sm font-medium text-primary hover:border-accent hover:bg-accent/5 hover:text-accent-foreground transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/servicos">Saiba mais</Link>
        </Button>
      </div>
    </Section>
  );
}