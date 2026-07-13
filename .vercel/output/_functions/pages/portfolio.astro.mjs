import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$PortfolioGrid } from '../chunks/PortfolioGrid_DYW2VTd_.mjs';
import { $ as $$SectionIntro } from '../chunks/SectionIntro_DP5VD0KQ.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$Portfolio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Portfolio", "description": "Portfolio van Bas Fotografie: kinderfotografie, gezinsfotografie, huisdierfotografie en portretten in Naaldwijk en Westland.", "currentPath": "/portfolio/" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">Portfolio</p> <h1>Selectietafel voor kinderen, gezinnen, huisdieren en portretten</h1> <p>
De site gebruikt nu privacy-veilige placeholders. Zodra de definitieve selectie is goedgekeurd, worden deze vervangen door echte portfoliofoto's.
</p> </section> <section class="section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "title": "Filter op shootsoort", "body": "Kies de categorie die het dichtst bij jouw aanvraag ligt." })} ${renderComponent($$result2, "PortfolioGrid", $$PortfolioGrid, { "interactive": true })} </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, { "title": "Wil je zelf op deze selectietafel komen?", "body": "Vraag een shoot aan en vertel wat je wilt vastleggen." })} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/portfolio.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/portfolio.astro";
const $$url = "/portfolio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Portfolio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
