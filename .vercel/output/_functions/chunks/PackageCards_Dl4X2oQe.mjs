import { f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import 'clsx';
import { a as getPackages } from './Layout_DnFKEg3I.mjs';

const $$PackageCards = createComponent(async ($$result, $$props, $$slots) => {
  const packages = await getPackages();
  return renderTemplate`${maybeRenderHead()}<div class="package-grid"> ${packages.map((item) => renderTemplate`<article${addAttribute(["package-card", item.featured && "is-featured"], "class:list")}> ${item.featured && renderTemplate`<p class="package-badge">Meest gekozen</p>`} <div class="package-top"> <p class="eyebrow">${item.duration}</p> <h3>${item.name}</h3> <p class="package-price">${item.price}</p> </div> <p>${item.summary}</p> <ul> ${item.features.map((feature) => renderTemplate`<li>${feature}</li>`)} </ul> <a class="button button-secondary"${addAttribute(`/contact/?pakket=${item.name}`, "href")}>
Vraag ${item.name} aan
</a> </article>`)} </div>`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/components/PackageCards.astro", void 0);

export { $$PackageCards as $ };
