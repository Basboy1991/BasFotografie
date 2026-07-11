import { fetchSanity, imageUrlFor } from "@/lib/sanity";

export type SiteSettings = {
  name: string;
  person: string;
  tagline: string;
  description: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  whatsappMessage: string;
  instagram: string;
  region: string;
  heroEyebrow: string;
  heroBody: string;
  profileIntro: string;
  profileBody: string;
  profileImage: string;
  profileImageCaption: string;
};

export type PackageItem = {
  name: string;
  price: string;
  duration: string;
  summary: string;
  features: string[];
  featured?: boolean;
};

export type PortfolioItem = {
  title: string;
  category: "Kinderen" | "Gezinnen" | "Huisdieren" | "Portretten";
  image: string;
  alt: string;
  note: string;
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const fallbackSite: SiteSettings = withComputedContact({
  name: "Bas Fotografie",
  person: "Bas van der Scheer",
  tagline: "Geen stijve poses. Wel een foto die klopt.",
  description:
    "Fotograaf in Naaldwijk en gemeente Westland voor kinderen, gezinnen, huisdieren en portretten op locatie.",
  email: "basvanderscheer@gmail.com",
  phoneDisplay: "06-44733404",
  phoneHref: "",
  whatsappHref: "",
  whatsappMessage: "Hoi Bas, ik wil graag een fotoshoot aanvragen.",
  instagram:
    "https://www.instagram.com/basvdscheer_fotografie?igsh=c2l0ZWh5Mnh1OXoy",
  region: "Naaldwijk en gemeente Westland",
  heroEyebrow: "Bas van der Scheer · fotograaf in het Westland",
  heroBody:
    "Ik fotografeer kinderen, gezinnen, huisdieren en portretten op een plek waar jullie je prettig voelen.",
  profileIntro:
    "Ik ben Bas van der Scheer. Ik fotografeer kinderen, gezinnen, huisdieren en portretten met aandacht voor licht, kleine gebaren en het moment waarop iemand even zichzelf is.",
  profileBody:
    "Een shoot mag richting hebben, maar hoeft geen toneelstuk te worden. Ik geef rustige aanwijzingen en let vooral op de momenten ertussen.",
  profileImage: "/assets/portfolio/portretten-01.webp",
  profileImageCaption: "Bas van der Scheer · Naaldwijk",
});

export const site = fallbackSite;

export const navItems = [
  { label: "Mijn werk", href: "/portfolio/" },
  { label: "Tarieven", href: "/pakketten/" },
  { label: "Werkwijze", href: "/werkwijze/" },
  { label: "Over mij", href: "/over-bas/" },
  { label: "Contact", href: "/contact/" },
];

export const fallbackPackages: PackageItem[] = [
  {
    name: "Kort",
    price: "\u20ac125",
    duration: "30 minuten",
    summary: "Een korte, rustige shoot voor een kleine selectie portretten.",
    features: [
      "Fotoshoot op locatie",
      "5 bewerkte digitale foto's",
      "Online galerij",
      "Geschikt voor kind, portret of huisdier",
    ],
  },
  {
    name: "Ruim",
    price: "\u20ac195",
    duration: "60 minuten",
    summary: "Meer tijd voor variatie, ontspanning en meerdere combinaties.",
    features: [
      "Fotoshoot op locatie",
      "15 bewerkte digitale foto's",
      "Online galerij",
      "Geschikt voor gezin, kind en huisdier",
    ],
    featured: true,
  },
  {
    name: "Serie",
    price: "\u20ac295",
    duration: "90 minuten",
    summary: "Alle rust voor een complete serie met meerdere momenten.",
    features: [
      "Fotoshoot op locatie",
      "30 bewerkte digitale foto's",
      "Online galerij",
      "Extra tijd voor meerdere combinaties",
    ],
  },
];

export const fallbackPortfolioItems: PortfolioItem[] = [
  {
    title: "Kinderen buiten",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-01.webp",
    alt: "Abstracte beeldmarkering voor kinderfotografie in het Westland",
    note: "Kinderen",
  },
  {
    title: "Kleine blik",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-02.webp",
    alt: "Abstracte beeldmarkering voor een rustig kinderportret",
    note: "Kinderen",
  },
  {
    title: "Gezin op locatie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-01.webp",
    alt: "Abstracte beeldmarkering voor gezinsfotografie in Naaldwijk",
    note: "Gezinnen",
  },
  {
    title: "Samen dichtbij",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-02.webp",
    alt: "Abstracte beeldmarkering voor een gezinsportret op locatie",
    note: "Gezinnen",
  },
  {
    title: "Huisdierportret",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-01.webp",
    alt: "Abstracte beeldmarkering voor huisdierfotografie",
    note: "Huisdieren",
  },
  {
    title: "Vacht en blik",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-02.webp",
    alt: "Abstracte beeldmarkering voor een huisdierportret",
    note: "Huisdieren",
  },
  {
    title: "Portretlicht",
    category: "Portretten",
    image: "/assets/portfolio/portretten-01.webp",
    alt: "Abstracte beeldmarkering voor portretfotografie met helder licht",
    note: "Portretten",
  },
  {
    title: "Zacht profiel",
    category: "Portretten",
    image: "/assets/portfolio/portretten-02.webp",
    alt: "Abstracte beeldmarkering voor een persoonlijk portret",
    note: "Portretten",
  },
  {
    title: "Detail onderweg",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-03.webp",
    alt: "Abstracte beeldmarkering voor een spontaan kinderdetail",
    note: "Kinderen",
  },
  {
    title: "Rustige serie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-03.webp",
    alt: "Abstracte beeldmarkering voor een gezinsserie",
    note: "Gezinnen",
  },
  {
    title: "Op ooghoogte",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-03.webp",
    alt: "Abstracte beeldmarkering voor een huisdier op ooghoogte",
    note: "Huisdieren",
  },
  {
    title: "Natuurlijk portret",
    category: "Portretten",
    image: "/assets/portfolio/portretten-03.webp",
    alt: "Abstracte beeldmarkering voor een natuurlijk portret op locatie",
    note: "Portretten",
  },
];

export const fallbackProcessSteps: ProcessStep[] = [
  {
    title: "Aanvragen",
    body: "Je vertelt wie er op de foto mag, welke plek je in gedachten hebt en welk pakket past.",
  },
  {
    title: "Afstemmen",
    body: "Ik denk mee over timing, locatie en de kleine dingen die de shoot ontspannen maken.",
  },
  {
    title: "Fotograferen",
    body: "Ik geef rustige aanwijzingen en laat het los zodra het moment er is.",
  },
  {
    title: "Opleveren",
    body: "Je ontvangt een online galerij met de geselecteerde, bewerkte digitale foto's.",
  },
];

export const fallbackFaqs: FaqItem[] = [
  {
    question: "Waar fotografeer je?",
    answer:
      "Ik fotografeer op locatie in Naaldwijk en de gemeente Westland. Buiten Westland kan in overleg.",
  },
  {
    question: "Moeten kinderen of dieren goed stilzitten?",
    answer:
      "Nee. De shoot wordt rustig opgebouwd, met korte momenten en genoeg ruimte om even te bewegen.",
  },
  {
    question: "Wat trek ik aan?",
    answer:
      "Kies kleding waarin je je prettig voelt. Rustige kleuren werken vaak mooi, maar het belangrijkste is dat het bij jullie past.",
  },
  {
    question: "Krijg ik alle onbewerkte foto's?",
    answer:
      "Nee, je ontvangt een selectie bewerkte digitale foto's volgens het gekozen pakket.",
  },
  {
    question: "Wanneer ontvang ik de foto's?",
    answer:
      "Ik spreek de levertijd vooraf met je af, zodat je weet wanneer je de galerij kunt verwachten.",
  },
  {
    question: "Zijn dit totaalprijzen?",
    answer:
      "De bedragen op de site zijn totaalprijzen. Heb je een zakelijke vraag, stuur me dan even een bericht.",
  },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  const content = await fetchSanity<Partial<SiteSettings> & { profileImage?: unknown }>(
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
    }`,
  );

  if (!content) {
    return fallbackSite;
  }

  const profileImage = imageUrlFor(content.profileImage, { width: 1200, height: 1500 });
  const merged = {
    ...fallbackSite,
    ...content,
    profileImage: profileImage ?? fallbackSite.profileImage,
  };

  return withComputedContact({
    ...merged,
    tagline:
      merged.tagline === "Echte momenten puur vastgelegd"
        ? fallbackSite.tagline
        : merged.tagline,
    heroEyebrow:
      merged.heroEyebrow === "Fotograaf in Naaldwijk en gemeente Westland"
        ? fallbackSite.heroEyebrow
        : merged.heroEyebrow,
    heroBody:
      merged.heroBody ===
      "Mooie portretten van kinderen, gezinnen en huisdieren, gemaakt op een plek waar jullie je prettig voelen."
        ? fallbackSite.heroBody
        : merged.heroBody,
    profileIntro:
      merged.profileIntro ===
      "Bas van der Scheer fotografeert kinderen, gezinnen, huisdieren en portretten met aandacht voor licht, kleine gebaren en het moment dat iemand even zichzelf is."
        ? fallbackSite.profileIntro
        : merged.profileIntro,
    profileBody:
      merged.profileBody ===
      "De shoot mag richting hebben, maar hoeft geen toneelstuk te worden. Bas geeft rustige aanwijzingen en let op de momenten ertussen."
        ? fallbackSite.profileBody
        : merged.profileBody,
    profileImageCaption:
      merged.profileImageCaption === "Portretplaceholder tot een goedgekeurde foto is gekozen."
        ? fallbackSite.profileImageCaption
        : merged.profileImageCaption,
  });
}

export async function getPackages(): Promise<PackageItem[]> {
  const content = await fetchSanity<PackageItem[]>(
    `*[_type == "package"] | order(order asc, _createdAt asc) {
      name,
      price,
      duration,
      summary,
      features,
      featured
    }`,
  );

  if (!content?.length) {
    return fallbackPackages;
  }

  const legacyNames: Record<string, string> = {
    Basic: "Kort",
    Extra: "Ruim",
    Premium: "Serie",
  };

  return content.map((item) => ({
    ...item,
    name: legacyNames[item.name] ?? item.name,
  }));
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const content = await fetchSanity<(Omit<PortfolioItem, "image"> & { image?: unknown })[]>(
    `*[_type == "portfolioItem" && coalesce(published, true)] | order(order asc, _createdAt asc) {
      title,
      category,
      image,
      alt,
      note
    }`,
  );

  if (!content?.length) {
    return fallbackPortfolioItems;
  }

  return content.map((item, index) => {
    const fallback = fallbackPortfolioItems[index % fallbackPortfolioItems.length];
    return {
      ...fallback,
      ...item,
      image: imageUrlFor(item.image, { width: 1400, height: 1700 }) ?? fallback.image,
    };
  });
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const content = await fetchSanity<ProcessStep[]>(
    `*[_type == "processStep"] | order(order asc, _createdAt asc) {
      title,
      body
    }`,
  );

  if (!content?.length) {
    return fallbackProcessSteps;
  }

  const legacyBodies = new Map([
    [
      "Bas denkt mee over timing, locatie en kleine praktische dingen die de shoot ontspannen maken.",
      "Ik denk mee over timing, locatie en de kleine dingen die de shoot ontspannen maken.",
    ],
    [
      "De shoot draait om mooi licht, rustige aanwijzingen en ruimte voor echte momenten.",
      "Ik geef rustige aanwijzingen en laat het los zodra het moment er is.",
    ],
  ]);

  return content.map((step) => ({
    ...step,
    body: legacyBodies.get(step.body) ?? step.body,
  }));
}

export async function getFaqs(): Promise<FaqItem[]> {
  const content = await fetchSanity<FaqItem[]>(
    `*[_type == "faqItem"] | order(order asc, _createdAt asc) {
      question,
      answer
    }`,
  );

  if (!content?.length) {
    return fallbackFaqs;
  }

  const legacyAnswers = new Map([
    [
      "Bas fotografeert op locatie in Naaldwijk en de gemeente Westland. Buiten Westland kan in overleg.",
      "Ik fotografeer op locatie in Naaldwijk en de gemeente Westland. Buiten Westland kan in overleg.",
    ],
    [
      "De exacte levertijd wordt bij de aanvraag afgestemd. Reken voor v1-communicatie op een persoonlijke afspraak per shoot.",
      "Ik spreek de levertijd vooraf met je af, zodat je weet wanneer je de galerij kunt verwachten.",
    ],
    [
      "De site toont totaalprijzen. Een btw-vermelding wordt pas toegevoegd wanneer administratief vaststaat welke vermelding klopt.",
      "De bedragen op de site zijn totaalprijzen. Heb je een zakelijke vraag, stuur me dan even een bericht.",
    ],
  ]);

  return content.map((item) => ({
    ...item,
    question: item.question === "Zijn de prijzen inclusief btw?" ? "Zijn dit totaalprijzen?" : item.question,
    answer: legacyAnswers.get(item.answer) ?? item.answer,
  }));
}

function withComputedContact<T extends Partial<SiteSettings>>(settings: T): T & SiteSettings {
  const phoneDisplay = settings.phoneDisplay || "";
  const digits = phoneDisplay.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `31${digits.slice(1)}` : digits;
  const whatsappMessage =
    settings.whatsappMessage || "Hoi Bas, ik wil graag een fotoshoot aanvragen.";

  return {
    ...settings,
    phoneDisplay,
    phoneHref: international ? `tel:+${international}` : "",
    whatsappHref: international
      ? `https://wa.me/${international}?text=${encodeURIComponent(whatsappMessage)}`
      : "",
    whatsappMessage,
  } as T & SiteSettings;
}
