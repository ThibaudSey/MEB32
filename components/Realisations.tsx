import { MapPin, ArrowRight } from "lucide-react";
import { PROJECTS, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/data";
import clsx from "clsx";

export default function Realisations() {
  return (
    <section
      id="realisations"
      aria-labelledby="realisations-title"
      className="bg-gray-50 py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">Nos réalisations</span>
          <h2
            id="realisations-title"
            className="font-heading font-bold text-primary text-3xl sm:text-4xl mb-4"
          >
            Des projets clés en main réussis
          </h2>
          <p className="text-gray-600 font-body text-base leading-relaxed">
            Quelques exemples de nos interventions récentes dans les exploitations
            avicoles du Sud-Ouest.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-hover cursor-default"
            >
              {/* Visual header */}
              <div
                className={clsx(
                  "relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br",
                  project.gradientFrom,
                  project.gradientTo
                )}
              >
                {/* Hatching overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.07) 10px,rgba(255,255,255,.07) 20px)",
                  }}
                />
                {/* Barn icon */}
                <div className="relative z-10 text-center text-white">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-8 h-8 opacity-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 22V12h6v10"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold opacity-75">
                    {project.departement} ({project.code})
                  </p>
                </div>
                {/* Category badge */}
                <span
                  className={clsx(
                    "absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full",
                    CATEGORY_COLORS[project.category]
                  )}
                >
                  {CATEGORY_LABELS[project.category]}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden />
                  <span className="text-gray-400 text-xs font-body">{project.location}</span>
                </div>
                <h3 className="font-heading font-bold text-primary text-base mb-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-50 text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Dép. {project.code}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm"
          >
            Discuter de votre projet
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
        </div>

      </div>
    </section>
  );
}
