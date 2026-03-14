import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { BlockRenderer } from "@/components/landing-blocks/renderer";
import type { Block } from "@/lib/landing-pages/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://250k.com.br";

async function getLandingPage(slug: string) {
  const { data, error } = await supabaseServer
    .from("landing_pages")
    .select("id, slug, content")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as { id: string; slug: string; content: Block[] };
}

function getTitleFromContent(content: Block[]): string {
  const first = content?.[0];
  if (!first) return "Landing Page";
  if (first.type === "hero" && first.data && "title" in first.data && first.data.title) {
    return String(first.data.title);
  }
  if (first.type === "cta" && first.data && "title" in first.data && first.data.title) {
    return String(first.data.title);
  }
  return "Landing Page";
}

function getDescriptionFromContent(content: Block[]): string | undefined {
  const first = content?.[0];
  if (!first?.data) return undefined;
  if ("subtitle" in first.data && first.data.subtitle) {
    return String(first.data.subtitle);
  }
  return undefined;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return { title: "Página não encontrada" };

  const title = getTitleFromContent(page.content);
  const description = getDescriptionFromContent(page.content);

  return {
    title,
    description: description ?? undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "website",
      url: `${BASE_URL}/${page.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
    },
  };
}

export default async function LandingPageBySlug({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) notFound();

  return <BlockRenderer content={page.content} />;
}
