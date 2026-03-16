"use client";

import Image from "next/image";
import { IconChevronDown, IconChevronsDown } from "@tabler/icons-react";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

interface HeroProps {
  imageSrc?: string;
}

export function Hero({ imageSrc = DEFAULT_HERO_IMAGE }: HeroProps) {
  const scrollToContent = () => {
    document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section data-hero className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-4 max-w-6xl text-center flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md leading-tight">
          Somos a{" "}
          <span className="bg-accent text-accent-foreground px-2 py-0.5 md:px-3 md:py-1 rounded whitespace-nowrap">
            Inteligência Agronômica
          </span>{" "}
          no campo junto ao Produtor Rural
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-sm">
          Conheça mais sobre a nossa empresa
        </p>
      </div>

      <button
        type="button"
        onClick={scrollToContent}
        aria-label="Rolar para o conteúdo"
        className="relative z-10 mb-8 flex flex-col items-center gap-0.5 text-white/90 hover:text-white transition-colors animate-bounce duration-2000"
      >
        <IconChevronsDown className="size-8" strokeWidth={2} />
      </button>
    </section>
  );
}
