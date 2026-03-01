"use client";

import { useCallback, useEffect, useState } from "react";
import { IconQuote } from "@tabler/icons-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/testimonials";

export function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      if (api) onSelect(api);
    };
    api.on("select", sync);
    queueMicrotask(sync);
    return () => {
      api.off("select", sync);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
      if (api.canScrollNext() === false) {
        api.scrollTo(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full max-w-3xl md:max-w-6xl mx-auto px-12">
      <Carousel
        opts={{ align: "center", loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((t) => (
            <CarouselItem key={t.id} className="basis-full md:basis-1/3">
              <Card className="border-border bg-card">
                <CardContent className="pt-8 pb-8 px-8">
                  <IconQuote className="h-10 w-10 text-primary/30 mb-4" size={40} />
                  <blockquote className="text-lg text-foreground leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-6">
                    <p className="font-semibold text-primary">{t.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.role} — {t.company}
                    </p>
                  </footer>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-12" />
        <CarouselNext className="right-0 md:-right-12" />
      </Carousel>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para depoimento ${i + 1}`}
            onClick={() => api && api.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
