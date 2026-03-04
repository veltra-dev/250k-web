import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

export const sanityClient = (client ??
  {
    fetch: async () => {
      throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
    },
  }) as unknown as ReturnType<typeof createClient>;
