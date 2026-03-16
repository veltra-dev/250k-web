"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  listLandingPages,
  deleteLandingPage,
  type LandingPageListItem,
} from "@/actions/landing-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  IconSearch,
  IconTrash,
  IconCalendarEvent,
  IconCalendarDue,
  IconFileOff,
  IconPencil,
  IconExternalLink,
  IconFileText,
  IconPlus,
} from "@tabler/icons-react";

const DESCRIPTION_MAX = 80;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.250k.com.br";

type PageStatus = "active" | "expired" | "scheduled";

function getPageStatus(p: {
  starts_at: string | null;
  ends_at: string | null;
}): PageStatus {
  const now = new Date();
  if (p.ends_at && new Date(p.ends_at) < now) return "expired";
  if (p.starts_at && new Date(p.starts_at) > now) return "scheduled";
  return "active";
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function LandingPageCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-8 w-11" />
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <IconFileOff className="size-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Nenhuma landing page</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Crie sua primeira landing page para começar a publicar conteúdo
        programável.
      </p>
      <Button asChild className="mt-6">
        <Link href="/admin/builder">Criar landing page</Link>
      </Button>
    </div>
  );
}

export function AdminListContent() {
  const [pages, setPages] = useState<LandingPageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listLandingPages().then((result) => {
      if (Array.isArray(result)) {
        setPages(result);
        setError(null);
      } else {
        const msg = result?.error ?? "Erro ao carregar.";
        setError(msg);
        toast.error(msg);
      }
      setLoading(false);
    });
  }, []);

  const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    const q = search.trim().toLowerCase();
    return pages.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [pages, search]);

  async function handleDelete(id: string) {
    setDeleting(true);
    const result = await deleteLandingPage(id);
    setDeleting(false);
    if (result.success) {
      setPages((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
      toast.success("Página excluída.");
    } else {
      setError(result.message);
      toast.error(result.message ?? "Erro ao excluir.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LandingPageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título, slug ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar landing pages"
          />
        </div>
        <Button asChild>
          <Link href="/admin/builder">
            <IconPlus className="size-4" />
            Nova página
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState />
      ) : filteredPages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum resultado para &quot;{search}&quot;.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setSearch("")}
          >
            Limpar busca
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPages.map((p) => {
            const status = getPageStatus(p);
            return (
              <Card
                key={p.id}
                className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 truncate text-base">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <IconFileText className="size-4" />
                        </span>
                        <span className="truncate text-primary">
                          {p.title || `/${p.slug}`}
                        </span>
                      </CardTitle>
                      <Badge
                        variant={
                          status === "expired"
                            ? "destructive"
                            : status === "scheduled"
                              ? "outline"
                              : "default"
                        }
                        className="shrink-0"
                      >
                        {status === "active"
                          ? "Ativa"
                          : status === "scheduled"
                            ? "Agendada"
                            : "Expirada"}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">
                      <a
                        href={`${BASE_URL}/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 truncate text-muted-foreground hover:text-foreground hover:underline"
                      >
                        <span className="truncate">
                          {BASE_URL}/{p.slug}
                        </span>
                        <IconExternalLink className="size-3 shrink-0" />
                      </a>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {p.description ? (
                    <p className="line-clamp-2 text-sm text-secondary-foreground">
                      {p.description.length > DESCRIPTION_MAX
                        ? `${p.description.slice(0, DESCRIPTION_MAX)}…`
                        : p.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Sem descrição
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-foreground">
                    <span className="flex items-center gap-1">
                      <IconCalendarEvent className="size-3.5 shrink-0" />
                      Início: {formatDateTime(p.starts_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendarDue className="size-3.5 shrink-0" />
                      Fim: {formatDateTime(p.ends_at)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <AlertDialog
                    open={deleteId === p.id}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(p.id)}
                    >
                      <IconTrash />
                    </Button>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir landing page?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          &quot;{p.title || p.slug}&quot; será excluída. Esta
                          ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(p.id);
                          }}
                          variant="destructive"
                          disabled={deleting}
                        >
                          {deleting ? "Excluindo…" : "Excluir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/builder?slug=${encodeURIComponent(p.slug)}`}
                      className="flex-1"
                    >
                      <IconPencil />
                      Editar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
