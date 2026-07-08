import { defineField, defineType } from "sanity";

export const portfolioItemType = defineType({
  name: "portfolioItem",
  title: "Portfolio item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: {
        list: ["Kinderen", "Gezinnen", "Huisdieren", "Portretten"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt-tekst",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Kleine labeltekst",
      type: "string",
      initialValue: "Goedgekeurde foto",
    }),
    defineField({
      name: "published",
      title: "Publiceren",
      type: "boolean",
      initialValue: false,
      description: "Zet pas aan als publicatie expliciet is goedgekeurd.",
    }),
    defineField({
      name: "order",
      title: "Volgorde",
      type: "number",
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
});
