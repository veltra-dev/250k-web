import { Section } from "@/components/ui/section";
import { AboutBlock } from "@/components/about/about-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre | 250k Consultoria Agrícola",
  description:
    "Conheça a 250k e nossa missão de levar estratégia e resultados para o campo.",
};

const SOBRE_IMAGE_1 = "/images/analise-solo.jpg";
const SOBRE_IMAGE_2 =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80";

export default function SobrePage() {
  return (
    <>
      <Section
        title="Sobre a 250k"
        subtitle="Consultoria agrícola com foco em resultados"
        variant="wide"
      >
        <div className="mb-16">
          <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
            A 250k é uma consultoria agrícola dedicada a apoiar produtores e
            empresas do agronegócio com estratégia, gestão e conhecimento
            técnico.
          </p>
        </div>

        <AboutBlock
          title="Quem somos"
          imageSrc={SOBRE_IMAGE_1}
          imageAlt="Campo e agricultura"
          content={
            <>
              <p>
                Nossa missão é contribuir para o alto desempenho no campo,
                conectando melhores práticas aos seus objetivos. Trabalhamos com
                análises, planejamento e acompanhamento para que sua operação
                alcance os resultados que você busca.
              </p>
              <p>
                Conte conosco para decisões mais assertivas e um negócio mais
                sustentável. Acreditamos que a combinação de conhecimento
                técnico e visão estratégica faz a diferença no agronegócio.
              </p>
            </>
          }
        />

        <AboutBlock
          title="Nossa abordagem"
          imageSrc={SOBRE_IMAGE_2}
          imageAlt="Gestão e planejamento no campo"
          reverse
          className="mt-20"
          content={
            <>
              <p>
                Atuamos de forma próxima ao produtor e às equipes, com foco em
                indicadores que importam: produtividade, custos, mercado e
                sustentabilidade. Nossa abordagem combina diagnóstico,
                planejamento e acompanhamento contínuo.
              </p>
              <p>
                Seja para uma safra, para reestruturação da gestão ou para
                análises pontuais, estamos prontos para apoiar sua operação com
                seriedade e resultados mensuráveis.
              </p>
            </>
          }
        />
      </Section>
    </>
  );
}
