const POSTS_LIST_PROJECTION = `{
  _id,
  title,
  "slug": slug,
  excerpt,
  coverImage,
  publishedAt,
  "author": author->{ name, image },
  "category": category->{ title, "slug": slug },
  featured
}`;

export const POSTS_LIST_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$offset...$limit] ${POSTS_LIST_PROJECTION}`;

export const POSTS_COUNT_QUERY = `count(*[_type == "post" && defined(slug.current)])`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug,
  excerpt,
  coverImage,
  publishedAt,
  "author": author->{ _id, name, "slug": slug, image, bio },
  "category": category->{ _id, title, "slug": slug },
  body,
  metaTitle,
  metaDescription
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)] {
  "slug": slug,
  publishedAt
}`;
