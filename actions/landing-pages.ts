"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { supabaseServer } from "@/lib/supabase/server";
import type { Block } from "@/lib/landing-pages/types";
import { isReservedSlug } from "@/lib/landing-pages/types";

export type LandingPageActionResult =
  | { success: true; message?: string; id?: string }
  | { success: false; message: string };

function slugValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 1 && slug.length <= 100;
}

export async function listLandingPages(): Promise<
  { id: string; slug: string }[] | { error: string }
> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { error: "Não autorizado." };
  }

  const { data, error } = await supabaseServer
    .from("landing_pages")
    .select("id, slug")
    .order("slug");

  if (error) {
    return { error: error.message };
  }
  return data ?? [];
}

export async function getLandingPageBySlug(
  slug: string
): Promise<{ id: string; slug: string; content: Block[] } | { error: string }> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { error: "Não autorizado." };
  }

  const { data, error } = await supabaseServer
    .from("landing_pages")
    .select("id, slug, content")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Página não encontrada." };
  }
  return data as { id: string; slug: string; content: Block[] };
}

export async function createLandingPage(
  slug: string,
  content: Block[]
): Promise<LandingPageActionResult> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { success: false, message: "Não autorizado." };
  }

  if (!slugValid(slug)) {
    return {
      success: false,
      message: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
    };
  }
  if (isReservedSlug(slug)) {
    return {
      success: false,
      message: `O slug "${slug}" é reservado. Escolha outro.`,
    };
  }

  const { data, error } = await supabaseServer
    .from("landing_pages")
    .insert({ slug: slug.trim().toLowerCase(), content })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Já existe uma página com este slug." };
    }
    return { success: false, message: error.message };
  }
  return { success: true, message: "Página criada.", id: data?.id };
}

export async function updateLandingPage(
  id: string,
  slug: string,
  content: Block[]
): Promise<LandingPageActionResult> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { success: false, message: "Não autorizado." };
  }

  if (!slugValid(slug)) {
    return {
      success: false,
      message: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
    };
  }
  if (isReservedSlug(slug)) {
    return {
      success: false,
      message: `O slug "${slug}" é reservado. Escolha outro.`,
    };
  }

  const { error } = await supabaseServer
    .from("landing_pages")
    .update({ slug: slug.trim().toLowerCase(), content })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Já existe outra página com este slug." };
    }
    return { success: false, message: error.message };
  }
  return { success: true, message: "Página atualizada." };
}

export async function deleteLandingPage(id: string): Promise<LandingPageActionResult> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { success: false, message: "Não autorizado." };
  }

  const { error } = await supabaseServer.from("landing_pages").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Página excluída." };
}
