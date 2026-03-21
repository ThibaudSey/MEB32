import { Phone, ChevronDown, CheckCircle2 } from "lucide-react";

const TRUST_ITEMS = [
  "Devis gratuit & sans engagement",
  "SAV garanti sous 24h",
  "7 départements couverts",
];

export default function Hero() {
  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center pt-[68px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d2035 0%, #1a3550 45%, #1e3d2f 100%)",
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient blobs */}
      <div aria-hidden className="absolute top-24 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute bottom-20 right-16 w-96 h-96 bg-accent/8  rounded-full blur-3xl pointer-events-none" />

      {/* Barn silhouette */}
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-1/2 h-full"
        style={{
          background: "linear-gradient(135deg, rgba(45,106,79,.12) 0%, rgba(30,58,95,.08) 100%)",
          clipPath:
            "polygon(5% 100%,5% 40%,20% 20%,35% 40%,35% 30%,50% 10%,65% 30%,65% 40%,80% 35%,95% 45%,100% 45%,100% 100%)",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl lg:max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-7 backdrop-blur-sm">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" aria-hidden />
            Spécialiste depuis 1994 · Sud-Ouest France
          </div>

          {/* H1 */}
          <h1
            id="hero-title"
            className="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight mb-6"
          >
            Votre spécialiste en<br />
            <span className="text-accent">équipement avicole</span><br />
            depuis 1994
          </h1>

          {/* Sub */}
          <p className="text-white/75 text-lg sm:text-xl font-body leading-relaxed mb-9 max-w-xl">
            Ventilation, équipement de bâtiments pour poules pondeuses,
            installation complète et{" "}
            <strong className="text-white font-semibold">SAV réactif</strong>{" "}
            — au service des éleveurs professionnels du Sud-Ouest.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-cta hover:shadow-xl text-base cursor-pointer"
            >
              <Phone className="w-5 h-5" aria-hidden />
              Nous contacter
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm text-base cursor-pointer"
            >
              Découvrir nos services
              <ChevronDown className="w-4 h-4" aria-hidden />
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/60 text-sm font-body">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/35 hover:text-white/60 transition-colors cursor-pointer"
        aria-label="Défiler vers le bas"
      >
        <span className="text-[10px] font-body tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
