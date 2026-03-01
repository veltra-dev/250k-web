import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/home/hero";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { ClientsSection } from "@/components/home/clients-section";
import { WeatherWidget } from "@/components/home/weather-widget";
import { CommoditiesWidget } from "@/components/home/commodities-widget";
import { ResearchPolesMap } from "@/components/home/research-poles-map";
import { getWeather } from "@/lib/weather";
import { getCommodities } from "@/lib/commodities";

export default async function HomePage() {
  const [weather, commodities] = await Promise.all([
    getWeather(),
    getCommodities(),
  ]);

  return (
    <>
      <Hero />

      <CommoditiesWidget data={commodities} />

      <Section
        title="Por que a 250k?"
        subtitle="Resultados com foco no que importa"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">Estratégia</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Planejamento e metas alinhados à sua realidade e ao mercado.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">Gestão</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Acompanhamento e indicadores para decisões mais assertivas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">Resultados</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Foco em produtividade e sustentabilidade no longo prazo.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Serviços" subtitle="O que oferecemos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">
                Planejamento estratégico
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Metas, cenários e planos de ação para o seu negócio.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">
                Gestão e apoio técnico
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Indicadores, análises e conhecimento aplicado ao campo.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/servicos">Ver todos os serviços</Link>
          </Button>
        </div>
      </Section>

      <Section
        title="Polos de pesquisa"
        subtitle="Nossos centros de pesquisa em Mato Grosso"
        variant="wide"
      >
        <ResearchPolesMap />
      </Section>

      <Section
        title="O que dizem nossos clientes"
        subtitle="Depoimentos de quem confia na 250k"
      >
        <TestimonialsCarousel />
      </Section>

      <ClientsSection />
    </>
  );
}
