"use client";

import Image from "next/image";

const HERO_WALLPAPER = "/images/wallpapers/wallpaper-5.png";

export function SolucoesHero() {
  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_WALLPAPER}
          alt=""
          fill
          className="object-cover object-[center_53%] md:object-[center_51%]"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-primary/55" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4">
        <div className="rounded-2xl border border-white/15 bg-black/25 px-6 py-8 text-center shadow-lg backdrop-blur-md sm:px-10 sm:py-10 md:px-12 md:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
            Soluções 250
            <span className="text-brand-orange dark:text-[hsl(11_58%_58%)] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
              K
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/92 sm:text-lg md:text-xl md:leading-relaxed [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">
            Um ecossistema de inteligência agronômica para decisões produtivas no
            campo
          </p>
        </div>
      </div>
    </section>
  );
}
