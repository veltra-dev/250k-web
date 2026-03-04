import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { sanityClient } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@/components/blog/portable-text";
import type { Post } from "@/lib/sanity/types";
import { IconArticle, IconArrowLeft } from "@tabler/icons-react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://250k.com.br";

async function getPost(slug: string): Promise<Post | null> {
  const post = await sanityClient.fetch<Post | null>(POST_BY_SLUG_QUERY, {
    slug,
  });
  return post;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post não encontrado" };
  }
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt ?? undefined;
  const ogImage = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
      publishedTime: post.publishedAt,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : undefined,
      url: `${BASE_URL}/blog/${post.slug.current}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.coverImage
      ? urlFor(post.coverImage).width(1200).url()
      : undefined,
    datePublished: post.publishedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "250k",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/apple-icon.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section variant="narrow" className="pb-16">
        <article>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <IconArrowLeft className="size-4" stroke={1.5} />
            Voltar ao blog
          </Link>
          <header className="mb-8">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted mb-6">
              {post.coverImage ? (
                <>
                  <Image
                    src={urlFor(post.coverImage).width(900).height(506).url()}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 900px) 100vw, 900px"
                  />
                  {/* Bottom fade: inline style used so the gradient always applies (Tailwind bg-linear-* can be overridden or not generated in this setup) */}
                  <div
                    className="absolute inset-0 z-1 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 20%, transparent 50%)",
                    }}
                    aria-hidden
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted via-muted to-accent/20"
                  aria-hidden
                >
                  <div className="rounded-xl bg-white/40 backdrop-blur-sm p-5">
                    <IconArticle
                      className="size-12 text-muted-foreground/80"
                      stroke={1.5}
                    />
                  </div>
                </div>
              )}
              {!post.coverImage && (
                <div
                  className="absolute inset-0 z-1 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 20%, transparent 50%)",
                  }}
                  aria-hidden
                />
              )}
              <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {post.category && (
                    <Link
                      href={`/blog?category=${post.category.slug.current}`}
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-white transition-colors z-20"
                      style={{
                        backgroundColor: "#b14f32",
                      }}
                    >
                      {post.category.title}
                    </Link>
                  )}
                  <time
                    dateTime={post.publishedAt}
                    className="text-white text-xs font-medium drop-shadow-sm"
                  >
                    Publicado em {formatDate(post.publishedAt)}
                  </time>
                </div>
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.image && (
                      <span
                        className="relative shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-black/20 bg-white/10"
                        style={{ width: 16, height: 16 }}
                      >
                        <Image
                          src={urlFor(post.author.image)
                            .width(80)
                            .height(80)
                            .url()}
                          alt={`Avatar de ${post.author.name}`}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </span>
                    )}
                    <span className="text-xs text-white font-medium drop-shadow-sm">
                      Por {post.author.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-primary md:text-4xl leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>
          <div className="mt-8">
            <PortableText value={post.body ?? undefined} />
          </div>
        </article>
      </Section>
    </>
  );
}
