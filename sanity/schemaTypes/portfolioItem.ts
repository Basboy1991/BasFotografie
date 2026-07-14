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
        list: [
          "Kinderen",
          "Gezinnen",
          "Huisdieren",
          "Portretten",
          { title: "Privéarchief", value: "Privearchief" },
        ],
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
      name: "description",
      title: "Beschrijving bij de foto",
      type: "text",
      rows: 4,
      description: "Korte tekst die naast de foto verschijnt in de portfolio-detailweergave.",
    }),
    defineField({
      name: "layoutSize",
      title: "Layoutgrootte",
      type: "string",
      options: {
        list: [
          { title: "Standaard", value: "standaard" },
          { title: "Groot / uitgelicht", value: "groot" },
        ],
        layout: "radio",
      },
      initialValue: "standaard",
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
