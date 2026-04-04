'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type SpecProjet } from '@/lib/supabase'

// Définition des champs par section
const SPEC_FIELDS: Record<string, { champ: string; label: string; type?: 'text' | 'number' | 'textarea' }[]> = {
  alimentation: [
    { champ: 'type_alimentation', label: "Type d'alimentation" },
    { champ: 'nb_silos', label: 'Nombre de silos', type: 'number' },
    { champ: 'capacite_silo_tonnes', label: 'Capacité silo (tonnes)', type: 'number' },
    { champ: 'type_chaine', label: 'Type de chaîne' },
    { champ: 'nb_lignes', label: 'Nombre de lignes', type: 'number' },
    { champ: 'marque_materiel', label: 'Marque matériel' },
    { champ: 'notes_alimentation', label: 'Notes', type: 'textarea' },
  ],
  abreuvement: [
    { champ: 'type_abreuvement', label: "Type d'abreuvement" },
    { champ: 'nb_lignes_eau', label: 'Nombre de lignes eau', type: 'number' },
    { champ: 'type_pipette', label: 'Type de pipette' },
    { champ: 'traitement_eau', label: "Traitement de l'eau" },
    { champ: 'debit_horaire', label: 'Débit horaire (L/h)', type: 'number' },
    { champ: 'notes_abreuvement', label: 'Notes', type: 'textarea' },
  ],
  structure: [
    { champ: 'longueur_m', label: 'Longueur (m)', type: 'number' },
    { champ: 'largeur_m', label: 'Largeur (m)', type: 'number' },
    { champ: 'hauteur_m', label: 'Hauteur (m)', type: 'number' },
    { champ: 'type_sol', label: 'Type de sol' },
    { champ: 'type_ventilation', label: 'Type de ventilation' },
    { champ: 'nb_ventilateurs', label: 'Nombre de ventilateurs', type: 'number' },
    { champ: 'chauffage', label: 'Chauffage' },
    { champ: 'isolation', label: 'Isolation' },
    { champ: 'notes_structure', label: 'Notes', type: 'textarea' },
  ],
}

const SECTIONS = ['alimentation', 'abreuvement', 'structure'] as const
type Section = typeof SECTIONS[number]

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function SpecsPage() {
  const params = useParams()
  const id = params.id as string

  const [specs, setSpecs] = useState<Record<string, string>>({})  // champ -> valeur
  const [specsIds, setSpecsIds] = useState<Record<string, string>>({}) // champ -> id en base
  const [activeSection, setActiveSection] = useState<Section>('alimentation')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [loading, setLoading] = useState(true)
  const [projetNom, setProjetNom] = useState('')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Charger les specs existantes
  useEffect(() => {
    async function load() {
      setLoading(true)

      const [projetRes, specsRes] = await Promise.all([
        supabase.from('projets').select('nom_projet').eq('id', id).single(),
        supabase.from('specs_projet').select('*').eq('project_id', id),
      ])

      if (projetRes.data) setProjetNom(projetRes.data.nom_projet)

      if (specsRes.data) {
        const vals: Record<string, string> = {}
        const ids: Record<string, string> = {}
        for (const spec of specsRes.data as SpecProjet[]) {
          vals[spec.champ] = spec.valeur ?? ''
          ids[spec.champ] = spec.id
        }
        setSpecs(vals)
        setSpecsIds(ids)
      }

      setLoading(false)
    }

    if (id) load()
  }, [id])

  // Auto-save avec debounce 800ms
  const autoSave = useCallback(
    async (champ: string, valeur: string, section: Section) => {
      setSaveStatus('saving')
      const existingId = specsIds[champ]

      if (existingId) {
        // UPDATE
        const { error } = await supabase
          .from('specs_projet')
          .update({
            valeur,
            complété: valeur.trim().length > 0,
            date_saisie: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingId)

        if (error) {
          setSaveStatus('error')
          return
        }
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('specs_projet')
          .insert({
            project_id: id,
            section,
            champ,
            valeur,
            complété: valeur.trim().length > 0,
            date_saisie: new Date().toISOString(),
          })
          .select('id')
          .single()

        if (error) {
          setSaveStatus('error')
          return
        }

        if (data) {
          setSpecsIds((prev) => ({ ...prev, [champ]: data.id }))
        }
      }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    },
    [id, specsIds]
  )

  function handleChange(champ: string, valeur: string, section: Section) {
    setSpecs((prev) => ({ ...prev, [champ]: valeur }))

    // Debounce auto-save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      autoSave(champ, valeur, section)
    }, 800)
  }

  // Calcul progression par section
  function sectionProgress(section: Section) {
    const fields = SPEC_FIELDS[section]
    const filled = fields.filter((f) => (specs[f.champ] ?? '').trim().length > 0).length
    return { filled, total: fields.length, pct: Math.round((filled / fields.length) * 100) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/crm" className="hover:text-gray-700 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/crm/projets/${id}`} className="hover:text-gray-700 transition-colors">{projetNom || 'Projet'}</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Specs</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Fiche specs</h1>
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && (
            <span className="text-gray-400 flex items-center gap-1">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sauvegarde…
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sauvegardé
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600 text-xs">Erreur de sauvegarde</span>
          )}
        </div>
      </div>

      {/* Onglets sections */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        {SECTIONS.map((section) => {
          const { filled, total, pct } = sectionProgress(section)
          return (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex-1 flex flex-col items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === section
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="capitalize">{section}</span>
              <span className={`text-xs mt-0.5 ${pct === 100 ? 'text-green-600' : 'text-gray-400'}`}>
                {filled}/{total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Champs de la section active */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid grid-cols-2 gap-4">
          {SPEC_FIELDS[activeSection].map((field) => (
            <div
              key={field.champ}
              className={field.type === 'textarea' ? 'col-span-2' : ''}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {field.label}
                {(specs[field.champ] ?? '').trim().length > 0 && (
                  <svg className="inline w-3 h-3 ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={specs[field.champ] ?? ''}
                  onChange={(e) => handleChange(field.champ, e.target.value, activeSection)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="…"
                />
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={specs[field.champ] ?? ''}
                  onChange={(e) => handleChange(field.champ, e.target.value, activeSection)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="…"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Résumé global */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {SECTIONS.map((section) => {
          const { filled, total, pct } = sectionProgress(section)
          return (
            <div key={section} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 capitalize mb-2">{section}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                <div
                  className={`h-1.5 rounded-full ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{filled}/{total} champs</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
