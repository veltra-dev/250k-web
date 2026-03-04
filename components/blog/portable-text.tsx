"use client";

import { PortableText as BasePortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

const blockComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-8 mb-4 text-xl font-bold text-primary md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-6 mb-3 text-lg font-bold text-primary md:text-xl">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-4 border-l-4 border-brand-orange pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref?: string }; caption?: string } & SanityImage;
    }) => {
      if (!value?.asset?._ref) return null;
      const imageUrl = urlFor(value as SanityImage).width(800).url();
      return (
        <figure className="my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={imageUrl}
              alt={value.caption ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:no-underline"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextProps {
  value: PortableTextBlock[] | null | undefined;
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <BasePortableText value={value} components={blockComponents} />
    </div>
  );
}
