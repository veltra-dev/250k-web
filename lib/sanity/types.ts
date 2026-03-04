import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { height: number; width: number; x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: string;
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: SanitySlug;
}

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  coverImage?: SanityImage;
  publishedAt: string;
  author?: Author | null;
  category?: Category | null;
  body?: PortableTextBlock[];
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: SanityImage;
  publishedAt: string;
  author?: { name: string; image?: SanityImage } | null;
  category?: { title: string; slug: { current: string } } | null;
  featured?: boolean;
}

export interface PostSlugItem {
  slug: { current: string };
  publishedAt: string;
}
