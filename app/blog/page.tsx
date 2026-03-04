import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/ui/pagination";
import { sanityClient } from "@/lib/sanity/client";
import { POSTS_LIST_QUERY, POSTS_COUNT_QUERY } from "@/lib/sanity/queries";
import type { PostListItem } from "@/lib/sanity/types";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos e notícias sobre consultoria agrícola e agronegócio.",
};

async function getPosts(page: number): Promise<{ posts: PostListItem[]; total: number }> {
  const offset = (page - 1) * PAGE_SIZE;
  const [posts, total] = await Promise.all([
    sanityClient.fetch<PostListItem[]>(POSTS_LIST_QUERY, {
      offset,
      limit: offset + PAGE_SIZE,
    }),
    sanityClient.fetch<number>(POSTS_COUNT_QUERY),
  ]);
  return { posts, total };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const { posts, total } = await getPosts(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Section
      title="Blog"
      subtitle="Artigos e notícias sobre consultoria agrícola e agronegócio"
      variant="wide"
    >
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Nenhum post encontrado.
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/blog"
              />
            </div>
          )}
        </>
      )}
    </Section>
  );
}
