"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconDeviceFloppy,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface BuilderFixedFooterProps {
  slug: string;
  currentId: string | null;
  onSave: () => void;
  onDelete: () => void;
  saving?: boolean;
  deleting?: boolean;
  loading?: boolean;
  /** Use for full-width border: mobile "-mx-6 sm:-mx-12 px-6 sm:px-12", desktop "-mr-12 pr-12" */
  className?: string;
}

export function BuilderFixedFooter({
  slug,
  currentId,
  onSave,
  onDelete,
  saving = false,
  deleting = false,
  loading = false,
  className,
}: BuilderFixedFooterProps) {
  const saveDisabled = loading || saving;
  const deleteDisabled = loading || deleting || !currentId;

  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border bg-background pt-3 pb-2",
        className,
      )}
    >
      <div className="w-full flex items-center justify-between gap-2">
        <Button
          type="button"
          size="icon-lg"
          variant="destructive"
          onClick={onDelete}
          disabled={deleteDisabled}
          title={deleting ? "Excluindo…" : "Excluir página"}
          aria-label={deleting ? "Excluindo…" : "Excluir página"}
        >
          <IconTrash />
        </Button>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={onSave} disabled={saveDisabled} size="lg">
            <IconDeviceFloppy />
            {saving ? "Salvando…" : "Salvar"}
          </Button>
          {loading || !slug.trim() ? (
            <Button variant="outline" disabled size="lg">
              <IconExternalLink />
              Ver página
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg">
              <Link href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                <IconExternalLink />
                Ver página
              </Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
