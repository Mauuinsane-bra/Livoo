// lib/supabase.ts — Cliente Supabase principal (PostgreSQL via Vercel).
// Usar este arquivo para todas as operações de banco de dados.
// lib/db.ts (Prisma) foi descontinuado — não adicionar novas referências.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente público (browser) — permissões limitadas pelas Row Level Security policies
export const supabase = createClient(supabaseUrl, supabaseAnon)

// Cliente admin (server-side apenas) — acesso completo, NÃO usar no browser
export const supabaseAdmin = createClient(supabaseUrl, supabaseService, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Tipos de banco de dados ────────────────────────────

export interface WaitlistEntry {
  id?:        number
  name:       string
  email:      string
  interests?: string[]
  created_at?: string
}

export interface Itinerary {
  id?:          string
  user_id?:     string
  prompt:       string
  parsed_data?: Record<string, unknown>
  status?:      'draft' | 'confirmed' | 'completed'
  created_at?:  string
}

export interface PriceAlert {
  id?:            number
  user_id?:       string
  origin:         string
  destination:    string
  target_price:   number
  current_price?: number
  active?:        boolean
  last_checked?:  string
  created_at?:    string
}

export interface PrepCheck {
  id?:              number
  user_id?:         string
  nationality:      string
  destination:      string
  destination_name?: string
  result?:          Record<string, unknown>
  paid?:            boolean
  created_at?:      string
}

// ── Helpers ────────────────────────────────────────────

export async function addToWaitlist(entry: WaitlistEntry) {
  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .insert(entry)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getWaitlistByEmail(email: string) {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('*')
    .eq('email', email)
    .single()
  return data
}

export async function saveItinerary(itinerary: Itinerary) {
  const { data, error } = await supabaseAdmin
    .from('itineraries')
    .insert(itinerary)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createPriceAlert(alert: PriceAlert) {
  const { data, error } = await supabaseAdmin
    .from('price_alerts')
    .insert(alert)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function savePrepCheck(check: PrepCheck) {
  const { data, error } = await supabaseAdmin
    .from('prep_checks')
    .insert(check)
    .select()
    .single()
  if (error) throw error
  return data
}
