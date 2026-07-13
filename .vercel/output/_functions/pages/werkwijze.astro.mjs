import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { c as getProcessSteps, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$SectionIntro } from '../chunks/SectionIntro_DP5VD0KQ.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$Werkwijze = createComponent(async ($$result, $$props, $$slots) => {
  const processSteps = await getProcessSteps();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Werkwijze", "description": "Zo werkt een fotoshoot bij Bas Fotografie: aanvragen, afstemmen, fotograferen en opleveren via een online galerij.", "currentPath": "/werkwijze/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">Werkwijze</p> <h1>Rustige voorbereiding, echte aandacht tijdens de shoot</h1> <p>
Een fotoshoot hoeft niet ingewikkeld te voelen. Bas houdt het helder en persoonlijk, van eerste bericht tot galerij.
</p> </section> <section class="section"> <div class="timeline"> ${processSteps.map((step) => renderTemplate`<article> <p class="eyebrow">${step.title}</p> <h2>${step.title}</h2> <p>${step.body}</p> </article>`)} </div> </section> <section class="split-section section-muted"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Op locatie", "title": "Een plek waar je jezelf kunt zijn", "body": "Denk aan een park, strand, tuin, huiselijke setting of een andere plek in het Westland waar jullie ontspannen zijn." })} <div class="photo-strip" aria-label="Visuele placeholders voor locaties"> <figure> <img src="/assets/portfolio/gezinnen-01.webp" alt="Placeholder voor gezinslocatie" loading="lazy"> </figure> <figure> <img src="/assets/portfolio/kinderen-02.webp" alt="Placeholder voor kinderlocatie" loading="lazy"> </figure> <figure> <img src="/assets/portfolio/huisdieren-02.webp" alt="Placeholder voor huisdierlocatie" loading="lazy"> </figure> </div> </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, {})} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/werkwijze.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/werkwijze.astro";
const $$url = "/werkwijze";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Werkwijze,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
