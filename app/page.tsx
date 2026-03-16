import { Section } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { ClientsSection } from "@/components/home/clients-section";
import { CommoditiesWidget } from "@/components/home/commodities-widget";
import { ResearchPolesMap } from "@/components/home/research-poles-map";
import { StatsBar } from "@/components/home/stats-bar";
import { HomeServicesStrip } from "@/components/home/home-services-strip";
import { AboutBlock } from "@/components/about/about-block";
import { getCommodities } from "@/lib/commodities";

const EXPERIENCE_IMAGE =
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80";

export default async function HomePage() {
  const commodities = await getCommodities();

  return (
    <>
      <Hero />

      <CommoditiesWidget data={commodities} />

      <Section id="conteudo" title="Conheça a nossa empresa" variant="wide">
        <div className="max-w-3xl space-y-4 text-muted-foreground leading-relaxed text-lg">
          <p>
            Somos uma empresa de serviços e consultoria agronômica; nosso foco é
            aumentar a produtividade em grandes culturas. Trazemos a meta de
            produtividade média de 250 sacas/hectare ano com culturas de soja e
            milho de forma sustentável — por exemplo: Soja 85 sc + 165 sc de
            milho por hectare.
          </p>
          <p>
            Na safra 23/24 atendemos mais de 20 mil hectares e influenciamos no
            manejo em mais de 200 mil hectares.
          </p>
        </div>
      </Section>

      <StatsBar />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <AboutBlock
            title="Experiência"
            imageSrc={EXPERIENCE_IMAGE}
            imageAlt="Mãos no solo, agricultura de precisão"
            reverse
            content={
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                <li>
                  Ciclo por multinacionais com experiência em agricultura de
                  precisão
                </li>
                <li>
                  Estratégia de gestão dos processos de produção agrícola
                  visando sustentabilidade ambiental e econômica
                </li>
                <li>
                  Metodologias de amostragem feitas para menor índice de
                  contaminação de solos
                </li>
                <li>
                  16 anos de experiência em operação de campo em Agricultura de
                  Precisão
                </li>
              </ul>
            }
          />
        </div>
      </section>

      <HomeServicesStrip />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Polos de pesquisa
            </h2>
            <p className="mt-2 text-muted-foreground text-lg">
              Nossos centros de pesquisa em Mato Grosso
            </p>
          </div>
        </div>
        <div className="w-full">
          <ResearchPolesMap />
        </div>
      </section>

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
