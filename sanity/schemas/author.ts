import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "Breve biografia do autor (pt-BR).",
    }),
  ],
  preview: {
    select: { name: "name", media: "image" },
    prepare({ name, media }) {
      return {
        title: name ?? "Autor",
        media,
      };
    },
  },
});
