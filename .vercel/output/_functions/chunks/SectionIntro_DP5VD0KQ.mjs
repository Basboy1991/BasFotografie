import { e as createAstro, f as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro("https://bas-fotografie.nl");
const $$SectionIntro = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SectionIntro;
  const { eyebrow, title, body } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="section-intro"> ${eyebrow && renderTemplate`<p class="eyebrow">${eyebrow}</p>`} <h2>${title}</h2> ${body && renderTemplate`<p>${body}</p>`} </div>`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/components/SectionIntro.astro", void 0);

export { $$SectionIntro as $ };
