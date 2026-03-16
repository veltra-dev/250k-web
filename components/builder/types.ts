import type { Block } from "@/lib/landing-pages/types";

/** Block with client-only id for stable keys in Reorder list. */
export type BlockWithId = Block & { id: string };

export type LandingPageFormValues = {
  slug: string;
  title: string;
  description: string;
  content: BlockWithId[];
  starts_at: string;
  ends_at: string;
};
