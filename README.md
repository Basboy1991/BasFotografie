# Bas Fotografie

Fotografieportfolio, afspraken, visuele website-editor en beveiligde klantalbums. Dit is de gemigreerde Sites-website, gebouwd met Next.js voor GitHub/Vercel.

## Benodigde inrichting

- Vercel-project: `bas-fotografie` in team `bas-projects-68858507`.
- Framework: **Next.js**. Installatie: `npm ci`. Build: `npm run build`. Laat Output Directory leeg.
- Koppel via **Storage → Create Database** een **Neon Postgres**-database. Dit levert `DATABASE_URL`. Gebruik een aparte database voor Preview.
- Koppel via **Storage → Create Storage → Blob** een **Private** Blob-store. Gebruik geen openbare store voor klantfoto’s. De SDK gebruikt `BLOB_STORE_ID` en Vercel OIDC. Buiten Vercel gebruik je een server-only `BLOB_READ_WRITE_TOKEN`.
- Voeg `ADMIN_PASSWORD_HASH` en `SESSION_SECRET` toe als geheime Vercel-variabelen. `SESSION_SECRET` moet een afzonderlijke willekeurige waarde van minimaal 32 tekens zijn. Stel deze rechtstreeks in Vercel in, niet in GitHub en niet in chat.
- Stel `SITE_URL` in op je uiteindelijke site-origin, standaard `https://bas-fotografie.vercel.app`.

Maak een wachtwoordhash met `npm run auth:password`. Het wachtwoord wordt verborgen ingevoerd; alleen de hash wordt weergegeven. Gebruik minimaal 12 tekens. Een nieuwe hash maakt bestaande beheersessies ongeldig.

## Bestaande export importeren

Pak de ZIP uit **buiten de repository**. De map `backup` bevat persoonlijke gegevens en hoort nooit in een openbare GitHub-repository.

Maak lokaal een genegeerd `.env.local` met de ontwikkel-/importtoegang voor de gekozen database en privéopslag. Deel deze waarden niet in chat. Voer uit:

```sh
npm ci
npm run db:import -- /absoluut/pad/naar/uitgepakte-export
```

De import maakt het Postgres-schema, zet de gegevens transactioneel over, koppelt beheer aan de nieuwe login en uploadt alleen foto’s die niet al zijn meegeleverd. De acht meegeleverde portfoliofoto’s staan onder `public/portfolio-eigen`. Foto’s in privé-klantalbums blijven privé. Albumlink- en wachtwoordhashes blijven behouden; sessiecookies moeten opnieuw worden aangemaakt door in te loggen.

De import gebruikt upserts en kan opnieuw worden uitgevoerd, maar een oude export kan daarmee recentere wijzigingen overschrijven. Gebruik de export alleen tijdens de migratie naar een nieuw doel.

## Lokaal uitvoeren en controleren

```sh
npm run check
npm test
npm run build
npm run dev
```

Beheer: `/beheer/login`. Klanten blijven hun eigen albumlink en albumwachtwoord gebruiken. Aanvragen worden opgeslagen in Postgres; automatische e-mailverzending is nog niet gekoppeld. E-mailvoorbeelden zijn behouden.

## Publiceren

Pas nadat de opslag, login en import gereed zijn: koppel dit GitHub-project in Vercel, controleer de Preview (portfolio, aanvraag, login, upload, klantalbum en ZIP-export) en publiceer dezelfde commit naar Production. Vercel bouwt volgende wijzigingen automatisch vanaf `main`.

De oude repositoryversie is bewaard op `backup-before-sites-migration-20261012`. De huidige Sites-publicatie wordt door deze repository niet aangepast.

## Privacy en beveiliging

De repository bevat alleen broncode en openbare portfoliofoto’s, geen aanvraaggegevens, klantfoto’s, wachtwoorden, tokens of actieve sessies. Beheer gebruikt versleutelde, tijdelijke HTTP-only sessiecookies en databasegestuurde beperking van inlogpogingen. Alle beheeracties controleren de eigenaar op de server. Foto-uploads vereisen een tijdelijk uploadrecht voor één specifiek bestand in privéopslag. Het ZIP-exportbestand bevat wel privégegevens; bewaar dat bestand privé.
