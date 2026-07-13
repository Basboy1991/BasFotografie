import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { g as getSiteSettings, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$SectionIntro } from '../chunks/SectionIntro_DP5VD0KQ.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$OverBas = createComponent(async ($$result, $$props, $$slots) => {
  const site = await getSiteSettings();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Over Bas", "description": "Maak kennis met Bas van der Scheer, fotograaf achter Bas Fotografie in Naaldwijk en gemeente Westland.", "currentPath": "/over-bas/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="about-hero"> <div> <p class="eyebrow">Over Bas</p> <h1>Een rustige blik achter de camera</h1> <p>${site.profileIntro}</p> </div> <figure> <img${addAttribute(site.profileImage, "src")}${addAttribute(`Portret van ${site.person}`, "alt")}> <figcaption>${site.profileImageCaption}</figcaption> </figure> </section> <section class="split-section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Manier van werken", "title": "Mooi portret, zonder harde pose", "body": site.profileBody })} <div class="feature-list"> <article> <h3>Voorzichtig met privacy</h3> <p>Beelden van kinderen en gezinnen komen alleen online wanneer ze expliciet zijn goedgekeurd.</p> </article> <article> <h3>Lokaal in het Westland</h3> <p>Bekend met Naaldwijk en omliggende plekken waar licht, rust en ruimte samenkomen.</p> </article> <article> <h3>Persoonlijk contact</h3> <p>Geen anonieme boekingsstraat, maar direct contact via formulier, mail of WhatsApp.</p> </article> </div> </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, { "title": `Neem contact op met ${site.person}`, "body": "Stuur je idee door, ook als je nog twijfelt over pakket, locatie of timing." })} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/over-bas.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/over-bas.astro";
const $$url = "/over-bas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OverBas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
