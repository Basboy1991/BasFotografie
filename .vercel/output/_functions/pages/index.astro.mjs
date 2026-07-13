import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { g as getSiteSettings, c as getProcessSteps, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$PortfolioGrid } from '../chunks/PortfolioGrid_DYW2VTd_.mjs';
import { $ as $$PackageCards } from '../chunks/PackageCards_Dl4X2oQe.mjs';
import { $ as $$SectionIntro } from '../chunks/SectionIntro_DP5VD0KQ.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const site = await getSiteSettings();
  const processSteps = await getProcessSteps();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Fotograaf Naaldwijk en Westland", "description": "Bas Fotografie maakt pure portretten van kinderen, gezinnen en huisdieren op locatie in Naaldwijk en gemeente Westland." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero"> <div class="hero-copy"> <p class="eyebrow">${site.heroEyebrow}</p> <h1>${site.tagline}</h1> <p>${site.heroBody}</p> <div class="hero-actions"> <a class="button" href="/contact/">Plan een shoot</a> <a class="button button-secondary" href="/portfolio/">Bekijk portfolio</a> </div> </div> <div class="hero-table" aria-label="Selectietafel met portfolio placeholders"> <figure class="hero-photo hero-photo-main"> <img src="/assets/portfolio/kinderen-01.webp" alt="Privacy-veilige placeholder voor kinderportret"> <figcaption>Kinderen</figcaption> </figure> <figure class="hero-photo hero-photo-side"> <img src="/assets/portfolio/huisdieren-01.webp" alt="Privacy-veilige placeholder voor huisdierportret"> <figcaption>Huisdieren</figcaption> </figure> <figure class="hero-photo hero-photo-small"> <img src="/assets/portfolio/portretten-01.webp" alt="Privacy-veilige placeholder voor portret"> <figcaption>Portretten</figcaption> </figure> </div> </section> <section class="split-section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Waarom Bas", "title": "Portretten zonder toneelstuk", "body": "De stijl is rustig, helder en persoonlijk: wel mooi gecomponeerd, zonder dat iedereen strak hoeft te poseren." })} <div class="feature-list"> <article> <h3>Op locatie</h3> <p>In Naaldwijk, het Westland of een plek die voor jullie logisch voelt.</p> </article> <article> <h3>Voor kinderen, gezinnen en dieren</h3> <p>Met ruimte voor beweging, pauzes en kleine momenten tussendoor.</p> </article> <article> <h3>Digitale galerij</h3> <p>Je ontvangt een verzorgde selectie bewerkte foto's in een online galerij.</p> </article> </div> </section> <section class="section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Selectietafel", "title": "Een eerste indruk van de beeldrichting", "body": "De huidige beelden zijn bewust privacy-veilige placeholders. Voor livegang komt hier alleen een goedgekeurde fotoset." })} ${renderComponent($$result2, "PortfolioGrid", $$PortfolioGrid, { "limit": 8 })} <div class="center-action"> <a class="button button-secondary" href="/portfolio/">Bekijk alle categorieën</a> </div> </section> <section class="section section-muted"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Pakketten", "title": "Duidelijke keuzes voor jouw shoot", "body": "Kies klein en gericht, of neem meer tijd voor een complete serie." })} ${renderComponent($$result2, "PackageCards", $$PackageCards, {})} </section> <section class="section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Werkwijze", "title": "Van aanvraag naar galerij", "body": "Een shoot moet overzichtelijk voelen, ook als kinderen of dieren hun eigen tempo hebben." })} <div class="process-grid"> ${processSteps.map((step) => renderTemplate`<article> <h3>${step.title}</h3> <p>${step.body}</p> </article>`)} </div> </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, {})} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/index.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
