import dynamic from "next/dynamic";
import { Info } from "lucide-react";
import { ZONES } from "@/lib/data";
import clsx from "clsx";

// Leaflet cannot run server-side — dynamic import with ssr:false
const ZonesMap = dynamic(() => import("./ZonesMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[420px] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center"
      aria-label="Chargement de la carte"
    >
      <p className="text-gray-400 text-sm font-body">Chargement de la carte…</p>
    </div>
  ),
});

export default function Zones() {
  return (
    <section id="zones" aria-labelledby="zones-title" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── Left: text + badges ── */}
          <div>
            <span className="section-label">Zones d&apos;intervention</span>
            <h2
              id="zones-title"
              className="font-heading font-bold text-primary text-3xl sm:text-4xl mb-6 leading-tight"
            >
              7 départements du<br />Sud-Ouest couverts
            </h2>
            <p className="text-gray-600 font-body leading-relaxed mb-8">
              Basés dans le Gers, nous intervenons rapidement dans un rayon
              optimisé pour garantir réactivité et qualité de service sur
              l'ensemble des zones avicoles majeures du Sud-Ouest.
            </p>

            {/* Department badges */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7"
              role="list"
              aria-label="Départements couverts"
            >
              {ZONES.map((zone) => (
                <div
                  key={zone.code}
                  role="listitem"
                  className={clsx(
                    "rounded-2xl p-4 text-center shadow-card",
                    "transition-transform duration-200 hover:scale-[1.03] cursor-default",
                    zone.isHQ
                      ? "bg-primary"
                      : "bg-gray-50 border border-gray-200 hover:border-primary/25"
                  )}
                >
                  <span
                    className={clsx(
                      "font-heading font-extrabold text-2xl block leading-none",
                      zone.isHQ ? "text-accent" : "text-primary"
                    )}
                  >
                    {zone.code}
                  </span>
                  <span
                    className={clsx(
                      "font-semibold text-xs sm:text-sm mt-1 block leading-snug",
                      zone.isHQ ? "text-white" : "text-gray-800"
                    )}
                  >
                    {zone.name}
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-body mt-0.5 block",
                      zone.isHQ ? "text-white/55" : "text-gray-400"
                    )}
                  >
                    {zone.isHQ ? "Siège" : "Zone couverte"}
                  </span>
                </div>
              ))}
            </div>

            {/* Out-of-zone notice */}
            <div className="flex items-start gap-3 p-4 bg-accent-50 border border-accent-100 rounded-xl">
              <Info className="w-5 h-5 text-accent-dark mt-0.5 flex-shrink-0" aria-hidden />
              <p className="text-sm text-gray-700 font-body leading-relaxed">
                <strong className="text-primary font-semibold">Vous êtes hors zone ?</strong>{" "}
                Contactez-nous quand même — nous étudions toute demande selon la
                nature du projet.
              </p>
            </div>
          </div>

          {/* ── Right: Leaflet map ── */}
          <div>
            <ZonesMap />
            <p className="text-xs text-gray-400 font-body text-center mt-2">
              Cliquez sur un département pour les détails
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
