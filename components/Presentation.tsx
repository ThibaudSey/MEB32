import {
  ShieldCheck,
  MapPin,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Expertise reconnue",
    desc: "30 ans d'expérience terrain et des centaines d'installations réussies dans la région.",
    color: "primary" as const,
  },
  {
    Icon: MapPin,
    title: "Proximité locale",
    desc: "Basé dans le Gers, nous intervenons rapidement sur 7 départements du Sud-Ouest.",
    color: "secondary" as const,
  },
  {
    Icon: Users,
    title: "Équipe dédiée",
    desc: "Techniciens formés par les constructeurs, au service exclusif de l'aviculture professionnelle.",
    color: "primary" as const,
  },
  {
    Icon: BarChart3,
    title: "Solutions sur mesure",
    desc: "Chaque élevage est unique. Nous dimensionnons chaque projet selon vos besoins précis.",
    color: "secondary" as const,
  },
] as const;

export default function Presentation() {
  return (
    <section
      id="presentation"
      aria-labelledby="presentation-title"
      className="bg-white py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Story ── */}
          <div>
            <span className="section-label">Notre histoire</span>
            <h2
              id="presentation-title"
              className="font-heading font-bold text-primary text-3xl sm:text-4xl leading-tight mb-6"
            >
              30 ans au service des<br />éleveurs du Sud-Ouest
            </h2>

            <div className="space-y-4 text-gray-600 font-body text-base leading-relaxed">
              <p>
                Fondée en 1994 dans le Gers,{" "}
                <strong className="text-primary font-semibold">MEB32</strong>{" "}
                accompagne les éleveurs avicoles professionnels dans l'équipement,
                l'installation et la maintenance de leurs bâtiments pour poules
                pondeuses.
              </p>
              <p>
                Notre connaissance terrain du secteur avicole du Sud-Ouest, combinée
                à des partenariats avec les plus grands fabricants mondiaux, nous
                permet de proposer des solutions adaptées à chaque exploitation —
                quelle que soit sa taille.
              </p>
              <p>
                Notre engagement : une réponse rapide, un suivi personnalisé et un{" "}
                <strong className="text-primary font-semibold">
                  service après-vente ultra-réactif
                </strong>{" "}
                qui garantit la continuité de votre production en toutes circonstances.
              </p>
            </div>

            {/* SAV highlight box */}
            <div className="mt-8 flex items-start gap-3 p-4 bg-accent-50 border border-accent-100 rounded-xl">
              <Zap className="w-5 h-5 text-accent-dark mt-0.5 flex-shrink-0" aria-hidden />
              <div>
                <p className="font-heading font-semibold text-primary text-sm">
                  SAV ultra-réactif — notre priorité absolue
                </p>
                <p className="text-gray-600 text-sm font-body mt-0.5 leading-relaxed">
                  Un problème en élevage n'attend pas. Notre équipe intervient
                  dans les{" "}
                  <strong className="text-primary">24 heures</strong>, limitant
                  tout impact sur votre production.
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
            >
              Demander un devis gratuit
              <ArrowRight className="w-4 h-4" aria-hidden />
            </a>
          </div>

          {/* ── Values grid ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map(({ Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-primary/25 transition-colors duration-200 cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${color === "primary" ? "text-primary" : "text-secondary"}`}
                    aria-hidden
                  />
                </div>
                <h3 className="font-heading font-semibold text-primary text-base mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm font-body leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
