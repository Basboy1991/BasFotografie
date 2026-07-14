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
  category: "Kinderen" | "Gezinnen" | "Huisdieren" | "Portretten" | "Privearchief";
  image: string;
  alt: string;
  note: string;
  description: string;
  layoutSize?: "standaard" | "groot";
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
  tagline: "Echte momenten puur vastgelegd",
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
  heroEyebrow: "Fotograaf in Naaldwijk en gemeente Westland",
  heroBody:
    "Mooie portretten van kinderen, gezinnen en huisdieren, gemaakt op een plek waar jullie je prettig voelen.",
  profileIntro:
    "Bas van der Scheer fotografeert kinderen, gezinnen, huisdieren en portretten met aandacht voor licht, kleine gebaren en het moment dat iemand even zichzelf is.",
  profileBody:
    "De shoot mag richting hebben, maar hoeft geen toneelstuk te worden. Bas geeft rustige aanwijzingen en let op de momenten ertussen.",
  profileImage: "/assets/portfolio/portretten-01.webp",
  profileImageCaption: "Portretplaceholder tot een goedgekeurde foto is gekozen.",
});

export const site = fallbackSite;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "Pakketten", href: "/pakketten/" },
  { label: "Werkwijze", href: "/werkwijze/" },
  { label: "Over Bas", href: "/over-bas/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

export const fallbackPackages: PackageItem[] = [
  {
    name: "Basic",
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
    name: "Extra",
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
    name: "Premium",
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
    alt: "Placeholder voor kinderportret op locatie in het Westland",
    note: "Goedgekeurde foto volgt",
    description: "Een spontaan moment buiten, met ruimte voor beweging en een rustige blik.",
    layoutSize: "groot",
  },
  {
    title: "Kleine blik",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-02.webp",
    alt: "Placeholder voor rustig kinderportret",
    note: "Privacy-veilige placeholder",
    description: "Een klein portretmoment waarin de aandacht vanzelf naar de blik gaat.",
    layoutSize: "standaard",
  },
  {
    title: "Gezin op locatie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-01.webp",
    alt: "Placeholder voor gezinsfotografie in Naaldwijk",
    note: "Goedgekeurde foto volgt",
    description: "Samen op pad, dicht bij elkaar en zonder dat het beeld geposeerd hoeft te voelen.",
    layoutSize: "groot",
  },
  {
    title: "Samen dichtbij",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-02.webp",
    alt: "Placeholder voor gezinsportret op locatie",
    note: "Privacy-veilige placeholder",
    description: "Een zachte gezinsfoto met aandacht voor de verbinding tussen de mensen.",
    layoutSize: "standaard",
  },
  {
    title: "Huisdierportret",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-01.webp",
    alt: "Placeholder voor huisdierfotografie",
    note: "Goedgekeurde foto volgt",
    description: "Een rustig huisdierportret waarin karakter en nieuwsgierigheid centraal staan.",
    layoutSize: "standaard",
  },
  {
    title: "Vacht en blik",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-02.webp",
    alt: "Placeholder voor detailrijk huisdierportret",
    note: "Privacy-veilige placeholder",
    description: "Details in vacht, houding en blik geven dit portret zijn eigen energie.",
    layoutSize: "groot",
  },
  {
    title: "Portretlicht",
    category: "Portretten",
    image: "/assets/portfolio/portretten-01.webp",
    alt: "Placeholder voor portretfotografie met helder licht",
    note: "Goedgekeurde foto volgt",
    description: "Helder portretlicht en een ontspannen houding brengen het persoonlijke verhaal naar voren.",
    layoutSize: "groot",
  },
  {
    title: "Zacht profiel",
    category: "Portretten",
    image: "/assets/portfolio/portretten-02.webp",
    alt: "Placeholder voor persoonlijk portret",
    note: "Privacy-veilige placeholder",
    description: "Een eenvoudig profiel waarin licht en stilte het beeld dragen.",
    layoutSize: "standaard",
  },
  {
    title: "Detail onderweg",
    category: "Kinderen",
    image: "/assets/portfolio/kinderen-03.webp",
    alt: "Placeholder voor spontaan kinderdetail",
    note: "Goedgekeurde foto volgt",
    description: "Een klein detail uit de serie dat laat zien hoe mooi het onverwachte kan zijn.",
  },
  {
    title: "Rustige serie",
    category: "Gezinnen",
    image: "/assets/portfolio/gezinnen-03.webp",
    alt: "Placeholder voor gezinsserie",
    note: "Privacy-veilige placeholder",
    description: "Een serie ontstaat uit meerdere kleine momenten die samen één verhaal vertellen.",
  },
  {
    title: "Op ooghoogte",
    category: "Huisdieren",
    image: "/assets/portfolio/huisdieren-03.webp",
    alt: "Placeholder voor huisdier op ooghoogte",
    note: "Goedgekeurde foto volgt",
    description: "Op ooghoogte ontstaat een eerlijk en rustig portret met veel aandacht voor karakter.",
  },
  {
    title: "Natuurlijk portret",
    category: "Portretten",
    image: "/assets/portfolio/portretten-03.webp",
    alt: "Placeholder voor natuurlijk portret op locatie",
    note: "Privacy-veilige placeholder",
    description: "Een natuurlijk portret met zacht licht en genoeg ruimte om jezelf te blijven.",
  },
];

export const fallbackProcessSteps: ProcessStep[] = [
  {
    title: "Aanvragen",
    body: "Je vertelt wie er op de foto mag, welke plek je in gedachten hebt en welk pakket past.",
  },
  {
    title: "Afstemmen",
    body: "Bas denkt mee over timing, locatie en kleine praktische dingen die de shoot ontspannen maken.",
  },
  {
    title: "Fotograferen",
    body: "De shoot draait om mooi licht, rustige aanwijzingen en ruimte voor echte momenten.",
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
      "Bas fotografeert op locatie in Naaldwijk en de gemeente Westland. Buiten Westland kan in overleg.",
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
      "De exacte levertijd wordt bij de aanvraag afgestemd. Reken voor v1-communicatie op een persoonlijke afspraak per shoot.",
  },
  {
    question: "Zijn de prijzen inclusief btw?",
    answer:
      "De site toont totaalprijzen. Een btw-vermelding wordt pas toegevoegd wanneer administratief vaststaat welke vermelding klopt.",
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
  return withComputedContact({
    ...fallbackSite,
    ...content,
    profileImage: profileImage ?? fallbackSite.profileImage,
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

  return content?.length ? content : fallbackPackages;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const content = await fetchSanity<(Omit<PortfolioItem, "image"> & { image?: unknown })[]>(
    `*[_type == "portfolioItem" && coalesce(published, true)] | order(order asc, _createdAt asc) {
      title,
      category,
      image,
      alt,
      note,
      description,
      layoutSize
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

  return content?.length ? content : fallbackProcessSteps;
}

export async function getFaqs(): Promise<FaqItem[]> {
  const content = await fetchSanity<FaqItem[]>(
    `*[_type == "faqItem"] | order(order asc, _createdAt asc) {
      question,
      answer
    }`,
  );

  return content?.length ? content : fallbackFaqs;
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
