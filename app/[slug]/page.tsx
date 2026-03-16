import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { BlockRenderer } from "@/components/landing-blocks/renderer";
import type { Block } from "@/lib/landing-pages/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://250k.com.br";

type LandingPagePublic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: Block[];
};

async function getLandingPage(slug: string): Promise<LandingPagePublic | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseServer
    .from("landing_pages")
    .select("id, slug, title, description, content, starts_at, ends_at")
    .eq("slug", slug)
    .is("deleted_at", null)
    .order("id", { ascending: false });

  if (error || !data?.length) return null;

  const active = data.find(
    (row: { starts_at: string | null; ends_at: string | null }) => {
      const started = row.starts_at == null || row.starts_at <= now;
      const notEnded = row.ends_at == null || row.ends_at > now;
      return started && notEnded;
    },
  );

  if (!active) return null;
  return {
    id: active.id,
    slug: active.slug,
    title: active.title,
    description: active.description,
    content: active.content as Block[],
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return { title: "Página não encontrada" };

  return {
    title: page.title,
    description: page.description || undefined,
    openGraph: {
      title: page.title,
      description: page.description || undefined,
      type: "website",
      url: `${BASE_URL}/${page.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description || undefined,
    },
  };
}

export default async function LandingPageBySlug({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) redirect("/");

  return <BlockRenderer content={page.content} />;
}
