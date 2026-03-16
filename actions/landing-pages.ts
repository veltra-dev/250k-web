"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { supabaseServer } from "@/lib/supabase/server";
import type { Block } from "@/lib/landing-pages/types";
import { isReservedSlug } from "@/lib/landing-pages/types";

export type LandingPageActionResult =
  | { success: true; message?: string; id?: string }
  | { success: false; message: string };

export type LandingPageListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  starts_at: string | null;
  ends_at: string | null;
};

export type LandingPageGetResult = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: Block[];
  starts_at: string | null;
  ends_at: string | null;
};

function slugValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 1 && slug.length <= 100;
}

/** Check if another row has this slug and is "active" (not deleted, not expired). */
async function hasActiveSlugConflict(
  slug: string,
  excludeId: string | null
): Promise<boolean> {
  const nowIso = new Date().toISOString();
  let query = supabaseServer
    .from("landing_pages")
    .select("id")
    .eq("slug", slug.trim().toLowerCase())
    .is("deleted_at", null)
    .or(`ends_at.is.null,ends_at.gt.${nowIso}`);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query.limit(1);
  if (error) return true; // treat error as conflict to be safe
  return (data?.length ?? 0) > 0;
}

export async function listLandingPages(): Promise<
  LandingPageListItem[] | { error: string }
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
    .select("id, slug, title, description, starts_at, ends_at")
    .is("deleted_at", null)
    .order("slug");

  if (error) {
    return { error: error.message };
  }
  return (data ?? []) as LandingPageListItem[];
}

export async function getLandingPageBySlug(
  slug: string
): Promise<LandingPageGetResult | { error: string }> {
  const auth = await createServerSupabaseClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) {
    return { error: "Não autorizado." };
  }

  const { data, error } = await supabaseServer
    .from("landing_pages")
    .select("id, slug, title, description, content, starts_at, ends_at")
    .eq("slug", slug)
    .is("deleted_at", null)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { error: error?.message ?? "Página não encontrada." };
  }
  return data as LandingPageGetResult;
}

export async function createLandingPage(
  slug: string,
  title: string,
  description: string,
  content: Block[],
  starts_at?: string | null,
  ends_at?: string | null
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

  const hasConflict = await hasActiveSlugConflict(slug.trim().toLowerCase(), null);
  if (hasConflict) {
    return { success: false, message: "Já existe uma página ativa com este slug." };
  }

  const payload = {
    slug: slug.trim().toLowerCase(),
    title: title.trim() || "",
    description: description.trim() || "",
    content,
    starts_at: starts_at || null,
    ends_at: ends_at || null,
  };

  const { data, error } = await supabaseServer
    .from("landing_pages")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Página criada.", id: data?.id };
}

export async function updateLandingPage(
  id: string,
  slug: string,
  title: string,
  description: string,
  content: Block[],
  starts_at?: string | null,
  ends_at?: string | null
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

  const hasConflict = await hasActiveSlugConflict(slug.trim().toLowerCase(), id);
  if (hasConflict) {
    return { success: false, message: "Já existe outra página ativa com este slug." };
  }

  const { error } = await supabaseServer
    .from("landing_pages")
    .update({
      slug: slug.trim().toLowerCase(),
      title: title.trim() || "",
      description: description.trim() || "",
      content,
      starts_at: starts_at ?? null,
      ends_at: ends_at ?? null,
    })
    .eq("id", id);

  if (error) {
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

  const { error } = await supabaseServer
    .from("landing_pages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Página excluída." };
}
