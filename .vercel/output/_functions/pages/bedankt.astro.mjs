import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { g as getSiteSettings, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
export { renderers } from '../renderers.mjs';

const $$Bedankt = createComponent(async ($$result, $$props, $$slots) => {
  const site = await getSiteSettings();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bedankt voor je aanvraag", "description": "Je aanvraag is ontvangen door Bas Fotografie.", "currentPath": "/bedankt/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">Aanvraag ontvangen</p> <h1>Bedankt voor je aanvraag</h1> <p>
Bas neemt persoonlijk contact met je op. Wil je nog iets toevoegen, stuur dan gerust een bericht via WhatsApp of e-mail.
</p> <div class="hero-actions"> <a class="button"${addAttribute(site.whatsappHref, "href")}>WhatsApp Bas</a> <a class="button button-secondary" href="/">Terug naar home</a> </div> </section> ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/bedankt.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/bedankt.astro";
const $$url = "/bedankt";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bedankt,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
