# Bas Fotografie CMS

Deze site gebruikt Sanity als CMS, met lokale fallback-content zolang er geen Sanity project is ingesteld.

## Actieve setup

- Project: `bas-fotografie`
- Project ID: `k2m6gkis`
- Dataset: `production`
- Studio: https://bas-fotografie-cms.sanity.studio/
- Vercel snelkoppeling: https://bas-fotografie.vercel.app/studio

## Eenmalige setup

1. Maak een Sanity project aan via `npx sanity init` of via sanity.io.
2. Vul `.env` op basis van `.env.example`:

```bash
PUBLIC_SANITY_PROJECT_ID=je-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-07-07

SANITY_STUDIO_PROJECT_ID=je-project-id
SANITY_STUDIO_DATASET=production
```

3. Start de Studio lokaal:

```bash
npm run cms
```

4. Importeer de huidige basiscontent in de ingestelde dataset:

```bash
npm run cms:import
```

De import gebruikt `SANITY_STUDIO_DATASET`, daarna `PUBLIC_SANITY_DATASET`, en valt alleen terug op `production` als er geen dataset is ingesteld.

## Vercel variabelen

Zet deze waarden in Vercel voor Production, Preview en Development:

```bash
PUBLIC_SANITY_PROJECT_ID=k2m6gkis
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-07-09
SANITY_STUDIO_PROJECT_ID=k2m6gkis
SANITY_STUDIO_DATASET=production
```

## Wat is bewerkbaar?

- Site instellingen: merknaam, slogan, contactgegevens, regio en profieltekst
- Pakketten: naam, prijs, duur, inhoud, volgorde en uitgelicht pakket
- Portfolio: titel, categorie, afbeelding, alt-tekst, publicatie aan/uit
- Werkwijze: stappen en volgorde
- FAQ: vragen, antwoorden en volgorde

Portfolio-items staan standaard niet gepubliceerd. Zet `Publiceren` pas aan als de foto expliciet is goedgekeurd voor publicatie.

## Publiceren

De Astro-site haalt Sanity-content tijdens `npm run build` op. Op Netlify kun je een Sanity webhook laten triggeren die de site opnieuw bouwt na wijzigingen.
