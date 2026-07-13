import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import { g as getSiteSettings, a as getPackages, $ as $$Layout } from '../chunks/Layout_DnFKEg3I.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://bas-fotografie.nl");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Contact;
  const site = await getSiteSettings();
  const packages = await getPackages();
  const selectedPackage = Astro2.url.searchParams.get("pakket") ?? "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact en aanvraag", "description": "Vraag een fotoshoot aan bij Bas Fotografie in Naaldwijk en gemeente Westland via formulier, WhatsApp of e-mail.", "currentPath": "/contact/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="contact-hero"> <div> <p class="eyebrow">Contact</p> <h1>Vertel wat je wilt vastleggen</h1> <p>
Gebruik het formulier voor een aanvraag. Liever eerst snel iets vragen? Stuur Bas een WhatsApp-bericht.
</p> <div class="contact-links"> <a${addAttribute(site.whatsappHref, "href")}>WhatsApp ${site.phoneDisplay}</a> <a${addAttribute(`mailto:${site.email}`, "href")}>${site.email}</a> <a${addAttribute(site.instagram, "href")} rel="noreferrer">Instagram</a> </div> </div> <form class="contact-form" name="shoot-aanvraag" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/bedankt/"> <input type="hidden" name="form-name" value="shoot-aanvraag"> <p class="hidden-field"> <label>Laat dit veld leeg <input name="bot-field"></label> </p> <div class="form-grid"> <label>
Naam
<input name="naam" type="text" autocomplete="name" required> </label> <label>
E-mail
<input name="email" type="email" autocomplete="email" required> </label> <label>
Telefoon
<input name="telefoon" type="tel" autocomplete="tel" required> </label> <label>
Shootsoort
<select name="shootsoort" required> <option value="">Kies een shootsoort</option> <option>Kinderen</option> <option>Gezin</option> <option>Huisdier</option> <option>Portret</option> <option>Anders / in overleg</option> </select> </label> <label>
Pakket
<select name="pakket" required> <option value="">Kies een pakket</option> ${packages.map((item) => renderTemplate`<option${addAttribute(selectedPackage === item.name, "selected")}>${item.name} - ${item.price}</option>`)} <option>Ik twijfel nog</option> </select> </label> <label>
Voorkeursdatum
<input name="voorkeursdatum" type="date"> </label> <label>
Locatie of plaats
<input name="locatie" type="text" placeholder="Bijv. Naaldwijk, strand, park of thuis" required> </label> <label>
Aantal personen/dieren
<input name="aantal" type="text" placeholder="Bijv. 2 volwassenen, 2 kinderen en hond" required> </label> </div> <label>
Bericht
<textarea name="bericht" rows="6" placeholder="Vertel kort wat je voor je ziet." required></textarea> </label> <label class="check-label"> <input name="privacy" type="checkbox" required> <span>Ik ga akkoord met de verwerking van mijn gegevens voor deze aanvraag en heb de <a href="/privacy/">privacyverklaring</a> gelezen.</span> </label> <button class="button" type="submit">Aanvraag versturen</button> <p class="form-note">Na verzending neemt Bas persoonlijk contact met je op.</p> </form> </section> ` })}`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/pages/contact.astro", void 0);

const $$file = "C:/Users/HP/Documents/BasFotografie-main/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
