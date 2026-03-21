import {
  Wind,
  Building2,
  Wrench,
  Settings,
  CheckCircle2,
  Star,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "@/lib/data";
import type { Service } from "@/types";
import clsx from "clsx";

const ICON_MAP: Record<string, React.ElementType> = {
  Wind,
  Building2,
  Wrench,
  Settings,
};

// Colour config per service id
const ICON_BG: Record<string, string> = {
  ventilation: "bg-primary/10",
  equipement:  "bg-secondary/10",
  installation:"bg-white/15",
  sav:         "bg-accent/10",
};
const ICON_COLOR: Record<string, string> = {
  ventilation: "text-primary",
  equipement:  "text-secondary",
  installation:"text-white",
  sav:         "text-accent-dark",
};
const CHECK_COLOR: Record<string, string> = {
  ventilation: "text-secondary",
  equipement:  "text-secondary",
  installation:"text-accent",
  sav:         "text-accent-dark",
};

function ServiceCard({ s }: { s: Service }) {
  const Icon     = ICON_MAP[s.icon];
  const featured = s.variant === "featured";

  return (
    <article
      className={clsx(
        "relative rounded-2xl p-6 border overflow-hidden shadow-card",
        "transition-all duration-250 hover:-translate-y-1 hover:shadow-hover cursor-default",
        featured ? "bg-primary border-primary" : "bg-white border-gray-200"
      )}
    >
      {featured && (
        <>
          {/* Decorative circle */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none"
          />
          {/* Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3" aria-hidden />
            Clé en main
          </div>
        </>
      )}

      {/* Icon */}
      <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-5", ICON_BG[s.id])}>
        <Icon className={clsx("w-7 h-7", ICON_COLOR[s.id])} aria-hidden />
      </div>

      {/* Title */}
      <h3 className={clsx("font-heading font-bold text-lg mb-3", featured ? "text-white" : "text-primary")}>
        {s.title}
      </h3>

      {/* Description */}
      <p className={clsx("font-body text-sm leading-relaxed mb-4", featured ? "text-white/80" : "text-gray-600")}>
        {s.description}
      </p>

      {/* Features */}
      <ul className="space-y-1.5">
        {s.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2 className={clsx("w-4 h-4 mt-0.5 flex-shrink-0", CHECK_COLOR[s.id])} aria-hidden />
            <span className={clsx("text-sm font-body", featured ? "text-white/80" : "text-gray-700")}>
              {f}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">Nos prestations</span>
          <h2 id="services-title" className="font-heading font-bold text-primary text-3xl sm:text-4xl mb-4">
            Des solutions complètes pour votre élevage
          </h2>
          <p className="text-gray-600 font-body text-base leading-relaxed">
            De la conception à la maintenance, MEB32 vous accompagne à chaque étape
            pour optimiser les conditions de votre élevage avicole.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 font-body text-sm mb-4">
            Besoin d&apos;une prestation spécifique ? Parlons de votre projet.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-7 py-3 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm text-sm"
          >
            Demander un devis gratuit
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
        </div>

      </div>
    </section>
  );
}
