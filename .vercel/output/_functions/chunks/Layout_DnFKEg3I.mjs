import { e as createAstro, f as createComponent, h as addAttribute, n as renderHead, r as renderTemplate, o as renderSlot } from './astro/server_DA5Sgb9R.mjs';
import 'piccolore';
import 'clsx';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
/* empty css                           */

const projectId = "k2m6gkis";
const dataset = "production";
const apiVersion = "2026-07-07";
const sanityEnabled = Boolean(projectId) && projectId !== "replace-me" && Boolean(dataset);
const sanityClient = sanityEnabled ? createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false
}) : null;
const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;
async function fetchSanity(query, params = {}) {
  if (!sanityClient) {
    return null;
  }
  try {
    return await sanityClient.fetch(query, params);
  } catch (error) {
    console.warn("Sanity fetch failed; using local fallback content.", error);
    return null;
  }
}
function imageUrlFor(source, options = {}) {
  if (!imageBuilder || !source) {
    return null;
  }
  let image = imageBuilder.image(source).fit("crop");
  if (options.width) {
    image = image.width(options.width);
  }
  if (options.height) {
    image = image.height(options.height);
  }
  return image.auto("format").url();
}

const fallbackSite = withComputedContact({
  name: "Bas Fotografie",
  person: "Bas van der Scheer",
  tagline: "Echte momenten puur vastgelegd",
  description: "Fotograaf in Naaldwijk en gemeente Westland voor kinderen, gezinnen, huisdieren en portretten op locatie.",
  email: "basvanderscheer@gmail.com",
  phoneDisplay: "06-44733404",
  phoneHref: "",
  whatsappHref: "",
  whatsappMessage: "Hoi Bas, ik wil graag een fotoshoot aanvragen.",
  instagram: "https://www.instagram.com/basvdscheer_fotografie?igsh=c2l0ZWh5Mnh1OXoy",
  region: "Naaldwijk en gemeente Westland",
  heroEyebrow: "Fotograaf in Naaldwijk en gemeente Westland",
  heroBody: "Mooie portretten van kinderen, gezinnen en huisdieren, gemaakt op een plek waar jullie je prettig voelen.",
  profileIntro: "Bas van der Scheer fotografeert kinderen, gezinnen, huisdieren en portretten met aandacht voor licht, kleine gebaren en het moment dat iemand even zichzelf is.",
  profileBody: "De shoot mag richting hebben, maar hoeft geen toneelstuk te worden. Bas geeft rustige aanwijzingen en let op de momenten ertussen.",
  profileImage: "/assets/portfolio/portretten-01.webp",
  profileImageCaption: "Portretplaceholder tot een goedgekeurde foto is gekozen."
});
const navItems = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "Pakketten", href: "/pakketten/" },
  { label: "Werkwijze", href: "/werkwijze/" },
  { label: "Over Bas", href: "/over-bas/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" }
];
const fallbackPackages = [
  {
    name: "Basic",
    price: "€125",
    duration: "30 minuten",
    summary: "Een korte, rustige shoot voor een kleine selectie portretten.",
    features: [
      "Fotoshoot op locatie",
      "5 bewerkte digitale foto's",
      "Online galerij",
      "Geschikt voor kind, portret of huisdier"
    ]
  },
  {
    name: "Extra",
    price: "€195",
    duration: "60 minuten",
    summary: "Meer tijd voor variatie, ontspanning en meerdere combinaties.",
    features: [
      "Fotoshoot op locatie",
      "15 bewerkte digitale foto's",
      "Online galerij",
      "Geschikt voor gezin, kind en huisdier"
    ],
    featured: true
  },
  {
    name: "Premium",
    price: "€295",
    duration: "90 minuten",
    summary: "Alle rust voor een complete serie met meerdere momenten.",
    features: [
      "Fotoshoot op locatie",
      "30 bewerkte digitale foto's",
      "Online galerij",
      "Extra tijd voor meerdere combinaties"
    ]
  }
];
const fallbackPortfolioItems = [
  {
    title: "Kinderen buiten",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-01.webp",
    alt: "Placeholder voor kinderportret op locatie in het Westland",
    note: "Goedgekeurde foto volgt",
    layoutSize: "groot"
  },
  {
    title: "Kleine blik",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-02.webp",
    alt: "Placeholder voor rustig kinderportret",
    note: "Privacy-veilige placeholder",
    layoutSize: "standaard"
  },
  {
    title: "Gezin op locatie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-01.webp",
    alt: "Placeholder voor gezinsfotografie in Naaldwijk",
    note: "Goedgekeurde foto volgt",
    layoutSize: "groot"
  },
  {
    title: "Samen dichtbij",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-02.webp",
    alt: "Placeholder voor gezinsportret op locatie",
    note: "Privacy-veilige placeholder",
    layoutSize: "standaard"
  },
  {
    title: "Huisdierportret",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-01.webp",
    alt: "Placeholder voor huisdierfotografie",
    note: "Goedgekeurde foto volgt",
    layoutSize: "standaard"
  },
  {
    title: "Vacht en blik",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-02.webp",
    alt: "Placeholder voor detailrijk huisdierportret",
    note: "Privacy-veilige placeholder",
    layoutSize: "groot"
  },
  {
    title: "Portretlicht",
    category: "Portretten",
    image: "/assets/portfolio/portretten-01.webp",
    alt: "Placeholder voor portretfotografie met helder licht",
    note: "Goedgekeurde foto volgt",
    layoutSize: "groot"
  },
  {
    title: "Zacht profiel",
    category: "Portretten",
    image: "/assets/portfolio/portretten-02.webp",
    alt: "Placeholder voor persoonlijk portret",
    note: "Privacy-veilige placeholder",
    layoutSize: "standaard"
  },
  {
    title: "Detail onderweg",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-03.webp",
    alt: "Placeholder voor spontaan kinderdetail",
    note: "Goedgekeurde foto volgt"
  },
  {
    title: "Rustige serie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-03.webp",
    alt: "Placeholder voor gezinsserie",
    note: "Privacy-veilige placeholder"
  },
  {
    title: "Op ooghoogte",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-03.webp",
    alt: "Placeholder voor huisdier op ooghoogte",
    note: "Goedgekeurde foto volgt"
  },
  {
    title: "Natuurlijk portret",
    category: "Portretten",
    image: "/assets/portfolio/portretten-03.webp",
    alt: "Placeholder voor natuurlijk portret op locatie",
    note: "Privacy-veilige placeholder"
  }
];
const fallbackProcessSteps = [
  {
    title: "Aanvragen",
    body: "Je vertelt wie er op de foto mag, welke plek je in gedachten hebt en welk pakket past."
  },
  {
    title: "Afstemmen",
    body: "Bas denkt mee over timing, locatie en kleine praktische dingen die de shoot ontspannen maken."
  },
  {
    title: "Fotograferen",
    body: "De shoot draait om mooi licht, rustige aanwijzingen en ruimte voor echte momenten."
  },
  {
    title: "Opleveren",
    body: "Je ontvangt een online galerij met de geselecteerde, bewerkte digitale foto's."
  }
];
const fallbackFaqs = [
  {
    question: "Waar fotografeer je?",
    answer: "Bas fotografeert op locatie in Naaldwijk en de gemeente Westland. Buiten Westland kan in overleg."
  },
  {
    question: "Moeten kinderen of dieren goed stilzitten?",
    answer: "Nee. De shoot wordt rustig opgebouwd, met korte momenten en genoeg ruimte om even te bewegen."
  },
  {
    question: "Wat trek ik aan?",
    answer: "Kies kleding waarin je je prettig voelt. Rustige kleuren werken vaak mooi, maar het belangrijkste is dat het bij jullie past."
  },
  {
    question: "Krijg ik alle onbewerkte foto's?",
    answer: "Nee, je ontvangt een selectie bewerkte digitale foto's volgens het gekozen pakket."
  },
  {
    question: "Wanneer ontvang ik de foto's?",
    answer: "De exacte levertijd wordt bij de aanvraag afgestemd. Reken voor v1-communicatie op een persoonlijke afspraak per shoot."
  },
  {
    question: "Zijn de prijzen inclusief btw?",
    answer: "De site toont totaalprijzen. Een btw-vermelding wordt pas toegevoegd wanneer administratief vaststaat welke vermelding klopt."
  }
];
async function getSiteSettings() {
  const content = await fetchSanity(
    `*[_type == "siteSettings"][0]{
      name,
      person,
      tagline,
      description,
      email,
      phoneDisplay,
      whatsappMessage,
      instagram,
      region,
      heroEyebrow,
      heroBody,
      profileIntro,
      profileBody,
      profileImage,
      profileImageCaption
    }`
  );
  if (!content) {
    return fallbackSite;
  }
  const profileImage = imageUrlFor(content.profileImage, { width: 1200, height: 1500 });
  return withComputedContact({
    ...fallbackSite,
    ...content,
    profileImage: profileImage ?? fallbackSite.profileImage
  });
}
async function getPackages() {
  const content = await fetchSanity(
    `*[_type == "package"] | order(order asc, _createdAt asc) {
      name,
      price,
      duration,
      summary,
      features,
      featured
    }`
  );
  return content?.length ? content : fallbackPackages;
}
async function getPortfolioItems() {
  const content = await fetchSanity(
    `*[_type == "portfolioItem" && coalesce(published, true)] | order(order asc, _createdAt asc) {
      title,
      category,
      image,
      alt,
      note,
      layoutSize
    }`
  );
  if (!content?.length) {
    return fallbackPortfolioItems;
  }
  return content.map((item, index) => {
    const fallback = fallbackPortfolioItems[index % fallbackPortfolioItems.length];
    return {
      ...fallback,
      ...item,
      image: imageUrlFor(item.image, { width: 1400, height: 1700 }) ?? fallback.image
    };
  });
}
async function getProcessSteps() {
  const content = await fetchSanity(
    `*[_type == "processStep"] | order(order asc, _createdAt asc) {
      title,
      body
    }`
  );
  return content?.length ? content : fallbackProcessSteps;
}
async function getFaqs() {
  const content = await fetchSanity(
    `*[_type == "faqItem"] | order(order asc, _createdAt asc) {
      question,
      answer
    }`
  );
  return content?.length ? content : fallbackFaqs;
}
function withComputedContact(settings) {
  const phoneDisplay = settings.phoneDisplay || "";
  const digits = phoneDisplay.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `31${digits.slice(1)}` : digits;
  const whatsappMessage = settings.whatsappMessage || "Hoi Bas, ik wil graag een fotoshoot aanvragen.";
  return {
    ...settings,
    phoneDisplay,
    phoneHref: international ? `tel:+${international}` : "",
    whatsappHref: international ? `https://wa.me/${international}?text=${encodeURIComponent(whatsappMessage)}` : "",
    whatsappMessage
  };
}

const $$Astro = createAstro("https://bas-fotografie.nl");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description,
    currentPath = Astro2.url.pathname
  } = Astro2.props;
  const site = await getSiteSettings();
  const resolvedTitle = title ?? site.name;
  const resolvedDescription = description ?? site.description;
  const pageTitle = resolvedTitle === site.name ? site.name : `${resolvedTitle} | ${site.name}`;
  return renderTemplate`<html lang="nl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title><meta name="description"${addAttribute(resolvedDescription, "content")}><meta name="robots" content="index, follow"><link rel="canonical"${addAttribute(new URL(currentPath, Astro2.site).toString(), "href")}><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(resolvedDescription, "content")}><meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta name="theme-color" content="#c05c43"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="shortcut icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/branding/bas-fotografie-mark.svg">${renderHead()}</head> <body> <a class="skip-link" href="#main">Direct naar inhoud</a> <header class="site-header"> <nav class="nav-shell" aria-label="Hoofdnavigatie"> <a class="brand" href="/" aria-label="Bas Fotografie home"> <img class="brand-wordmark" src="/assets/branding/bas-fotografie-wordmark.svg" alt="Bas Fotografie"> </a> <div class="nav-links" id="site-menu"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(currentPath === item.href ? "page" : void 0, "aria-current")}> ${item.label} </a>`)} </div> </nav> </header> <main id="main"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="site-footer"> <div class="footer-grid"> <div> <img class="footer-mark" src="/assets/branding/bas-fotografie-mark.svg" alt="" aria-hidden="true"> <p class="eyebrow">Bas Fotografie</p> <h2>${site.tagline}</h2> <p>
Portretten van kinderen, gezinnen en huisdieren op locatie in Naaldwijk en gemeente Westland.
</p> </div> <div> <p class="footer-title">Contact</p> <a${addAttribute(`mailto:${site.email}`, "href")}>${site.email}</a> <a${addAttribute(site.phoneHref, "href")}>${site.phoneDisplay}</a> <a${addAttribute(site.instagram, "href")} rel="noreferrer">Instagram</a> </div> <div> <p class="footer-title">Pagina's</p> <a href="/pakketten/">Pakketten</a> <a href="/contact/">Aanvraag doen</a> <a href="/privacy/">Privacy</a> </div> </div> <p class="footer-bottom">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${site.name}. Alle rechten voorbehouden.</p> </footer> </body></html>`;
}, "C:/Users/HP/Documents/BasFotografie-main/src/components/Layout.astro", void 0);

export { $$Layout as $, getPackages as a, getFaqs as b, getProcessSteps as c, getPortfolioItems as d, getSiteSettings as g };
