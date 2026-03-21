export interface Zone {
  code: string;
  name: string;
  coords: [number, number];
  isHQ?: boolean;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  variant?: "default" | "featured";
}

export interface Partner {
  name: string;
  tagline: string;
  colorBg: string;
  colorIcon: string;
}

export interface Project {
  title: string;
  location: string;
  departement: string;
  code: string;
  description: string;
  tags: string[];
  category: "installation" | "ventilation" | "sav" | "equipement";
  gradientFrom: string;
  gradientTo: string;
}

export interface ContactFormValues {
  nom: string;
  email: string;
  telephone: string;
  departement: string;
  sujet: string;
  message: string;
}

export interface Stat {
  value: string;
  label: string;
  sublabel: string;
}

export interface NavLink {
  label: string;
  href: string;
}
