"use client";

import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import type { FeaturesBlockData } from "@/lib/landing-pages/types";

interface FeaturesBlockProps {
  data: FeaturesBlockData;
}

export function FeaturesBlock({ data }: FeaturesBlockProps) {
  const items = data.items ?? [];
  return (
    <Section title={data.title} subtitle={data.subtitle}>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
