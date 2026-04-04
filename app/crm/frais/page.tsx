'use client'

import { useEffect, useState } from 'react'
import { supabase, type Frais } from '@/lib/supabase'

type ProjetMinimal = { id: string; nom_projet: string }

const TYPE_LABELS: Record<string, string> = {
  km: 'Kilométrage',
  repas: 'Repas',
  parking: 'Parking',
  carburant: 'Carburant',
  autre: 'Autre',
}

const TYPE_COLORS: Record<string, string> = {
  km: 'bg-blue-100 text-blue-700',
  repas: 'bg-orange-100 text-orange-700',
  parking: 'bg-purple-100 text-purple-700',
  carburant: 'bg-yellow-100 text-yellow-700',
  autre: 'bg-gray-100 text-gray-600',
}

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  type: 'km' as Frais['type'],
  montant: '',
  description: '',
  project_id: '',
}

export default function FraisPage() {
  const [frais, setFrais] = useState<Frais[]>([])
  const [projets, setProjets] = useState<ProjetMinimal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [filterProject, setFilterProject] = useState('')

  async function loadFrais() {
    const query = supabase
      .from('frais')
      .select('*')
      .order('date', { ascending: false })

    if (filterProject) {
      query.eq('project_id', filterProject)
    }

    const { data } = await query
    setFrais(data ?? [])
  }

  useEffect(() => {
    async function init() {
      setLoading(true)
      const [fraisRes, projetsRes] = await Promise.all([
        supabase.from('frais').select('*').order('date', { ascending: false }),
        supabase.from('projets').select('id, nom_projet').order('nom_projet'),
      ])
      setFrais(fraisRes.data ?? [])
      setProjets(projetsRes.data ?? [])
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!loading) loadFrais()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProject])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.montant || parseFloat(form.montant) <= 0) return

    setSaving(true)
    setSaveError(null)

    const { error } = await supabase.from('frais').insert({
      date: form.date,
      type: form.type,
      montant: parseFloat(form.montant),
      description: form.description || null,
      project_id: form.project_id || null,
    })

    if (error) {
      setSaveError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setShowForm(false)
    setForm(EMPTY_FORM)
    loadFrais()
  }

  // Calcul totaux
  const total = frais.reduce((sum, f) => sum + f.montant, 0)
  const totalParType = frais.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] ?? 0) + f.montant
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique frais</h1>
          <p className="text-sm text-gray-500 mt-0.5">{frais.length} entrée(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Totaux par type */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-base font-bold text-gray-900 mt-1">
              {(totalParType[type] ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>

      {/* Total général */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-blue-800">Total {filterProject ? 'sur ce projet' : 'général'}</span>
        <span className="text-xl font-bold text-blue-900">
          {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>

      {/* Filtre projet */}
      <div className="mb-4">
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les projets</option>
          {projets.map((p) => (
            <option key={p.id} value={p.id}>{p.nom_projet}</option>
          ))}
        </select>
      </div>

      {/* Table frais */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {frais.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Aucun frais enregistré</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Description</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Projet</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {frais.map((f) => {
                const projet = projets.find((p) => p.id === f.project_id)
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(f.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[f.type] ?? 'bg-gray-100 text-gray-500'}`}>
                        {TYPE_LABELS[f.type] ?? f.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{f.description ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{projet?.nom_projet ?? '—'}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">
                      {f.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal ajout frais */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Ajouter un frais</h2>
              <button
                onClick={() => { setShowForm(false); setSaveError(null) }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Frais['type'] }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Montant (€) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.montant}
                  onChange={(e) => setForm((f) => ({ ...f, montant: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Visite client Auch"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Projet associé</label>
                <select
                  value={form.project_id}
                  onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sans projet</option>
                  {projets.map((p) => (
                    <option key={p.id} value={p.id}>{p.nom_projet}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSaveError(null) }}
                  className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
