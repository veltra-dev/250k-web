import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { archivoSolutionTitle } from "@/lib/fonts/archivo-solution-title";
import { splitBrandKTitle } from "@/lib/solucoes-brand-title";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/home/hero";
import { CommoditiesWidget } from "@/components/home/commodities-widget";
import { ResearchPolesMap } from "@/components/home/research-poles-map";
import { PartnersCarousel } from "@/components/home/partners-carousel";
import { CasesJourneyTimeline } from "@/components/home/cases-journey-timeline";
import { PerformanceProgressChart } from "@/components/home/performance-progress-chart";
import { getCommodities } from "@/lib/commodities";
import { BigNumbersIntro } from "@/components/home/big-numbers-intro";
import { PropositoEquation } from "@/components/home/proposito-equation";

const hubCardFooterCopyClass =
  "text-center text-sm font-semibold leading-snug text-primary";

const hubWordmarkTitleStyle = {
  fontVariationSettings: "'wght' 800, 'wdth' 125",
} as const;

const hubWordmarkClassName = cn(
  archivoSolutionTitle.className,
  "block max-w-full break-words px-1 text-center uppercase leading-tight tracking-tight text-primary",
  "text-sm sm:text-base md:text-lg lg:text-xl",
);

function HubSolutionWordmark({ wordmark }: { wordmark: string }) {
  const { before, accent, after } = splitBrandKTitle(wordmark);
  return (
    <span className={hubWordmarkClassName} style={hubWordmarkTitleStyle}>
      {before}
      {accent ? (
        <span className="text-brand-orange dark:text-[hsl(11_55%_62%)]">
          {accent}
        </span>
      ) : null}
      {after}
    </span>
  );
}

type HubProduct =
  | {
      type: "solution";
      href: string;
      wordmark: string;
      subtitle: string;
    }
  | {
      type: "academy";
      logo: string;
      logoAlt: string;
      description: string;
      ctaHref: string;
      ctaLabel: string;
    };

const hubProducts: HubProduct[] = [
  {
    type: "solution",
    href: "/solucoes#pd-k",
    wordmark: "PDK",
    subtitle: "Pesquisa e Desenvolvimento",
  },
  {
    type: "solution",
    href: "/solucoes#field-k",
    wordmark: "FieldK",
    subtitle: "Plano de safra e execução no campo",
  },
  {
    type: "solution",
    href: "/solucoes#finance-k",
    wordmark: "FinanceK",
    subtitle: "Pool de Compra",
  },
  {
    type: "solution",
    href: "/solucoes#solo-chec-k",
    wordmark: "Solo ChecK",
    subtitle: "Agricultura de Precisão",
  },
  {
    type: "solution",
    href: "/solucoes#certifica-k",
    wordmark: "CertificaK",
    subtitle: "Certificadora de Fazendas Produtivas",
  },
  {
    type: "academy",
    logo: "/images/empresas/Academy2.svg",
    logoAlt: "250K Academy",
    description: "Onde dados de campo viram produtividade",
    ctaHref: "https://academiadeconsultores.250k.com.br",
    ctaLabel: "Acessar Academia",
  },
];

export default async function HomePage() {
  const commodities = await getCommodities();

  return (
    <>
      <Hero />
      <CommoditiesWidget data={commodities} />

      <Section
        title="Nosso propósito"
        subtitle="Transformamos áreas rurais comuns em um verdadeiro sistema produtivo de alta performance"
        variant="wide"
        id="nosso-proposito"
      >
        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
          <p>Dominamos todas as variáveis que impactam o resultado no campo.</p>
          <PropositoEquation />
        </div>
      </Section>

      {/* [CASES DE SUCESSO] — título no grid para alinhar o topo da timeline ao H2 */}
      <Section variant="wide">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-x-10 lg:gap-y-6">
          <div className="flex min-h-0 min-w-0 flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-primary md:text-3xl">
                Cases de sucesso
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Jornada sistêmica para atingir altos tetos de produtividade
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Construímos uma jornada sistêmica para sua fazenda atingir altos
                tetos de produtividade.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Onde você recebe o mapa da lucratividade para uma safra de alta
                performance:
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-6">
              <div className="text-muted-foreground text-sm uppercase tracking-wide">
                Progressão de performance
              </div>
              <PerformanceProgressChart />
              <p className="mt-3 text-muted-foreground">
                Progressão de performance de acordo com seu estágio atual para
                atingirmos toda a área de plantio.
              </p>

              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="text-muted-foreground text-xs">
                  * Indicadores e decisões validados com dados de campo.
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col lg:pl-2">
            <CasesJourneyTimeline />
          </div>
        </div>
      </Section>

      {/* [AUTORIDADE] */}
      <Section
        title="Autoridade"
        afterTitle={
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Estamos conectados com os maiores players do mercado.
            </p>
            <PartnersCarousel />
          </div>
        }
        subtitle="*Informação precisa, sem viés comercial e orientada por pesquisa"
        subtitleClassName="text-sm"
        variant="wide"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Somos o maior acervo de informações precisas e sem viés comercial
              da região norte do estado de Mato Grosso nas culturas de soja e
              milho.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Em breve, você terá acesso a todas essas informações na 250K
              Academy.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-background/40 p-6">
            <div className="text-primary font-semibold">O que sustentamos</div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>4 Pólos de Pesquisa</li>
              <li>Investimentos superiores a 5.5 MI</li>
              <li>
                Divulgações de resultados de pesquisa para transformar incerteza
                do campo em produtividade
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Hub / Ecossistema */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="mx-auto mb-8 max-w-4xl space-y-3 text-center">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">
              Um hub de soluções completa para você:
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              PD-K, Field-K, Finance-K, Solo Chec-K, Certifica-K e 250K Academy
              conectam ciência, decisões e execução para elevar sua
              produtividade.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
            {hubProducts.map((item) => {
              const isAcademy = item.type === "academy";
              const shellClass =
                "flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm transition-colors hover:border-border hover:shadow-md";

              const body = isAcademy ? (
                <div className="flex min-h-[104px] flex-1 items-center justify-center bg-linear-to-b from-primary/18 via-primary/10 to-primary/5 p-3 sm:min-h-[118px] sm:p-3.5">
                  <Image
                    src={item.logo}
                    alt={item.logoAlt}
                    width={160}
                    height={80}
                    className="h-15 w-auto max-w-30 object-contain sm:h-17 sm:max-w-32"
                    unoptimized
                    priority
                  />
                </div>
              ) : (
                <div className="flex min-h-[88px] flex-1 items-center justify-center bg-linear-to-b from-primary/18 via-primary/10 to-primary/5 px-1.5 py-2 sm:min-h-[100px] sm:px-2 sm:py-2.5">
                  <HubSolutionWordmark wordmark={item.wordmark} />
                </div>
              );

              const footer = (
                <div className="shrink-0 border-t border-border/30 bg-background/35 px-3 py-3 sm:px-3.5 sm:py-3.5">
                  {isAcademy ? (
                    <>
                      <p className={`mb-2.5 ${hubCardFooterCopyClass}`}>
                        {item.description}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="h-7 w-full bg-accent px-1.5 py-0 text-[0.65rem] leading-tight text-accent-foreground hover:bg-accent/90 sm:h-8 sm:text-xs"
                      >
                        <a
                          href={item.ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.ctaLabel}
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2 text-center sm:space-y-2.5">
                      <p className={hubCardFooterCopyClass}>{item.subtitle}</p>
                      <div className="text-xs font-normal text-primary transition-colors group-hover:text-brand-orange group-hover:underline dark:group-hover:text-[hsl(11_55%_62%)] sm:text-sm">
                        Saiba mais
                      </div>
                    </div>
                  )}
                </div>
              );

              if (isAcademy) {
                return (
                  <div key="academy" className={shellClass}>
                    {body}
                    {footer}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group ${shellClass}`}
                  aria-label={`${item.wordmark}: ${item.subtitle}`}
                >
                  {body}
                  {footer}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* [BIG NUMBERS] */}
      <Section variant="wide" className="overflow-x-clip">
        <BigNumbersIntro />

        <div className="mb-5 max-w-2xl">
          <h3 className="text-lg font-semibold text-primary">
            Mapa com os clientes
          </h3>
          <p className="text-muted-foreground">
            Um mapa de lucratividade para direcionar cada decisão: diagnóstico
            do solo, inteligência de dados, estratégia agronômica e eficiência
            no manejo.
          </p>
        </div>

        <div className="relative mt-2 w-screen max-w-[100vw] -translate-x-1/2 left-1/2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background via-background/80 to-transparent backdrop-blur-[1px] sm:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background via-background/80 to-transparent backdrop-blur-[1px] sm:w-24"
          />
          <div className="mask-[linear-gradient(90deg,transparent_0%,black_7%,black_93%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_7%,black_93%,transparent_100%)]">
            <ResearchPolesMap />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-background/40 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground uppercase">
                Estamos mudando a realidade de vários produtores:
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                Transforme a sua fazenda
              </div>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent text-accent-foreground shadow-none transition-shadow duration-300 hover:shadow-[0_0_28px_hsl(var(--accent)/0.42)]"
              >
                <Link href="/questionario">Clique aqui e saiba mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
