import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumo",
      type: "text",
      description: "Resumo para listagens e meta description (pt-BR).",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Imagem de capa",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "array",
      of: [{ type: "block" }],
      description: "Conteúdo do post em português.",
    }),
    defineField({
      name: "featured",
      title: "Destaque",
      type: "boolean",
      initialValue: false,
      description: "Marcar para destacar na listagem.",
    }),
    defineField({
      name: "metaTitle",
      title: "Título (SEO)",
      type: "string",
      description: "Título para meta e Open Graph. Se vazio, usa o título do post.",
    }),
    defineField({
      name: "metaDescription",
      title: "Descrição (SEO)",
      type: "text",
      rows: 2,
      description: "Meta description. Se vazio, usa o resumo.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, author, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("pt-BR")
        : "";
      return {
        title: title ?? "Post",
        subtitle: author ? `${author} · ${date}` : date,
        media,
      };
    },
  },
});
