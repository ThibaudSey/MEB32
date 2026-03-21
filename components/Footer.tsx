import { Phone, Mail, Home } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO } from "@/lib/data";

const SERVICES_LIST = [
  "Ventilation avicole",
  "Équipement bâtiment",
  "Installation complète",
  "SAV & Maintenance",
  "Devis gratuit",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white py-12 lg:py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-white" aria-hidden />
              </span>
              <span>
                <span className="block font-heading font-extrabold text-xl text-white tracking-tight leading-none">
                  MEB<span className="text-accent">32</span>
                </span>
                <span className="text-white/40 text-xs font-body block mt-0.5">
                  Équipement Avicole
                </span>
              </span>
            </div>
            <p className="text-white/50 text-sm font-body leading-relaxed mb-4">
              Votre partenaire de confiance pour l'équipement avicole dans le
              Sud-Ouest depuis 1994.
            </p>
            <p className="text-white/25 text-xs font-body">
              SIRET : {CONTACT_INFO.siret}
            </p>
          </div>

          {/* ── Nav ── */}
          <nav aria-label="Navigation footer">
            <h3 className="font-heading font-semibold text-white/70 text-xs uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[...NAV_LINKS, { label: "Contact", href: "#contact" }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm font-body transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Services ── */}
          <div>
            <h3 className="font-heading font-semibold text-white/70 text-xs uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {SERVICES_LIST.map((s) => (
                <li key={s}>
                  <span className="text-white/50 text-sm font-body">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="font-heading font-semibold text-white/70 text-xs uppercase tracking-wider mb-4">
              Contact rapide
            </h3>
            <div className="space-y-3 mb-5">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden />
                {CONTACT_INFO.email}
              </a>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center w-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              Nous contacter
            </a>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs font-body text-center sm:text-left">
            &copy; {year} MEB32 – Équipement Avicole. Tous droits réservés.
            &nbsp;·&nbsp;Gers (32)&nbsp;·&nbsp;Sud-Ouest France
          </p>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-white/25 hover:text-white/55 text-xs font-body transition-colors cursor-pointer"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-white/25 hover:text-white/55 text-xs font-body transition-colors cursor-pointer"
            >
              Politique de confidentialité
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
