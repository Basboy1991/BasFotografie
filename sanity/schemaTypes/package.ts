import { defineField, defineType } from "sanity";

export const packageType = defineType({
  name: "package",
  title: "Pakket",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Prijs",
      type: "string",
      description: "Bijvoorbeeld EUR 195.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duur",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Korte omschrijving",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Inbegrepen",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Uitgelicht pakket",
      type: "boolean",
      initialValue: false,
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
      title: "name",
      subtitle: "price",
    },
  },
});
