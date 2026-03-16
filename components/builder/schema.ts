import { z } from "zod";

const slugTransform = z
  .string()
  .min(1, "Informe o slug.")
  .transform((s) => s.trim().toLowerCase().replace(/\s+/g, "-"));

export const landingPageFormSchema = z.object({
  slug: slugTransform,
  title: z.string(),
  description: z.string(),
  content: z.array(z.unknown()),
  starts_at: z.string(),
  ends_at: z.string(),
});

export type LandingPageFormSchemaValues = z.infer<typeof landingPageFormSchema>;
