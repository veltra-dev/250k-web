"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroBlockData } from "@/lib/landing-pages/types";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

interface HeroBlockProps {
  data: HeroBlockData;
}

export function HeroBlock({ data }: HeroBlockProps) {
  const imageUrl = data.imageUrl || DEFAULT_HERO_IMAGE;
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized={imageUrl.startsWith("data:") || imageUrl.includes("localhost")}
        />
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md">
          {data.title || "Título"}
        </h1>
        {data.subtitle && (
          <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-sm">
            {data.subtitle}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          {data.primaryButtonText && data.primaryButtonLink && (
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
            >
              <Link href={data.primaryButtonLink}>{data.primaryButtonText}</Link>
            </Button>
          )}
          {data.secondaryButtonText && data.secondaryButtonLink && (
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
              <Link href={data.secondaryButtonLink}>{data.secondaryButtonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
