import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types dérivés des tables Supabase
export type Projet = {
  id: string
  nom_projet: string
  statut: string
  progression: number
  date_création: string
  date_modification: string
  date_estimation_livraison: string | null
  r1_url_drive: string | null
  fiche_suivi_url_drive: string | null
  dossier_drive: string | null
  montant_total_estimé: number | null
  montant_total_facturé: number | null
  notes: string | null
  template_type: string
  client_num_sage: number
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  project_id: string
  titre: string
  description: string | null
  type: 'validation' | 'devis' | 'specs' | 'document' | 'fournisseur' | 'autre'
  statut: 'bloquée' | 'en_attente' | 'en_cours' | 'complétée' | 'annulée'
  priorité: number
  date_limite: string | null
  assigné_à: string
  created_at: string
  updated_at: string
}

export type SpecProjet = {
  id: string
  project_id: string
  section: 'alimentation' | 'abreuvement' | 'structure' | 'électricité' | 'autre'
  champ: string
  valeur: string | null
  complété: boolean
  date_saisie: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Devis = {
  id: string
  project_id: string
  type_devis: string
  fournisseur: string
  montant: number
  devise: string
  délai_jours: number | null
  date_réception: string | null
  statut: 'en_attente' | 'reçu' | 'validé' | 'rejeté' | 'envoyé_client' | 'accepté'
  url_drive: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Frais = {
  id: string
  date: string
  type: 'km' | 'repas' | 'parking' | 'carburant' | 'autre'
  montant: number
  description: string | null
  project_id: string | null
  created_at: string
  updated_at: string
}

export type Alerte = {
  id: string
  project_id: string
  type: 'devis_retard' | 'specs_incomplète' | 'rdv_demain' | 'fournisseur_lent' | 'autre'
  message: string
  priorité: number
  statut: 'non_lue' | 'lue' | 'résolue'
  date_création: string
  created_at: string
}

export type EvenementCalendrier = {
  id: string
  project_id: string | null
  titre: string
  description: string | null
  date_événement: string
  heure_événement: string | null
  type: 'rdv_client' | 'relance_fournisseur' | 'deadline_specs' | 'autre'
  google_event_id: string | null
  created_at: string
}

export type AiSuggestion = {
  id: string
  inbox_entry_id: string | null
  affaire_id: string | null
  type_suggestion: string | null
  payload: Record<string, unknown> | null
  score_confiance: number | null
  statut: 'pending' | 'validated' | 'rejected' | 'validee' | 'rejetee' | string
  date_creation: string
  date_validation: string | null
  processed: boolean
}
