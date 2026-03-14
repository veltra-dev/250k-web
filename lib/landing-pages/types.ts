/**
 * Block-based landing page types.
 * Each block has a type and a data payload; the renderer maps type → component.
 */

// Per-block data shapes
export interface HeroBlockData {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface FeaturesBlockData {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  description?: string;
  features?: string[];
}

export interface PricingBlockData {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export interface CtaBlockData {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

// Discriminated union of all block types
export interface HeroBlock {
  type: "hero";
  data: HeroBlockData;
}

export interface FeaturesBlock {
  type: "features";
  data: FeaturesBlockData;
}

export interface PricingBlock {
  type: "pricing";
  data: PricingBlockData;
}

export interface CtaBlock {
  type: "cta";
  data: CtaBlockData;
}

export type Block =
  | HeroBlock
  | FeaturesBlock
  | PricingBlock
  | CtaBlock;

// Generic shape for unknown blocks (renderer fallback)
export interface GenericBlock {
  type: string;
  data: Record<string, unknown>;
}

// Landing page row from Supabase
export interface LandingPageRow {
  id: string;
  slug: string;
  content: Block[];
}

// Reserved slugs that must not be used (static routes)
export const RESERVED_SLUGS = [
  "sobre",
  "servicos",
  "contato",
  "blog",
  "studio",
  "admin",
] as const;

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug as (typeof RESERVED_SLUGS)[number]);
}

// Default data for new blocks (builder)
export const DEFAULT_BLOCK_DATA: Record<Block["type"], Block["data"]> = {
  hero: {
    title: "Título do hero",
    subtitle: "Subtítulo opcional",
    primaryButtonText: "Botão principal",
    primaryButtonLink: "/contato",
    secondaryButtonText: "Secundário",
    secondaryButtonLink: "/servicos",
  },
  features: {
    title: "Destaques",
    subtitle: "Conheça nossos diferenciais",
    items: [
      { title: "Item 1", description: "Descrição do item 1." },
      { title: "Item 2", description: "Descrição do item 2." },
      { title: "Item 3", description: "Descrição do item 3." },
    ],
  },
  pricing: {
    title: "Planos",
    subtitle: "Escolha o melhor para você",
    plans: [
      { name: "Plano Básico", price: "Sob consulta", description: "Ideal para começar." },
      { name: "Plano Completo", price: "Sob consulta", description: "Para quem quer mais.", features: ["Recurso A", "Recurso B"] },
    ],
  },
  cta: {
    title: "Pronto para começar?",
    subtitle: "Fale com nossa equipe.",
    buttonText: "Fale conosco",
    buttonLink: "/contato",
  },
};
