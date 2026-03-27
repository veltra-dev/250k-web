"use client";

import { Button } from "@/components/ui/button";
import { IconChevronsDown } from "@tabler/icons-react";
import { LeadCaptureDialog } from "./lead-capture-dialog";

const DEFAULT_HERO_IMAGE =
  "/images/250k.jpg";


const DEFAULT_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";

interface HeroProps {
  imageSrc?: string;
  videoSrc?: string;
  videoPosterSrc?: string;
}

export function Hero({
  imageSrc = DEFAULT_HERO_IMAGE,
  videoSrc = DEFAULT_HERO_VIDEO_URL,
  videoPosterSrc = imageSrc,
}: HeroProps) {
  const scrollToContent = () => {
    document
      .getElementById("nosso-proposito")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section data-hero className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-primary">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={videoPosterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
      </div>

      <div className="relative z-10 isolate container mx-auto px-4 max-w-6xl text-center flex-1 flex flex-col items-center justify-center [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase">
          Direcionamos a sua fazenda para atingir
          <span className="bg-accent text-accent-foreground px-2 py-0.5 md:px-3 md:py-1 rounded whitespace-nowrap ml-2 text-shadow-none">
            altos tetos
          </span>{" "}
          de <span className="bg-accent text-accent-foreground px-2 py-0.5 md:px-3 md:py-1 rounded whitespace-nowrap text-shadow-none">produtividade</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto">
          Aplicamos a ciência que transforma dados em lucratividade
        </p>
        <div className="mt-15 flex items-center justify-center">
          <LeadCaptureDialog
            trigger={
              <Button
                size="lg"
                className="h-16 px-10 rounded-xl bg-accent text-accent-foreground font-black text-xl uppercase tracking-tight hover:bg-accent/90 border-b-4 border-orange-900 active:border-b-0"
              >
                Sua Fazenda é produtiva?
              </Button>
            }
          />
        </div>

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
