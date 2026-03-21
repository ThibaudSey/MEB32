"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { ZONES, CONTACT_INFO } from "@/lib/data";
import type { ContactFormValues } from "@/types";
import clsx from "clsx";

// ── Validation schema ──────────────────────────────────────────────────────
const schema = z.object({
  nom: z
    .string()
    .min(2,  "Nom requis (minimum 2 caractères)")
    .max(80, "Nom trop long"),
  email: z
    .string()
    .email("Adresse email invalide"),
  telephone: z
    .string()
    .regex(
      /^(\+33\s?|0)[1-9](\s?\d{2}){4}$/,
      "Téléphone invalide (ex : 06 12 34 56 78)"
    ),
  departement: z.string().optional(),
  sujet:       z.string().optional(),
  message: z
    .string()
    .min(20,   "Message trop court (minimum 20 caractères)")
    .max(1000, "Message trop long (maximum 1000 caractères)"),
});

// ── Field wrapper ──────────────────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5 font-heading">
        {label}
        {required && <span className="text-accent ml-1" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase = "input-base";
const inputErr  = "input-error";

// ── Component ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: ContactFormValues) => {
    // 🔌 Replace with your real API call:
    //   await fetch('/api/contact', { method: 'POST', body: JSON.stringify(_data) })
    //   or: await fetch('https://formspree.io/f/YOUR_ID', { ... })
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    reset();
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-primary py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Blobs */}
      <div aria-hidden className="absolute top-0 right-0 w-96 h-96 bg-white/5  rounded-full -translate-y-48  translate-x-48  pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full  translate-y-32  -translate-x-32 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label-accent">Contact</span>
          <h2
            id="contact-title"
            className="font-heading font-bold text-white text-3xl sm:text-4xl mb-4"
          >
            Parlons de votre projet
          </h2>
          <p className="text-white/70 font-body text-base max-w-xl mx-auto">
            Devis gratuit, questions techniques ou urgence SAV — notre équipe
            vous répond sous 24h ouvrées.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulaire de contact MEB32"
            className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            {/* Row 1 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Nom & Prénom" required error={errors.nom?.message}>
                <input
                  {...register("nom")}
                  type="text"
                  autoComplete="name"
                  placeholder="Jean Dupont"
                  className={clsx(inputBase, errors.nom && inputErr)}
                  aria-required
                />
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="jean@exploitation.fr"
                  className={clsx(inputBase, errors.email && inputErr)}
                  aria-required
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Téléphone" required error={errors.telephone?.message}>
                <input
                  {...register("telephone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  className={clsx(inputBase, errors.telephone && inputErr)}
                  aria-required
                />
              </Field>
              <Field label="Département" error={errors.departement?.message}>
                <select
                  {...register("departement")}
                  className={clsx(inputBase, "cursor-pointer")}
                >
                  <option value="">Sélectionner…</option>
                  {ZONES.map((z) => (
                    <option key={z.code} value={z.code}>
                      {z.code} – {z.name}
                    </option>
                  ))}
                  <option value="autre">Autre département</option>
                </select>
              </Field>
            </div>

            {/* Sujet */}
            <div className="mb-4">
              <Field label="Objet de la demande" error={errors.sujet?.message}>
                <select
                  {...register("sujet")}
                  className={clsx(inputBase, "cursor-pointer")}
                >
                  <option value="">Type de demande…</option>
                  <option value="devis">Demande de devis</option>
                  <option value="ventilation">Ventilation bâtiment</option>
                  <option value="equipement">Équipement bâtiment</option>
                  <option value="installation">Installation complète</option>
                  <option value="sav">SAV & Maintenance</option>
                  <option value="urgence">Urgence technique</option>
                  <option value="autre">Autre</option>
                </select>
              </Field>
            </div>

            {/* Message */}
            <div className="mb-6">
              <Field label="Message" required error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Décrivez votre projet ou besoin : type de bâtiment, nombre de pondeuses, problème rencontré…"
                  className={clsx(inputBase, "resize-none", errors.message && inputErr)}
                  aria-required
                />
              </Field>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer hover:shadow-cta"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                    aria-hidden
                  />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" aria-hidden />
                  Envoyer ma demande
                </>
              )}
            </button>

            {/* Success */}
            {sent && (
              <div
                role="alert"
                className="mt-4 flex items-center gap-2 bg-secondary-50 border border-secondary-100 text-secondary-dark text-sm font-semibold rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden />
                Votre message a bien été envoyé. Nous vous recontacterons sous 24h.
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400 font-body text-center">
              Réponse garantie sous 24h ouvrées · Devis gratuit et sans engagement
            </p>
          </form>

          {/* ── Info sidebar ── */}
          <div className="lg:col-span-2 space-y-4">

            {[
              {
                Icon: Phone,
                label: "Téléphone",
                content: (
                  <>
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                      className="text-white font-heading font-semibold text-lg hover:text-accent transition-colors cursor-pointer block"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                    <p className="text-white/50 text-xs font-body mt-0.5">{CONTACT_INFO.hours}</p>
                  </>
                ),
              },
              {
                Icon: Mail,
                label: "Email",
                content: (
                  <>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-white font-heading font-semibold hover:text-accent transition-colors cursor-pointer block"
                    >
                      {CONTACT_INFO.email}
                    </a>
                    <p className="text-white/50 text-xs font-body mt-0.5">Réponse sous 24h ouvrées</p>
                  </>
                ),
              },
              {
                Icon: MapPin,
                label: "Adresse",
                content: (
                  <>
                    <p className="text-white font-heading font-semibold">MEB32</p>
                    <p className="text-white/70 text-sm font-body">{CONTACT_INFO.address}</p>
                  </>
                ),
              },
            ].map(({ Icon, label, content }) => (
              <div
                key={label}
                className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" aria-hidden />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-body uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    {content}
                  </div>
                </div>
              </div>
            ))}

            {/* Zones pills */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-white/50 text-xs font-body uppercase tracking-wide mb-3">
                Zones couvertes
              </p>
              <div className="flex flex-wrap gap-2">
                {ZONES.map((z) => (
                  <span
                    key={z.code}
                    className="bg-white/15 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {z.code} {z.name.split("-")[0].split("é")[0].trim()}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
