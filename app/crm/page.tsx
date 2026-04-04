'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Projet, type Alerte, type EvenementCalendrier } from '@/lib/supabase'

const STATUT_LABELS: Record<string, string> = {
  'prérempli': 'Pré-rempli',
  'r1_validé': 'R1 validé',
  'en_cours': 'En cours',
  'specs_complètes': 'Specs complètes',
  'devis_généré': 'Devis généré',
  'devis_envoyé': 'Devis envoyé',
  'validé': 'Validé',
  'livré': 'Livré',
  'facturé': 'Facturé',
  'archivé': 'Archivé',
}

const STATUT_COLORS: Record<string, string> = {
  'prérempli': 'bg-gray-100 text-gray-600',
  'r1_validé': 'bg-blue-100 text-blue-700',
  'en_cours': 'bg-yellow-100 text-yellow-700',
  'specs_complètes': 'bg-indigo-100 text-indigo-700',
  'devis_généré': 'bg-purple-100 text-purple-700',
  'devis_envoyé': 'bg-orange-100 text-orange-700',
  'validé': 'bg-green-100 text-green-700',
  'livré': 'bg-teal-100 text-teal-700',
  'facturé': 'bg-emerald-100 text-emerald-700',
  'archivé': 'bg-gray-100 text-gray-400',
}

const ALERTE_COLORS: Record<string, string> = {
  'devis_retard': 'bg-red-50 border-red-200 text-red-700',
  'specs_incomplète': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  'rdv_demain': 'bg-blue-50 border-blue-200 text-blue-700',
  'fournisseur_lent': 'bg-orange-50 border-orange-200 text-orange-700',
  'autre': 'bg-gray-50 border-gray-200 text-gray-700',
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${value >= 80 ? 'bg-green-500' : value >= 40 ? 'bg-blue-500' : 'bg-gray-400'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function DashboardPage() {
  const [projets, setProjets] = useState<Projet[]>([])
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [rdvDuJour, setRdvDuJour] = useState<EvenementCalendrier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      const today = new Date().toISOString().split('T')[0]

      const [projetsRes, alertesRes, rdvRes] = await Promise.all([
        supabase
          .from('projets')
          .select('*')
          .neq('statut', 'archivé')
          .order('date_modification', { ascending: false }),
        supabase
          .from('alertes')
          .select('*')
          .eq('statut', 'non_lue')
          .order('priorité', { ascending: true }),
        supabase
          .from('événements_calendrier')
          .select('*')
          .eq('date_événement', today)
          .order('heure_événement', { ascending: true }),
      ])

      if (projetsRes.error) setError(projetsRes.error.message)
      else setProjets(projetsRes.data ?? [])

      setAlertes(alertesRes.data ?? [])
      setRdvDuJour(rdvRes.data ?? [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Erreur Supabase : {error}
        </div>
      </div>
    )
  }

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{todayStr}</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Projets actifs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{projets.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Alertes actives</p>
          <p className={`text-3xl font-bold mt-1 ${alertes.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {alertes.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">RDV aujourd'hui</p>
          <p className={`text-3xl font-bold mt-1 ${rdvDuJour.length > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
            {rdvDuJour.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Liste projets */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Projets</h2>
              <span className="text-xs text-gray-400">{projets.length} actifs</span>
            </div>

            {projets.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Aucun projet actif</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {projets.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/crm/projets/${p.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Nom + statut */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                            {p.nom_projet}
                          </span>
                          <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COLORS[p.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                            {STATUT_LABELS[p.statut] ?? p.statut}
                          </span>
                        </div>
                        <ProgressBar value={p.progression} />
                      </div>
                      {/* Progression % */}
                      <span className="text-sm font-semibold text-gray-500 flex-shrink-0 w-10 text-right">
                        {p.progression}%
                      </span>
                      {/* Flèche */}
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne droite : alertes + RDV */}
        <div className="space-y-4">
          {/* Alertes */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Alertes</h2>
            </div>
            {alertes.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-xs">Aucune alerte</div>
            ) : (
              <ul className="p-3 space-y-2">
                {alertes.slice(0, 5).map((a) => (
                  <li
                    key={a.id}
                    className={`border rounded-lg px-3 py-2 text-xs ${ALERTE_COLORS[a.type] ?? 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    {a.message}
                  </li>
                ))}
                {alertes.length > 5 && (
                  <p className="text-xs text-center text-gray-400">+{alertes.length - 5} autres</p>
                )}
              </ul>
            )}
          </div>

          {/* RDV du jour */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">RDV du jour</h2>
            </div>
            {rdvDuJour.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-xs">Aucun RDV aujourd'hui</div>
            ) : (
              <ul className="p-3 space-y-2">
                {rdvDuJour.map((e) => (
                  <li key={e.id} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-blue-800">{e.titre}</p>
                    {e.heure_événement && (
                      <p className="text-xs text-blue-500 mt-0.5">
                        {e.heure_événement.slice(0, 5)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
