import { defineField, defineType } from "sanity";

export const portfolioItemType = defineType({
  name: "portfolioItem",
  title: "Portfoliofoto",
  type: "document",
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "display", title: "Weergave" },
    { name: "publication", title: "Publicatie" },
  ],
  initialValue: {
    layoutSize: "standaard",
    published: false,
    order: 10,
    note: "Goedgekeurde foto",
  },
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Kinderen", value: "Kinderen" },
          { title: "Gezinnen", value: "Gezinnen" },
          { title: "Huisdieren", value: "Huisdieren" },
          { title: "Portretten", value: "Portretten" },
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
      group: "content",
      options: { hotspot: true },
      description: "Gebruik bij voorkeur het originele bestand in hoge resolutie.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt-tekst",
      type: "string",
      group: "content",
      description: "Beschrijf kort wat er op de foto te zien is, voor toegankelijkheid en SEO.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "note",
      title: "Kleine labeltekst",
      type: "string",
      group: "content",
      initialValue: "Goedgekeurde foto",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "description",
      title: "Beschrijving bij de foto",
      type: "text",
      group: "content",
      rows: 4,
      description: "Korte tekst die naast de foto verschijnt in de portfolio-detailweergave.",
      validation: (rule) => rule.required().min(10).max(500),
    }),
    defineField({
      name: "layoutSize",
      title: "Layoutgrootte",
      type: "string",
      group: "display",
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
      title: "Tonen op de website",
      type: "boolean",
      group: "publication",
      initialValue: false,
      description: "Alleen ingeschakelde foto's met een afbeelding verschijnen op de website.",
    }),
    defineField({
      name: "order",
      title: "Volgorde",
      type: "number",
      group: "display",
      initialValue: 10,
      description: "Lagere nummers verschijnen eerder binnen het album.",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
      published: "published",
      order: "order",
    },
    prepare({ title, subtitle, media, published, order }) {
      return {
        title,
        subtitle: `${published ? "Online" : "Niet online"} · ${subtitle ?? "Geen categorie"} · volgorde ${order ?? 10}`,
        media,
      };
    },
  },
});
