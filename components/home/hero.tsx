import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

interface HeroProps {
  imageSrc?: string;
}

export function Hero({ imageSrc = DEFAULT_HERO_IMAGE }: HeroProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Campo agrícola"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md">
          Consultoria agrícola para alto desempenho
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-sm">
          Estratégia, gestão e resultados no campo. Apoiamos produtores e
          empresas do agronegócio com conhecimento técnico e planejamento.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
          >
            <Link href="/contato">Fale conosco</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            // className="border-white text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/servicos">Nossos serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
