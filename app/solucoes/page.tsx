import type { Metadata } from "next";
import { AboutBlock } from "@/components/about/about-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { SolucoesHero } from "@/components/solucoes/solucoes-hero";
import { SolucoesAnchorNav } from "@/components/solucoes/solucoes-anchor-nav";

const PD_IMAGE = "/images/post/pd-k-post.png";
const FIELD_IMAGE = "/images/post/field-k-post.png";
const FINANCE_IMAGE = "/images/post/finance-k-post.png";
const SOLO_CHEC_IMAGE = "/images/post/solochec-k-post.png";
const CERTIFICA_IMAGE = "/images/post/certifica-k-post.png";
const ACADEMY_IMAGE = "/images/post/250k-academy-post.png";

const PD_LOGO = "/images/empresas/pdK.svg";
const FIELD_LOGO = "/images/empresas/FiedK.svg";
const FINANCE_LOGO = "/images/empresas/FinanceK.svg";
const SOLO_CHEC_LOGO = "/images/empresas/solo%20checK.svg";
const CERTIFICA_LOGO = "/images/empresas/CertificaK.svg";
const ACADEMY_LOGO = "/images/empresas/Academy.svg";

/** Posts em formato vertical: área mais alta e contain para mostrar a arte inteira. */
const SOLUCOES_POST_IMAGE_LAYOUT = {
  imageWrapperClassName:
    "w-full aspect-[4/5] md:aspect-auto md:min-h-[520px] lg:min-h-[600px]",
  imageClassName: "object-contain object-center",
} as const;

export const metadata: Metadata = {
  title: "Soluções | 250k Consultoria Agrícola",
  description:
    "Ecossistema 250K com inteligência agronômica, validação por pesquisa e decisões produtivas: PD-K, Field-K, Finance-K, Solo Chec-K, Certifica-K e 250K Academy.",
};

export default function SolucoesPage() {
  return (
    <>
      <SolucoesHero />
      <SolucoesAnchorNav />

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 space-y-20 md:space-y-24">
        <section id="pd-k">
          <AboutBlock
            title="PD-K"
            titleLogoSrc={PD_LOGO}
            imageSrc={PD_IMAGE}
            imageAlt="Pesquisa e desenvolvimento agronômico"
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <h3 className="text-lg font-semibold text-primary pt-2">
                  Onde a insegurança da escolha se torna produtividade na lavoura
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A PD-K é o núcleo de inteligência da 250K que transforma dados
                  de campo em decisões altamente produtivas para as culturas
                  de soja e milho de forma independente, sem viés comercial.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A PD-K é uma proteção contra o erro do produtor rural. Para
                  desenvolver análises científicas do sistema de plantio.
                </p>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  Produzimos anualmente mais de 36 ensaios experimentais da
                  cultura de soja e milho, com rigor científico, para avaliar
                  influência dos:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Fungicidas;</li>
                  <li>Inseticidas;</li>
                  <li>Herbicidas;</li>
                  <li>Tratamento de Sementes;</li>
                  <li>Estratégias de manejo integrado.</li>
                </ul>

                <p className="text-primary font-semibold pt-2">
                  Nossos resultados apontam até 40% de redução na incidência
                  de podridão de grãos.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Sob diferentes adversidades encontradas pelo produtor
                  (condições climáticas, níveis de pressão de doenças e pragas),
                  para termos respostas assertivas do que e como se deve
                  plantar.
                </p>

                <p className="text-primary font-semibold pt-2">
                  Somos o maior acervo de conhecimento técnico agrícolas nas
                  culturas de soja e milho da região norte do estado de Mato
                  Grosso.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Nossos estudos realizados são únicos e garantem informações que
                  apoiam a tomada de decisão do produtor rural. Transformando
                  decisões em produtividades.
                </p>

                <p className="text-muted-foreground pt-2">
                  Nosso clientes e parceiros têm acessos a:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Laudos técnicos detalhados</li>
                  <li>Relatórios comparativos de performance</li>
                  <li>Dados quantitativos reais de campo</li>
                  <li>Recomendações práticas e aplicáveis</li>
                  <li>Insights estratégicos para safra</li>
                </ul>

                <p className="text-primary font-semibold pt-2">
                  Já investimos mais de 5.5 Milhões nos últimos 2 anos em
                  Pesquisa e Desenvolvimento.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>2,2 Mi em 2024</li>
                  <li>2,5 Mi em 2025</li>
                  <li>0,8 Mi em 2026</li>
                </ul>

                <p className="text-muted-foreground pt-2">
                  Somos um sistema de validação único:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    Metodologia com delineamento experimental e análise
                    estatística robusta;
                  </li>
                  <li>
                    Sistema Avalia (padronização, rastreabilidade e consistência
                    de dados);
                  </li>
                  <li>Equipe Técnica altamente especializada;</li>
                  <li>Direção Técnica com experiência prática e científica;</li>
                  <li>Independência total de empresas de insumo.</li>
                </ul>

                <p className="text-muted-foreground pt-2">
                  E você pode ter acesso a todas essas informações.
                </p>
              </>
            }
          />
        </section>

        <section id="field-k">
          <AboutBlock
            title="Field-K"
            titleLogoSrc={FIELD_LOGO}
            imageSrc={FIELD_IMAGE}
            imageAlt="Execução e validação no campo"
            reverse
            className="mt-20"
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <h3 className="text-lg font-semibold text-primary pt-2">
                  Complexo no campo. Simples na decisão.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A Field-K transforma excesso de informação em recomendações
                  claras, precisas e lucrativas para o produtor.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Reunimos em um modelo descomplicado, todas as etapas, fases e
                  relação de insumos para que você não perca o timing da sua
                  lavoura.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Temos como propósito entregar ao nosso produtor um plano de safra
                  descomplicado, focado na eficiência operacional, validado com
                  informações de campo do nosso centro de Pesquisa e
                  Desenvolvimento (PD-K).
                </p>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  Atuamos diretamente nas decisões que mais impactam o resultado
                  da sua fazenda:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Planejamento de Safra</li>
                  <li>Relação de Compra de Insumos</li>
                  <li>
                    Posicionamento de Produto (volume e timing de aplicação)
                  </li>
                  <li>Coordenação Operacional</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  Nossa metodologia está assegurada pelo plano de desenvolvimento
                  250K (85 sacas de soja + 165 sacas de milho) e estruturado pelos
                  protocolos técnicos de pesquisa.
                </p>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  A Consultoria Field-K consta com:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Segurança na Informação</li>
                  <li>Metodologia de Trabalho</li>
                  <li>Experiência no campo</li>
                  <li>
                    Validação da entrega pelo CEO José Paschoal (uma das maiores
                    autoridades nas culturas de soja e milho da região norte do
                    estado de Mato Grosso).
                  </li>
                </ul>

                <p className="text-primary font-semibold pt-2">
                  Transformamos a sua execução para colher resultados em campo.
                </p>
              </>
            }
          />
        </section>

        <section id="finance-k">
          <AboutBlock
            title="Finance-K"
            titleLogoSrc={FINANCE_LOGO}
            imageSrc={FINANCE_IMAGE}
            imageAlt="Pool de Compra"
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum. Curabitur pretium
                  tincidunt lacus cras id lectus mi.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm italic">
                  Texto provisório — substituir pela copy oficial de Finance-K
                  quando disponível.
                </p>
                {/* TODO: substituir lorem ipsum pela copy final de Finance-K. */}
              </>
            }
          />
        </section>

        <section id="solo-chec-k">
          <AboutBlock
            title="Solo Chec-K"
            titleLogoSrc={SOLO_CHEC_LOGO}
            imageSrc={SOLO_CHEC_IMAGE}
            imageAlt="Agricultura de Precisão"
            reverse
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <p className="text-muted-foreground leading-relaxed">
                  Agricultura de Precisão para decisões operacionais com base em
                  dados de campo.
                </p>
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-accent font-semibold">
                      Mapeamento de fertilidade
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Utilizamos amostragem e interpolação para gerar mapas que
                      orientam recomendações de manejo e insumos.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent font-semibold">
                      Precisão na Coleta
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Padrão de coleta e georreferenciamento para garantir
                      representatividade e rastreabilidade dos dados.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent font-semibold">
                      Mapeamento de compactação
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Análises de compactação para melhorar crescimento radicular,
                      infiltração e armazenamento de água.
                    </p>
                  </div>
                </div>
              </>
            }
          />
        </section>

        <section id="certifica-k">
          <AboutBlock
            title="Certifica-K"
            titleLogoSrc={CERTIFICA_LOGO}
            imageSrc={CERTIFICA_IMAGE}
            imageAlt="Certificação de Fazendas Produtivas"
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <p className="text-muted-foreground leading-relaxed">
                  Certificação de Fazendas Produtivas baseada em dados, validação
                  técnica e rastreabilidade de processos.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Governança e consistência de registros</li>
                  <li>Validação por critérios técnicos</li>
                  <li>Relatórios e evidências para auditoria</li>
                </ul>
                <div className="pt-2">
                  <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/questionario">Quero avaliar minha fazenda</Link>
                  </Button>
                </div>
              </>
            }
          />
        </section>

        <section id="academy">
          <AboutBlock
            title="250K Academy"
            titleLogoSrc={ACADEMY_LOGO}
            imageSrc={ACADEMY_IMAGE}
            imageAlt="Dados de campo e produtividade"
            reverse
            {...SOLUCOES_POST_IMAGE_LAYOUT}
            content={
              <>
                <p className="text-muted-foreground leading-relaxed">
                  Onde dados de campo viram produtividade: acesso ao acervo e ao
                  conhecimento técnico das culturas de soja e milho da região norte
                  do estado de Mato Grosso.
                </p>
                <p className="text-primary font-semibold pt-2">
                  Acesse 250K Academy - Onde dados de campo viram produtividade
                </p>
                <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a
                    href="https://academiadeconsultores.250k.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conhecer a Academia de Consultores
                  </a>
                </Button>
              </>
            }
          />
        </section>
      </div>
    </>
  );
}

