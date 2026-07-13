import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pagina niet gevonden", "description": "Deze pagina bestaat niet.", "currentPath": "/404/" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero compact"> <p class="eyebrow">404</p> <h1>Deze pagina is niet gevonden</h1> <p>Ga terug naar de homepagina of vraag direct een shoot aan.</p> <div class="hero-actions"> <a class="button" href="/">Naar home</a> <a class="button button-secondary" href="/contact/">Contact</a> </div> </section> ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/404.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
