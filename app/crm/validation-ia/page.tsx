'use client'

import { useEffect, useState } from 'react'
import { supabase, type AiSuggestion } from '@/lib/supabase'

const TYPE_LABELS: Record<string, string> = {
  create_task: 'Créer une tâche',
  update_project: 'Mettre à jour projet',
  add_note: 'Ajouter une note',
  schedule_event: 'Planifier un événement',
  update_spec: 'Mettre à jour une spec',
}

function ConfidenceBadge({ score }: { score: number | null }) {
  if (score === null) return null
  const pct = Math.round(score * 100)
  const color =
    pct >= 80
      ? 'text-green-700 bg-green-50'
      : pct >= 50
      ? 'text-yellow-700 bg-yellow-50'
      : 'text-red-700 bg-red-50'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {pct}% confiance
    </span>
  )
}

// Valeurs réelles en base (colonne statut)
const DB_STATUT = {
  pending: 'pending',
  validated: 'validee',
  rejected: 'rejetee',
} as const

type Filter = 'pending' | 'validated' | 'rejected' | 'all'

export default function ValidationIaPage() {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('pending')

  // Mode édition payload
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPayload, setEditPayload] = useState('')
  const [editError, setEditError] = useState<string | null>(null)

  async function loadSuggestions() {
    const query = supabase
      .from('ai_suggestions')
      .select('*')
      .order('date_creation', { ascending: false })

    if (filter === 'pending') {
      query.eq('processed', false)
    } else if (filter === 'validated') {
      query.eq('statut', DB_STATUT.validated)
    } else if (filter === 'rejected') {
      query.eq('statut', DB_STATUT.rejected)
    }
    // 'all' → pas de filtre

    const { data } = await query
    setSuggestions(data ?? [])
  }

  useEffect(() => {
    setLoading(true)
    setEditingId(null)
    loadSuggestions().finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // Retire la carte de la liste si on est sur un onglet filtré
  function removeOrUpdate(id: string, dbStatut: string) {
    if (filter === 'all') {
      // On affiche tout → on met à jour la carte sur place
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, statut: dbStatut as AiSuggestion['statut'], processed: true, date_validation: new Date().toISOString() }
            : s
        )
      )
    } else {
      // Sur n'importe quel onglet filtré → la carte disparaît immédiatement
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
    }
  }

  async function handleValidate(id: string, payloadOverride?: Record<string, unknown>) {
    setProcessing(id)
    setEditError(null)

    const updates: Record<string, unknown> = {
      statut: DB_STATUT.validated,
      date_validation: new Date().toISOString(),
      processed: true,
    }
    if (payloadOverride !== undefined) {
      updates.payload = payloadOverride
    }

    const { error } = await supabase.from('ai_suggestions').update(updates).eq('id', id)

    if (error) {
      setEditError(error.message)
      setProcessing(null)
      return
    }

    removeOrUpdate(id, DB_STATUT.validated)
    setEditingId(null)
    setProcessing(null)
  }

  async function handleReject(id: string) {
    setProcessing(id)

    const { error } = await supabase
      .from('ai_suggestions')
      .update({
        statut: DB_STATUT.rejected,
        date_validation: new Date().toISOString(),
        processed: true,
      })
      .eq('id', id)

    if (!error) {
      removeOrUpdate(id, DB_STATUT.rejected)
      if (editingId === id) setEditingId(null)
    }

    setProcessing(null)
  }

  function startEdit(s: AiSuggestion) {
    setEditingId(s.id)
    setEditPayload(JSON.stringify(s.payload ?? {}, null, 2))
    setEditError(null)
  }

  function handleValidateWithEdit(id: string) {
    setEditError(null)
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(editPayload)
    } catch {
      setEditError('JSON invalide — corrigez la syntaxe avant de valider.')
      return
    }
    handleValidate(id, parsed)
  }

  const pendingCount = suggestions.filter((s) => s.processed === false).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Validation IA</h1>
          {filter === 'pending' && pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {pendingCount} en attente
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Les suggestions de l'IA nécessitent votre validation avant d'être appliquées.
        </p>
      </div>

      {/* Onglets filtres */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {(['pending', 'all', 'validated', 'rejected'] as const).map((f) => {
          const labels: Record<Filter, string> = {
            pending: 'En attente',
            all: 'Toutes',
            validated: 'Validées',
            rejected: 'Rejetées',
          }
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {labels[f]}
            </button>
          )
        })}
      </div>

      {/* Liste */}
      {suggestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg
            className="w-10 h-10 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-gray-400 text-sm">
            {filter === 'pending' ? 'Aucune suggestion en attente' : 'Aucune suggestion'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => {
            const isPending = s.processed === false
            const isProcessing = processing === s.id
            const isEditing = editingId === s.id

            return (
              <div
                key={s.id}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  isPending ? 'border-yellow-200 shadow-sm' : 'border-gray-200 opacity-75'
                }`}
              >
                {/* Ligne titre + badges + boutons */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {TYPE_LABELS[s.type_suggestion ?? ''] ?? s.type_suggestion ?? 'Suggestion'}
                      </span>
                      <ConfidenceBadge score={s.score_confiance} />
                      {s.statut === DB_STATUT.validated && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Validée
                        </span>
                      )}
                      {s.statut === DB_STATUT.rejected && (
                        <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejetée
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.date_creation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Boutons action — uniquement si pending et pas en mode édition */}
                  {isPending && !isEditing && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(s)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleReject(s.id)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? '…' : 'Rejeter'}
                      </button>
                      <button
                        onClick={() => handleValidate(s.id)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? '…' : 'Valider'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Payload — mode lecture */}
                {!isEditing && s.payload && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 overflow-auto max-h-32">
                    {Object.entries(s.payload).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-400 flex-shrink-0">{k}:</span>
                        <span className="text-gray-700 truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mode édition payload */}
                {isEditing && (
                  <div className="mt-3 space-y-2">
                    <label className="text-xs font-medium text-gray-600">
                      Payload (JSON éditable)
                    </label>
                    <textarea
                      rows={6}
                      value={editPayload}
                      onChange={(e) => { setEditPayload(e.target.value); setEditError(null) }}
                      className="w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                      spellCheck={false}
                    />
                    {editError && (
                      <p className="text-xs text-red-600">{editError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingId(null); setEditError(null) }}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleReject(s.id)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? '…' : 'Rejeter'}
                      </button>
                      <button
                        onClick={() => handleValidateWithEdit(s.id)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? '…' : 'Valider avec modifications'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Date de traitement */}
                {s.date_validation && (
                  <p className="text-xs text-gray-400 mt-2">
                    Traitée le{' '}
                    {new Date(s.date_validation).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
