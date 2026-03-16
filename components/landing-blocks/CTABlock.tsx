"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CtaBlockProps {
  data: {
    title: string;
    subtitle?: string;
    buttonText: string;
    buttonLink: string;
  };
}

export function CTABlock({ data }: CtaBlockProps) {
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl md:text-4xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="mt-4 text-lg opacity-95">{data.subtitle}</p>
        )}
        <div className="mt-8">
          <Button asChild size="lg" variant="outline">
            <Link href={data.buttonLink || "#"}>
              {data.buttonText || "Saiba mais"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
