import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderScript } from './astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import 'clsx';
import { d as getPortfolioItems } from './Layout_DnFKEg3I.mjs';

const $$Astro = createAstro("https://bas-fotografie.nl");
const $$PortfolioGrid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PortfolioGrid;
  const { limit, interactive = false } = Astro2.props;
  const portfolioItems = await getPortfolioItems();
  const items = typeof limit === "number" ? portfolioItems.slice(0, limit) : portfolioItems;
  const filters = ["Alles", "Kinderen", "Gezinnen", "Huisdieren", "Portretten"];
  return renderTemplate`${interactive && renderTemplate`${maybeRenderHead()}<div class="filter-bar" aria-label="Portfoliofilters">${filters.map((filter) => renderTemplate`<button class="filter-button" type="button"${addAttribute(filter, "data-filter")}${addAttribute(filter === "Alles" ? "true" : "false", "aria-pressed")}>${filter}</button>`)}</div>`}<div class="portfolio-board" data-portfolio-board> ${items.map((item, index) => renderTemplate`<article${addAttribute(`photo-card photo-card-${index % 6 + 1}`, "class")}${addAttribute(item.category, "data-category")}> <a href="/contact/"${addAttribute(`${item.title}: shoot aanvragen`, "aria-label")}> <img${addAttribute(item.image, "src")}${addAttribute(item.alt, "alt")}${addAttribute(index < 2 ? "eager" : "lazy", "loading")}> <span class="photo-title-cutout"${addAttribute(`--item-image: url("${item.image}")`, "style")} aria-hidden="true">${item.title}</span> <span class="photo-label"> <strong>${item.title}</strong> <small>${item.category} / ${item.note}</small> </span> </a> </article>`)} </div> ${interactive && renderTemplate`${renderScript($$result, "C:/Users/HP/Documents/BasFotografie-main/src/components/PortfolioGrid.astro?astro&type=script&index=0&lang.ts")}`}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/components/PortfolioGrid.astro", void 0);

export { $$PortfolioGrid as $ };
