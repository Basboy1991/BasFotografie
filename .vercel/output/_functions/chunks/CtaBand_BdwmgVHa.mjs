import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import 'clsx';
import { g as getSiteSettings } from './Layout_DnFKEg3I.mjs';

const $$Astro = createAstro("https://bas-fotografie.nl");
const $$CtaBand = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CtaBand;
  const {
    title = "Klaar om een shoot te plannen?",
    body = "Vertel kort wie je wilt laten fotograferen en welke plek je in gedachten hebt. Bas reageert persoonlijk."
  } = Astro2.props;
  const site = await getSiteSettings();
  return renderTemplate`${maybeRenderHead()}<section class="cta-band" aria-labelledby="cta-title"> <div> <p class="eyebrow">Aanvraag</p> <h2 id="cta-title">${title}</h2> <p>${body}</p> </div> <div class="cta-actions"> <a class="button" href="/contact/">Aanvraag doen</a> <a class="button button-quiet"${addAttribute(site.whatsappHref, "href")}>WhatsApp Bas</a> </div> </section>`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/components/CtaBand.astro", void 0);

export { $$CtaBand as $ };
