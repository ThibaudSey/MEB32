import { STATS } from "@/lib/data";

export default function Stats() {
  return (
    <section id="stats" aria-label="Chiffres clés MEB32" className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-white/10 lg:divide-x lg:divide-white/15">
          {STATS.map(({ value, label, sublabel }) => (
            <div
              key={value}
              className="flex flex-col items-center justify-center text-center py-8 px-4 lg:px-8"
            >
              <dt className="font-heading font-extrabold text-3xl sm:text-4xl text-accent leading-none">
                {value}
              </dt>
              <dd className="text-white/70 text-sm font-body mt-2 leading-snug">
                {label}
                <br />
                {sublabel}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
