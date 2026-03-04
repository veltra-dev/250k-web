"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  className?: string;
}

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | "ellipsis")[] = [1];
  if (current > 3) result.push("ellipsis");
  const mid = [current - 1, current, current + 1].filter((p) => p > 1 && p < total);
  result.push(...mid);
  if (current < total - 2) result.push("ellipsis");
  if (total > 1) result.push(total);
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/blog",
  className,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  function href(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
      return params.toString() ? `${basePath}?${params}` : basePath;
    }
    params.set("page", String(page));
    return `${basePath}?${params}`;
  }

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Paginação do blog"
    >
      <Button
        asChild
        variant="outline"
        size="sm"
        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
      >
        <Link
          href={currentPage <= 1 ? "#" : href(currentPage - 1)}
          aria-label="Página anterior"
        >
          Anterior
        </Link>
      </Button>
      <ul className="flex items-center gap-1">
        {pageNumbers.map((item, i) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${i}`} className="px-2 text-muted-foreground" aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <Button
                asChild
                variant={currentPage === item ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-8 w-8 min-w-8",
                  currentPage === item && "pointer-events-none"
                )}
              >
                <Link
                  href={href(item)}
                  aria-label={`Página ${item}`}
                  aria-current={currentPage === item ? "page" : undefined}
                >
                  {item}
                </Link>
              </Button>
            </li>
          )
        )}
      </ul>
      <Button
        asChild
        variant="outline"
        size="sm"
        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
      >
        <Link
          href={currentPage >= totalPages ? "#" : href(currentPage + 1)}
          aria-label="Próxima página"
        >
          Próxima
        </Link>
      </Button>
    </nav>
  );
}
