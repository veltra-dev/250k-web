"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listLandingPages } from "@/actions/landing-pages";

export function AdminListContent() {
  const [pages, setPages] = useState<{ id: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listLandingPages().then((result) => {
      if (Array.isArray(result)) {
        setPages(result);
        setError(null);
      } else {
        setError(result?.error ?? "Erro ao carregar.");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (pages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma landing page ainda.{" "}
        <Link href="/admin/builder" className="text-primary hover:underline">
          Criar a primeira
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {pages.map((p) => (
        <li key={p.id}>
          <Link
            href={`/admin/builder?slug=${encodeURIComponent(p.slug)}`}
            className="text-primary hover:underline"
          >
            /{p.slug}
          </Link>
        </li>
      ))}
    </ul>
  );
}
