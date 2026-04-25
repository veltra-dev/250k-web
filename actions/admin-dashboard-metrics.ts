"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { sanityClient } from "@/lib/sanity/client";
import { POST_PUBLISHED_DATES_QUERY } from "@/lib/sanity/queries";

export type DashboardDayPoint = {
  date: string;
  label: string;
  leads: number;
};

export type DashboardMonthPoint = {
  monthKey: string;
  label: string;
  posts: number;
};

function lastNDayKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function dayLabel(isoDate: string): string {
  const [y, m, day] = isoDate.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

function monthKeyFromDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabelFromKey(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function getAdminDashboardMetrics(): Promise<{
  leadsByDay: DashboardDayPoint[];
  blogPostsByMonth: DashboardMonthPoint[];
}> {
  const dayKeys = lastNDayKeys(30);
  const leadCounts = new Map<string, number>(dayKeys.map((k) => [k, 0]));

  try {
    const since = `${dayKeys[0]}T00:00:00.000Z`;
    const { data, error } = await supabaseServer
      .from("leads")
      .select("created_at")
      .gte("created_at", since);
    if (!error && data) {
      for (const row of data) {
        const key = new Date(row.created_at as string).toISOString().slice(0, 10);
        if (leadCounts.has(key)) {
          leadCounts.set(key, (leadCounts.get(key) ?? 0) + 1);
        }
      }
    }
  } catch {
  }

  const leadsByDay = dayKeys.map((date) => ({
    date,
    label: dayLabel(date),
    leads: leadCounts.get(date) ?? 0,
  }));

  const now = new Date();
  const monthKeysOrdered: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    monthKeysOrdered.push(monthKeyFromDate(d));
  }
  const postCounts = new Map<string, number>(
    monthKeysOrdered.map((k) => [k, 0]),
  );

  try {
    const rows = await sanityClient.fetch<{ publishedAt: string }[]>(
      POST_PUBLISHED_DATES_QUERY,
    );
    if (Array.isArray(rows)) {
      for (const r of rows) {
        if (!r.publishedAt) continue;
        const key = monthKeyFromDate(new Date(r.publishedAt));
        if (postCounts.has(key)) {
          postCounts.set(key, (postCounts.get(key) ?? 0) + 1);
        }
      }
    }
  } catch {
   
  }

  const blogPostsByMonth = monthKeysOrdered.map((monthKey) => ({
    monthKey,
    label: monthLabelFromKey(monthKey),
    posts: postCounts.get(monthKey) ?? 0,
  }));

  return { leadsByDay, blogPostsByMonth };
}
