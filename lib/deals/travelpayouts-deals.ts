// lib/deals/travelpayouts-deals.ts
// Consultas à Travelpayouts (Aviasales) Data API — preços em cache, fonte oficial/legítima.
// Reutiliza o deeplink de compra afiliado já existente em lib/travelpayouts.ts.

import { buildKiwiUrl } from '@/lib/travelpayouts'
import { DEALS_CONFIG, addMonth } from '@/lib/deals/config'

const DATA_API = 'https://api.travelpayouts.com'

export interface RoutePrice {
  dest: string
  price: number
  airline: string
  departAt: string // YYYY-MM-DD
  returnAt: string
  link: string
}

export interface WildcardHit {
  dest: string
  price: number
  departAt: string
  link: string
}

interface RawFlight {
  price?: number
  airline?: string
  departure_at?: string
  return_at?: string
}

function token(): string {
  // Em produção lê de env. Localmente o proxy injeta o header — placeholder basta.
  return process.env.TRAVELPAYOUTS_TOKEN || 'proxy-injected'
}

async function cheapOneMonth(dest: string, depart: string, ret: string): Promise<RoutePrice | null> {
  const qs = new URLSearchParams({
    origin: DEALS_CONFIG.origin,
    destination: dest,
    depart_date: depart,
    return_date: ret,
    currency: DEALS_CONFIG.currency,
  })

  const res = await fetch(`${DATA_API}/v1/prices/cheap?${qs}`, {
    headers: { 'X-Access-Token': token() },
    cache: 'no-store',
  })
  if (!res.ok) return null

  const json = await res.json()
  const data = (json?.data || {}) as Record<string, Record<string, RawFlight>>

  let best: RoutePrice | null = null
  for (const group of Object.values(data)) {
    for (const f of Object.values(group)) {
      const price = Number(f.price)
      if (!price) continue
      if (!best || price < best.price) {
        const departAt = String(f.departure_at || '').slice(0, 10)
        const returnAt = String(f.return_at || '').slice(0, 10)
        best = {
          dest,
          price,
          airline: String(f.airline || ''),
          departAt,
          returnAt,
          link: buildKiwiUrl(DEALS_CONFIG.origin, dest, departAt, returnAt),
        }
      }
    }
  }
  return best
}

// Menor preço ida-volta de uma rota, considerando todos os meses da janela (em paralelo).
export async function cheapestForRoute(dest: string): Promise<RoutePrice | null> {
  const calls = DEALS_CONFIG.departMonths.map(depart =>
    cheapOneMonth(dest, depart, addMonth(depart, DEALS_CONFIG.returnSpanMonths)).catch(() => null),
  )
  const results = await Promise.all(calls)

  let best: RoutePrice | null = null
  for (const r of results) {
    if (r && (!best || r.price < best.price)) best = r
  }
  return best
}

// Destinos mais baratos a partir da origem (varredura surpresa), filtrando domésticos/SA.
export async function wildcardScan(): Promise<WildcardHit[]> {
  const qs = new URLSearchParams({ origin: DEALS_CONFIG.origin, currency: DEALS_CONFIG.currency })

  const res = await fetch(`${DATA_API}/v1/city-directions?${qs}`, {
    headers: { 'X-Access-Token': token() },
    cache: 'no-store',
  })
  if (!res.ok) return []

  const json = await res.json()
  const data = (json?.data || {}) as Record<string, { price?: number; departure_at?: string }>
  const ignore = new Set(DEALS_CONFIG.wildcard.ignore)

  const hits: WildcardHit[] = []
  for (const [dest, info] of Object.entries(data)) {
    if (ignore.has(dest)) continue
    const price = Number(info?.price)
    if (!price || price > DEALS_CONFIG.wildcard.maxPrice) continue
    const departAt = String(info?.departure_at || '').slice(0, 10)
    hits.push({ dest, price, departAt, link: buildKiwiUrl(DEALS_CONFIG.origin, dest, departAt) })
  }
  return hits.sort((a, b) => a.price - b.price)
}
