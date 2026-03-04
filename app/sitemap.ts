import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import type { PostSlugItem } from "@/lib/sanity/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://250k.com.br";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/servicos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const slugs = await sanityClient.fetch<PostSlugItem[]>(POST_SLUGS_QUERY);
    blogPosts = slugs.map((item) => ({
      url: `${BASE_URL}/blog/${item.slug.current}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity not configured or unreachable; only static routes
  }
  return [...staticRoutes, ...blogPosts];
}
