"use client";

import type { Block, GenericBlock } from "@/lib/landing-pages/types";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { PricingBlock } from "./PricingBlock";
import { CTABlock } from "./CTABlock";

const blockComponents: Record<
  string,
  React.ComponentType<{ data: Record<string, unknown> }>
> = {
  hero: HeroBlock as unknown as React.ComponentType<{ data: Record<string, unknown> }>,
  features: FeaturesBlock as unknown as React.ComponentType<{ data: Record<string, unknown> }>,
  pricing: PricingBlock as unknown as React.ComponentType<{ data: Record<string, unknown> }>,
  cta: CTABlock as unknown as React.ComponentType<{ data: Record<string, unknown> }>,
};

interface BlockRendererProps {
  content: (Block | GenericBlock)[];
}

export function BlockRenderer({ content }: BlockRendererProps) {
  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  return (
    <>
      {content.map((block, index) => {
        const Component = blockComponents[block.type];
        if (!Component) {
          return null;
        }
        return (
          <Component
            key={`${block.type}-${index}`}
            data={(block as GenericBlock).data ?? {}}
          />
        );
      })}
    </>
  );
}

export { blockComponents };
