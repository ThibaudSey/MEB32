import type { Zone, Service, Partner, Project, Stat, NavLink } from "@/types";

// ── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Services",     href: "#services"     },
  { label: "Zones",        href: "#zones"        },
  { label: "Réalisations", href: "#realisations" },
  { label: "Partenaires",  href: "#partenaires"  },
];

// ── Stats bar ───────────────────────────────────────────────────────────────
export const STATS: Stat[] = [
  { value: "30+",  label: "ans",          sublabel: "d'expertise"  },
  { value: "7",    label: "départements", sublabel: "couverts"     },
  { value: "500+", label: "élevages",     sublabel: "équipés"      },
  { value: "24h",  label: "réactivité",   sublabel: "SAV garanti"  },
];

// ── Zones d'intervention ────────────────────────────────────────────────────
export const ZONES: Zone[] = [
  { code: "32", name: "Gers",                  coords: [43.6448,  0.5853], isHQ: true },
  { code: "65", name: "Hautes-Pyrénées",        coords: [43.2333,  0.0833]             },
  { code: "40", name: "Landes",                 coords: [43.8919, -0.5066]             },
  { code: "64", name: "Pyrénées-Atlantiques",   coords: [43.2951, -0.3708]             },
  { code: "47", name: "Lot-et-Garonne",         coords: [44.2044,  0.6206]             },
  { code: "81", name: "Tarn",                   coords: [43.9278,  2.1472]             },
  { code: "31", name: "Haute-Garonne",          coords: [43.6047,  1.4442]             },
];

// ── Services ────────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    id: "ventilation",
    icon: "Wind",
    title: "Ventilation",
    description:
      "Systèmes de ventilation dynamique et statique pour bâtiments avicoles. Régulation thermique, gestion de l'humidité et qualité de l'air optimal pour le bien-être de vos pondeuses.",
    features: [
      "Ventilateurs & turbines haute performance",
      "Entrées d'air motorisées et automatisées",
      "Automates de régulation climatique",
    ],
    variant: "default",
  },
  {
    id: "equipement",
    icon: "Building2",
    title: "Équipement bâtiment",
    description:
      "Équipements complets pour bâtiments de poules pondeuses en cage aménagée ou en système alternatif : alimentation automatique, abreuvement, éclairage et nidification.",
    features: [
      "Cages aménagées & volières",
      "Chaînes d'alimentation automatiques",
      "Ramassage automatique des œufs",
    ],
    variant: "default",
  },
  {
    id: "installation",
    icon: "Wrench",
    title: "Installation complète",
    description:
      "Prise en charge totale de votre projet d'équipement : étude technique, fourniture du matériel, pose professionnelle et mise en service, avec accompagnement sur la durée.",
    features: [
      "Étude & dimensionnement sur mesure",
      "Fourniture & pose par nos techniciens",
      "Mise en service & formation de l'éleveur",
    ],
    variant: "featured",
  },
  {
    id: "sav",
    icon: "Settings",
    title: "SAV & Maintenance",
    description:
      "Notre service après-vente est notre priorité absolue. Intervention rapide, pièces de rechange disponibles et contrats de maintenance préventive pour éviter toute interruption.",
    features: [
      "Intervention garantie sous 24h",
      "Stock de pièces détachées disponibles",
      "Contrats de maintenance préventive",
    ],
    variant: "default",
  },
];

// ── Partenaires ─────────────────────────────────────────────────────────────
export const PARTNERS: Partner[] = [
  { name: "Big Dutchman", tagline: "Leader mondial avicole",      colorBg: "bg-primary-50",   colorIcon: "text-primary"      },
  { name: "Roxell",       tagline: "Alimentation & abreuvement",  colorBg: "bg-secondary-50", colorIcon: "text-secondary"    },
  { name: "SKOV",         tagline: "Climatisation bâtiments",     colorBg: "bg-accent-50",    colorIcon: "text-accent-dark"  },
  { name: "Fancom",       tagline: "Automatisation élevage",      colorBg: "bg-primary-50",   colorIcon: "text-primary"      },
  { name: "Hellmann",     tagline: "Équipements alternatifs",     colorBg: "bg-secondary-50", colorIcon: "text-secondary"    },
  { name: "Tecno Poultry",tagline: "Solutions intégrées",         colorBg: "bg-accent-50",    colorIcon: "text-accent-dark"  },
];

// ── Réalisations ─────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    title:        "Élevage 20 000 pondeuses — Auch",
    location:     "Auch",
    departement:  "Gers",
    code:         "32",
    description:
      "Renouvellement complet de la ventilation dynamique et installation d'un système d'alimentation automatique Big Dutchman pour 4 bâtiments de production.",
    tags:         ["Ventilation", "Alimentation auto"],
    category:     "installation",
    gradientFrom: "from-primary/80",
    gradientTo:   "to-secondary/70",
  },
  {
    title:        "Mise aux normes ventilation — Mont-de-Marsan",
    location:     "Mont-de-Marsan",
    departement:  "Landes",
    code:         "40",
    description:
      "Remplacement de l'ensemble des ventilateurs et installation d'un automate SKOV pour la gestion climatique optimale de 2 bâtiments de 15 000 poules.",
    tags:         ["Ventilation", "Automates SKOV"],
    category:     "ventilation",
    gradientFrom: "from-secondary/80",
    gradientTo:   "to-primary/70",
  },
  {
    title:        "Intervention d'urgence — Toulouse Sud",
    location:     "Toulouse Sud",
    departement:  "Haute-Garonne",
    code:         "31",
    description:
      "Diagnostic et remplacement d'un automate de ventilation en panne en moins de 12h pour éviter toute perte sur un élevage de 30 000 pondeuses en plein été.",
    tags:         ["SAV Urgence", "Automates"],
    category:     "sav",
    gradientFrom: "from-accent/70",
    gradientTo:   "to-primary/80",
  },
];

// ── Infos contact ─────────────────────────────────────────────────────────────
export const CONTACT_INFO = {
  phone:   "05 XX XX XX XX",
  email:   "contact@meb32.fr",
  address: "Gers (32) — Sud-Ouest France",
  siret:   "XX XXX XXX XXXXX",
  hours:   "Lun–Ven 8h–18h · SAV urgent 7j/7",
};

// ── Catégories labels & couleurs ─────────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  installation: "Installation complète",
  ventilation:  "Ventilation & automates",
  sav:          "SAV d'urgence",
  equipement:   "Équipement bâtiment",
};

export const CATEGORY_COLORS: Record<string, string> = {
  installation: "bg-accent text-white",
  ventilation:  "bg-secondary text-white",
  sav:          "bg-primary text-white",
  equipement:   "bg-primary-50 text-primary",
};
