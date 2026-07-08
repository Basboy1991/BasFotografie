import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site instellingen",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Merknaam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "person",
      title: "Naam fotograaf",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Hoofdbelofte",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "SEO omschrijving",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "region",
      title: "Werkgebied",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-mailadres",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phoneDisplay",
      title: "Telefoonnummer",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Standaard WhatsApp-bericht",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero label",
      type: "string",
    }),
    defineField({
      name: "heroBody",
      title: "Hero tekst",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "profileIntro",
      title: "Over Bas intro",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "profileBody",
      title: "Over Bas werkwijze",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "profileImage",
      title: "Profielfoto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "profileImageCaption",
      title: "Bijschrift profielfoto",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "region",
    },
  },
});
