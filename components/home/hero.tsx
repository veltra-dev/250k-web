"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconChevronsDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const DEFAULT_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";

type HeroVideoStatus = "loading" | "ready" | "error";

interface HeroProps {
  videoSrc?: string;
}

function HeroBackgroundVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<HeroVideoStatus>("loading");

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const markReady = () => {
      setStatus((s) => (s === "error" ? s : "ready"));
    };

    // Cached / fast loads: canplay may fire before React’s onCanPlay runs.
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady();
    }

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
    };
  }, [src]);

  if (status === "error") {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setStatus("error")}
        className={cn(
          "absolute inset-0 z-0 h-full w-full object-cover transition-[filter,transform] duration-300 ease-out",
          status === "loading" ? "blur-lg" : "blur-0",
        )}
        aria-hidden
      >
        <source src={src} type="video/mp4" />
        <span className="sr-only">
          Vídeo de fundo não suportado neste navegador.
        </span>
      </video>
      {status === "loading" ? (
        <div
          className="absolute inset-0 z-1 bg-primary/20 backdrop-blur-sm"
          aria-hidden
        />
      ) : null}
    </>
  );
}

export function Hero({ videoSrc = DEFAULT_HERO_VIDEO_URL }: HeroProps) {
  const scrollToContent = () => {
    document
      .getElementById("nosso-proposito")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-hero
      className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary">
        {videoSrc ? (
          <HeroBackgroundVideo key={videoSrc} src={videoSrc} />
        ) : null}
        <div className="absolute inset-0 z-2 bg-primary/70" aria-hidden />
      </div>

      <div className="relative z-10 isolate container mx-auto px-4 max-w-6xl text-center flex-1 flex flex-col items-center justify-center [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase">
          Direcionamos a sua fazenda para atingir
          <span className="bg-accent text-accent-foreground px-2 py-0.5 md:px-3 md:py-1 rounded whitespace-nowrap ml-2 text-shadow-none">
            altos tetos
          </span>{" "}
          de{" "}
          <span className="bg-accent text-accent-foreground px-2 py-0.5 md:px-3 md:py-1 rounded whitespace-nowrap text-shadow-none">
            produtividade
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto">
          Aplicamos a ciência que transforma dados em lucratividade
        </p>
        <div className="mt-15 flex items-center justify-center">
          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-xl bg-accent hover:bg-accent! text-accent-foreground font-black text-xl uppercase tracking-tight border-b-4 border-orange-900 active:border-b-0 shadow-none transition-all duration-300 hover:shadow-[0_0_28px_hsl(var(--accent)/0.42)]"
          >
            <Link href="/questionario">Sua Fazenda é produtiva?</Link>
          </Button>
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
