import {
  Building2,
  LayoutGrid,
  Wind,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { PARTNERS } from "@/lib/data";

const ICONS = [Building2, LayoutGrid, Wind, Settings, Users, FileText];

export default function Partners() {
  return (
    <section
      id="partenaires"
      aria-labelledby="partenaires-title"
      className="bg-gray-100 py-16 lg:py-20 border-y border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <span className="w-6 h-px bg-gray-400" aria-hidden />
            Nos partenaires fabricants
            <span className="w-6 h-px bg-gray-400" aria-hidden />
          </div>
          <h2
            id="partenaires-title"
            className="font-heading font-bold text-primary text-2xl sm:text-3xl"
          >
            Les meilleures marques mondiales
          </h2>
          <p className="text-gray-500 font-body text-sm mt-2 max-w-md mx-auto">
            Revendeur et installateur agréé des équipements de référence en
            aviculture intensive et alternative.
          </p>
        </div>

        {/* Logo grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          role="list"
          aria-label="Marques partenaires"
        >
          {PARTNERS.map((partner, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={partner.name}
                role="listitem"
                className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center border border-gray-200 cursor-default grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 ${partner.colorBg} rounded-lg flex items-center justify-center mb-2`}
                >
                  <Icon className={`w-5 h-5 ${partner.colorIcon}`} aria-hidden />
                </div>
                <span className="font-heading font-bold text-gray-700 text-xs text-center block leading-tight">
                  {partner.name}
                </span>
                <span className="text-gray-400 text-[10px] font-body text-center block mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {partner.tagline}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
