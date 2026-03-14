"use client";

import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { PricingBlockData } from "@/lib/landing-pages/types";

interface PricingBlockProps {
  data: PricingBlockData;
}

export function PricingBlock({ data }: PricingBlockProps) {
  const plans = data.plans ?? [];
  return (
    <Section title={data.title} subtitle={data.subtitle}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <h3 className="text-xl font-semibold text-primary">{plan.name}</h3>
              <p className="text-2xl font-bold text-accent">{plan.price}</p>
              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-accent">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href="/contato">Fale conosco</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
