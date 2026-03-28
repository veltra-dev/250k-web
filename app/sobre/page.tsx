import { Section } from "@/components/ui/section";
import { AboutBlock } from "@/components/about/about-block";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre | 250k Consultoria Agrícola",
  description:
    "Conheça a 250k e nossa missão de levar estratégia e resultados para o campo.",
};

const SOBRE_IMAGE_1 = "/images/analise-solo.jpg";
const SOBRE_IMAGE_2 = "/images/time-line.png";

export default function SobrePage() {
  return (
    <>
      <Section
        title="Sobre a 250k"
        subtitle="Consultoria agrícola com foco em resultados"
        variant="wide"
      >
        <div className="mb-16 max-w-3xl">
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>Nascemos de uma inquietação simples.</p>
            <p>
              Por que, mesmo com tanta tecnologia, o produtor não consegue
              explorar o potencial da sua área?
            </p>
            <p>
              A resposta não está na falta de insumos. Está na falta de
              método.
            </p>
            <p>Dessa necessidade, nasce a 250K.</p>
            <p>
              Um hub de inteligência agronômica que transforma ciência em
              resultados práticos e rentáveis.
            </p>
          </div>
        </div>

        <AboutBlock
          title="Quem somos"
          imageSrc={SOBRE_IMAGE_1}
          imageAlt="Campo e agricultura"
          content={
            <>
              <p>
                Atuamos lado a lado com o produtor, para elevar a produtividade,
                eficiência e lucro, por meio de um sistema produtivo
                personalizado descomplicado, entendendo os desafios da sua
                área, para atingirmos altos tetos de produtividade.
              </p>
              <p>
                Acreditamos que ambientes totalmente preparados podem atingir
                tetos de produtividade de 85 sacas de soja mais 165 sacas de
                milho. Com um potencial de 250 sacas por safra em áreas
                mapeadas.
              </p>
            </>
          }
        />

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
            Evolução da 250K (2023-2026)
          </h2>

          <div className="mt-8 max-w-3xl mx-auto text-left text-muted-foreground leading-relaxed space-y-4 text-lg">
            <p>
              <span className="font-bold text-primary">2023:</span> Nasce a 250K
              com um propósito claro: transformar áreas rurais em fazendas
              produtivas.
            </p>
            <p>
              <span className="font-bold text-primary">2024:</span> Novas regiões,
              mais tecnologia e um passe estratégico: Agricultura de Precisão.
            </p>
            <p>
              <span className="font-bold text-primary">2025:</span> Consolidação
              da 250K no mercado. Escala, reconhecimento e consistência de
              resultados.
            </p>
            <p>
              <span className="font-bold text-primary">2026:</span> A 250K evolui
              para um ecossistema completo. Reposicionando as soluções de modo
              estratégico e fundando a 250K Academy.
            </p>
          </div>

          <div className="mt-10 max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-white border border-border">
              <Image
                src={SOBRE_IMAGE_2}
                alt="Linha do tempo 250K (2023-2026)"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
                priority={false}
              />
            </div>
          </div>
        </section>
      </Section>
    </>
  );
}
