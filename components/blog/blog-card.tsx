import Link from "next/link";
import Image from "next/image";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { PostListItem } from "@/lib/sanity/types";
import { IconArticle } from "@tabler/icons-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: PostListItem }) {
  const slug = post.slug.current;
  const href = `/blog/${slug}`;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {post.coverImage ? (
          <>
            <Image
              src={urlFor(post.coverImage).width(600).height(375).url()}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted via-muted to-accent/20"
            aria-hidden
          >
            <div className="rounded-xl bg-white/40 backdrop-blur-sm p-4">
              <IconArticle
                className="size-10 text-muted-foreground/80"
                stroke={1.5}
              />
            </div>
          </div>
        )}
      </div>
      <CardHeader className="flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {post.category && (
            <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              {post.category.title}
            </span>
          )}
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <CardTitle className="line-clamp-2 mt-1">
          <Link href={href} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {post.excerpt}
          </p>
        )}
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-border border-t pt-4">
        {post.author && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.author.image && (
              <span className="relative inline-block size-6 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={urlFor(post.author.image).width(48).height(48).url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </span>
            )}
            Por {post.author.name}
          </span>
        )}
        <Button asChild variant="ghost" size="sm">
          <Link href={href} className="inline-flex items-center gap-1">
            Ler mais
            <span aria-hidden>→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
