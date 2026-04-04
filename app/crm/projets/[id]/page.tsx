'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Projet, type Task, type SpecProjet, type Devis } from '@/lib/supabase'

const STATUT_TASK_COLORS: Record<string, string> = {
  'bloquée': 'bg-red-100 text-red-700',
  'en_attente': 'bg-yellow-100 text-yellow-700',
  'en_cours': 'bg-blue-100 text-blue-700',
  'complétée': 'bg-green-100 text-green-700',
  'annulée': 'bg-gray-100 text-gray-400',
}

const STATUT_DEVIS_COLORS: Record<string, string> = {
  'en_attente': 'bg-gray-100 text-gray-600',
  'reçu': 'bg-blue-100 text-blue-700',
  'validé': 'bg-green-100 text-green-700',
  'rejeté': 'bg-red-100 text-red-700',
  'envoyé_client': 'bg-purple-100 text-purple-700',
  'accepté': 'bg-emerald-100 text-emerald-700',
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${value >= 80 ? 'bg-green-500' : value >= 40 ? 'bg-blue-500' : 'bg-gray-400'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function ProjetDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [projet, setProjet] = useState<Projet | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [specs, setSpecs] = useState<SpecProjet[]>([])
  const [devis, setDevis] = useState<Devis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      const [projetRes, tasksRes, specsRes, devisRes] = await Promise.all([
        supabase.from('projets').select('*').eq('id', id).single(),
        supabase.from('tasks').select('*').eq('project_id', id).order('priorité', { ascending: true }),
        supabase.from('specs_projet').select('*').eq('project_id', id),
        supabase.from('devis').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])

      if (projetRes.error) {
        setError(projetRes.error.message)
        setLoading(false)
        return
      }

      setProjet(projetRes.data)
      setTasks(tasksRes.data ?? [])
      setSpecs(specsRes.data ?? [])
      setDevis(devisRes.data ?? [])
      setLoading(false)
    }

    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    )
  }

  if (error || !projet) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error ?? 'Projet introuvable'}
        </div>
      </div>
    )
  }

  // Calcul avancement specs
  const totalSpecs = specs.length
  const specsCompletes = specs.filter((s) => s.complété).length
  const specsPercent = totalSpecs > 0 ? Math.round((specsCompletes / totalSpecs) * 100) : 0

  // Devis reçus
  const devisRecus = devis.filter((d) => ['reçu', 'validé', 'accepté'].includes(d.statut))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/crm" className="hover:text-gray-700 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{projet.nom_projet}</span>
      </div>

      {/* Header projet */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{projet.nom_projet}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Client #{projet.client_num_sage} · {projet.template_type}</p>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 flex-shrink-0">
            {projet.statut}
          </span>
        </div>

        {/* Progression globale */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span className="font-semibold">{projet.progression}%</span>
          </div>
          <ProgressBar value={projet.progression} />
        </div>

        {/* Liens Drive */}
        <div className="mt-4 flex flex-wrap gap-2">
          {projet.r1_url_drive && (
            <a
              href={projet.r1_url_drive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              R1 Drive
            </a>
          )}
          {projet.fiche_suivi_url_drive && (
            <a
              href={projet.fiche_suivi_url_drive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Fiche suivi
            </a>
          )}
          {projet.dossier_drive && (
            <a
              href={projet.dossier_drive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Dossier Drive
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Tâches</h2>
            <span className="text-xs text-gray-400">{tasks.filter(t => t.statut !== 'complétée' && t.statut !== 'annulée').length} actives</span>
          </div>
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Aucune tâche</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {tasks.map((t) => (
                <li key={t.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{t.titre}</p>
                    {t.date_limite && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Échéance : {new Date(t.date_limite).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUT_TASK_COLORS[t.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                    {t.statut}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Specs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Specs</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{specsPercent}%</span>
              <Link
                href={`/crm/projets/${id}/specs`}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Éditer →
              </Link>
            </div>
          </div>

          <div className="px-5 py-3">
            <ProgressBar value={specsPercent} />
            <p className="text-xs text-gray-400 mt-1">{specsCompletes}/{totalSpecs} champs renseignés</p>
          </div>

          {totalSpecs > 0 && (
            <div className="px-5 pb-4">
              {(['alimentation', 'abreuvement', 'structure'] as const).map((section) => {
                const sectionSpecs = specs.filter((s) => s.section === section)
                if (sectionSpecs.length === 0) return null
                const done = sectionSpecs.filter((s) => s.complété).length
                return (
                  <div key={section} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600 capitalize">{section}</span>
                      <span className="text-gray-400">{done}/{sectionSpecs.length}</span>
                    </div>
                    <ProgressBar value={sectionSpecs.length > 0 ? Math.round((done / sectionSpecs.length) * 100) : 0} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Devis */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Devis</h2>
            <span className="text-xs text-gray-400">{devisRecus.length} reçu(s) sur {devis.length}</span>
          </div>
          {devis.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">Aucun devis</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Fournisseur</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-gray-500">Montant</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Statut</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">Réception</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {devis.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{d.fournisseur}</td>
                      <td className="px-5 py-3 text-gray-500">{d.type_devis}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">
                        {d.montant.toLocaleString('fr-FR', { style: 'currency', currency: d.devise ?? 'EUR' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_DEVIS_COLORS[d.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                          {d.statut}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {d.date_réception
                          ? new Date(d.date_réception).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
