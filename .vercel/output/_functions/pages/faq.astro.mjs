import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { b as getFaqs, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$Faq = createComponent(async ($$result, $$props, $$slots) => {
  const faqs = await getFaqs();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Veelgestelde vragen", "description": "Veelgestelde vragen over fotoshoots, pakketten, locaties, levering en prijzen bij Bas Fotografie.", "currentPath": "/faq/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">FAQ</p> <h1>Veelgestelde vragen</h1> <p>
Antwoorden op de praktische vragen rond een fotoshoot in Naaldwijk en gemeente Westland.
</p> </section> <section class="section"> <div class="faq-list"> ${faqs.map((item) => renderTemplate`<details> <summary>${item.question}</summary> <p>${item.answer}</p> </details>`)} </div> </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, { "title": "Staat je vraag er niet tussen?", "body": "Stuur Bas gerust een bericht. Dan stemmen jullie het gewoon persoonlijk af." })} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/faq.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
