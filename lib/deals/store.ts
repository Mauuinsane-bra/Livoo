// lib/deals/store.ts
// Histórico de preços para o baseline (mínima de 30 dias). Usa Supabase se configurado.
// Se NÃO estiver configurado, degrada graciosamente: os alertas por alvo continuam
// funcionando; apenas o alerta de "queda relativa" fica inativo até existir histórico.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface PriceSnapshot {
  dest: string
  price: number
  scanned_at?: string
}

function admin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export function storeAvailable(): boolean {
  return admin() !== null
}

// Registra o preço de hoje.
export async function recordPrice(dest: string, price: number): Promise<void> {
  const db = admin()
  if (!db) return
  await db.from('deal_price_history').insert({ dest, price })
}

// Mínima dos últimos N dias (para medir queda real).
export async function min30d(dest: string, days = 30): Promise<number | null> {
  const db = admin()
  if (!db) return null
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await db
    .from('deal_price_history')
    .select('price')
    .eq('dest', dest)
    .gte('scanned_at', since)
  if (error || !data || data.length === 0) return null
  const prices = (data as { price: number }[]).map(r => Number(r.price))
  return Math.min(...prices)
}

// Último preço registrado por destino (para a página).
export async function latestPrices(): Promise<Record<string, PriceSnapshot>> {
  const db = admin()
  if (!db) return {}
  const { data } = await db
    .from('deal_price_history')
    .select('dest, price, scanned_at')
    .order('scanned_at', { ascending: false })
    .limit(300)
  const out: Record<string, PriceSnapshot> = {}
  for (const row of (data as PriceSnapshot[] | null) || []) {
    if (!out[row.dest]) {
      out[row.dest] = { dest: row.dest, price: Number(row.price), scanned_at: row.scanned_at }
    }
  }
  return out
}
