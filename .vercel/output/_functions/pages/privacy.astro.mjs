import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { g as getSiteSettings, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
export { renderers } from '../renderers.mjs';

const $$Privacy = createComponent(async ($$result, $$props, $$slots) => {
  const site = await getSiteSettings();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy", "description": "Privacyverklaring voor aanvragen via Bas Fotografie.", "currentPath": "/privacy/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">Privacy</p> <h1>Privacyverklaring</h1> <p>
Bas Fotografie verwerkt alleen gegevens die nodig zijn om je aanvraag te beantwoorden en een eventuele shoot te organiseren.
</p> </section> <section class="legal-section"> <h2>Welke gegevens worden verwerkt?</h2> <p>
Bij een aanvraag worden je naam, e-mailadres, telefoonnummer, voorkeuren voor de shoot, locatie, datum en bericht verwerkt.
</p> <h2>Waarvoor worden deze gegevens gebruikt?</h2> <p>
De gegevens worden gebruikt om contact met je op te nemen, de shoot af te stemmen en afspraken vast te leggen.
</p> <h2>Formulier en hosting</h2> <p>
Het aanvraagformulier is voorbereid voor Netlify Forms. De verwerking via Netlify wordt actief zodra de site daar wordt gepubliceerd.
</p> <h2>Foto's en toestemming</h2> <p>
Foto's van herkenbare personen, kinderen en gezinnen worden niet als portfolio gepubliceerd zonder expliciete toestemming.
</p> <h2>Contact</h2> <p>
Voor vragen over privacy kun je mailen naar <a${addAttribute(`mailto:${site.email}`, "href")}>${site.email}</a>.
</p> </section> ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/privacy.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
