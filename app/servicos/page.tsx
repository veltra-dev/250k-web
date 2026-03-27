import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServicosHero } from "@/components/servicos/servicos-hero";
import { ServicosAnchorNav } from "@/components/servicos/servicos-anchor-nav";
import { AboutBlock } from "@/components/about/about-block";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Soluções | 250k Consultoria Agrícola",
  description:
    "Consultoria agronômica, treinamentos, pesquisa e desenvolvimento, agricultura de precisão e assessoria de compras para o produtor rural.",
};

const SERVICOS_IMAGE =
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=1200&h=900&fit=crop&q=80&auto=format";
const CONSULTORIA_IMAGE = "/images/analise-2.jpg";
const PALESTRAS_IMAGE = "/images/palestra.jpg";
const PESQUISA_IMAGE = "/images/performace.png";
const PRECISAO_IMAGE = "/images/precisao.png";
const ASSESSORIA_IMAGE = "/images/assessoria.png";

export default function ServicosPage() {
  redirect("/solucoes");
  return (
    <>
      <ServicosHero />
      <ServicosAnchorNav />

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 space-y-20 md:space-y-24">
        <section id="consultoria">
          <AboutBlock
            title="Consultoria"
            imageSrc={CONSULTORIA_IMAGE}
            imageAlt="Consultoria agronômica no campo"
            reverse
            content={
              <>
                <p>
                  Com visitas técnicas frequentes e uma análise meticulosa de
                  cada aspecto da lavoura, nossos consultores desenvolvem
                  estratégias personalizadas que se adaptam perfeitamente às
                  suas necessidades.
                </p>
                <p>
                  Desde a escolha das sementes até o manejo integrado de pragas e
                  doenças, cada recomendação é projetada para garantir o máximo
                  retorno sobre o seu investimento.
                </p>
                <h3 className="text-lg font-semibold text-primary pt-2">
                  Detalhamento do Serviço
                </h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Levantamento de histórico dos talhões;</li>
                  <li>
                    Alinhamento de expectativa de produção e fluxo de
                    investimento;
                  </li>
                  <li>
                    Programação de safra (cultivares, fertilidade, biológicos e
                    defensivos químicos);
                  </li>
                </ul>
                <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/contato">Entre em contato</Link>
                </Button>
              </>
            }
          />
        </section>

        <section id="treinamentos-e-palestras">
          <AboutBlock
            title="Treinamentos e Palestras"
            imageSrc={PALESTRAS_IMAGE}
            imageAlt="Treinamentos no campo"
            content={
              <>
                <p>
                  Oferecemos programas educacionais e treinamentos para o manejo
                  eficaz de pragas e doenças, sempre com foco na sustentabilidade
                  e eficácia.
                </p>
                <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/contato">Saiba mais</Link>
                </Button>
              </>
            }
          />
        </section>

        <section id="pesquisa-e-desenvolvimento">
          <AboutBlock
            title="Pesquisa e Desenvolvimento"
            imageSrc={PESQUISA_IMAGE}
            imageAlt="Pesquisa agronômica"
            imageWrapperClassName="aspect-[16/9]"
            reverse
            content={
              <>
                <p>
                  Na 250k realizamos experimentos regionalizados, focados nas
                  grandes culturas. Desenvolvemos pesquisa de novas tecnologias e
                  produtos, nas áreas de: fitotecnia, fertilidade do solo,
                  nutrição, fitopatologia, entomologia, herbologia, biológicos,
                  contribuindo com resultados validados para o desenvolvimento da
                  agricultura da região.
                </p>
                <p>
                  Através dos resultados confiáveis e validados de nossas
                  pesquisas trazemos ao mercado o embasamento para nossas
                  recomendações de alta performance, para elevar a produtividade
                  das lavouras dos nossos clientes.
                </p>
              </>
            }
          />
        </section>

        <section id="agricultura-de-precisao">
          <AboutBlock
            title="Agricultura de precisão"
            imageSrc={PRECISAO_IMAGE}
            imageAlt="Agricultura de precisão"
            imageWrapperClassName="aspect-[3/3] md:aspect-[3/4]"
            content={
              <>
                <p>
                  Entrega técnica do resultado junto com cliente e manejo ideal
                  de acordo com a necessidade de cada cliente.
                </p>
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-accent font-semibold">
                      Mapeamento de fertilidade
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Utilizamos a interpolação de amostras de solo para gerar
                      mapas de fertilidade. Esses mapas são integrados com outros
                      dados para fornecer recomendações de corretivos e
                      fertilizantes de forma rápida e precisa.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent font-semibold">
                      Precisão na Coleta
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Amostras indeformadas garantindo a representatividade do
                      perfil amostrado; equipamento padronizado para que todas
                      subamostras tenham o mesmo volume. Pontos georreferenciados.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent font-semibold">
                      Mapeamento de compactação
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Oferecemos análises detalhadas da compactação do solo,
                      utilizando penetrômetros digitais. Os dados são facilmente
                      integrados através do PenetroView. Benefícios: aumento da
                      produtividade, melhoria do crescimento radicular,
                      otimização da infiltração e armazenamento de água,
                      prevenção de erosão hídrica, melhora na aeração do solo,
                      aumento da absorção de nutrientes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent font-semibold">
                      Mapeamento de nematoides
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      O mapeamento de nematoides é essencial no manejo agrícola,
                      para identificar e controlar a população desses parasitas
                      no solo, reduzindo os danos causados nas grandes culturas.
                      Benefícios: detecção precoce, manejo direcionado,
                      otimização de custos, melhoria da produtividade.
                    </p>
                  </div>
                </div>
              </>
            }
          />
        </section>

        <section id="assessoria-de-compras">
          <AboutBlock
            title="Assessoria de Compra"
            imageSrc={ASSESSORIA_IMAGE}
            imageAlt="Assessoria de compras"
            reverse
            content={
              <>
                <p>
                  Nossa assessoria atua como um intermediário entre produtores e
                  fornecedores, gerenciando todo o processo de aquisição de
                  insumos, desde a seleção de fornecedores até as negociações de
                  preço e prazo.
                </p>
                <p>
                  Utilizamos nossa ampla rede de contatos e conhecimento do
                  mercado para garantir que você obtenha os melhores produtos
                  pelos melhores preços.
                </p>
              </>
            }
          />
        </section>
      </div>
    </>
  );
}
