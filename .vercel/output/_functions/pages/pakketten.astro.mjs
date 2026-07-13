import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
import { $ as $$PackageCards } from '../chunks/PackageCards_Dl4X2oQe.mjs';
import { $ as $$SectionIntro } from '../chunks/SectionIntro_DP5VD0KQ.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_BdwmgVHa.mjs';
export { renderers } from '../renderers.mjs';

const $$Pakketten = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pakketten en prijzen", "description": "Pakketten en prijzen voor kinderfotografie, gezinsfotografie, huisdierfotografie en portretten door Bas Fotografie in Westland.", "currentPath": "/pakketten/" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">Pakketten</p> <h1>Basic, Extra en Premium</h1> <p>
Drie duidelijke totaalprijzen voor particuliere shoots op locatie. Buiten de gemeente Westland kan in overleg.
</p> </section> <section class="section"> ${renderComponent($$result2, "PackageCards", $$PackageCards, {})} <p class="fineprint">
De bedragen zijn totaalprijzen. Een btw-vermelding wordt toegevoegd wanneer administratief vaststaat welke vermelding klopt.
</p> </section> <section class="split-section"> ${renderComponent($$result2, "SectionIntro", $$SectionIntro, { "eyebrow": "Wat past?", "title": "Kies op rust, niet alleen op aantal foto's", "body": "Bij kinderen en dieren is extra tijd vaak geen luxe, maar de ruimte waarin de mooiste blik vanzelf ontstaat." })} <div class="feature-list"> <article> <h3>Basic</h3> <p>Fijn voor een korte portretupdate of een enkel moment.</p> </article> <article> <h3>Extra</h3> <p>De beste balans voor de meeste gezinnen, kinderen en huisdieren.</p> </article> <article> <h3>Premium</h3> <p>Meer rust voor meerdere combinaties, locaties of een grotere serie.</p> </article> </div> </section> ${renderComponent($$result2, "CtaBand", $$CtaBand, { "title": "Weet je al welk pakket past?", "body": "Geef je voorkeur door in het formulier. Twijfel je nog, dan denkt Bas mee." })} ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/pakketten.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/pakketten.astro";
const $$url = "/pakketten";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pakketten,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
