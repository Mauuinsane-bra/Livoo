// lib/deals/scanner.ts
// Orquestra a varredura: busca preços, compara com alvos + baseline, monta alertas.

import { DEALS_CONFIG } from '@/lib/deals/config'
import {
  cheapestForRoute,
  wildcardScan,
  type RoutePrice,
  type WildcardHit,
} from '@/lib/deals/travelpayouts-deals'
import { recordPrice, min30d, storeAvailable } from '@/lib/deals/store'

export type AlertTier = 'dream' | 'good' | 'drop' | 'wildcard'

export interface DealAlert {
  tier: AlertTier
  dest: string
  name: string
  price: number
  target?: number
  prevMin?: number
  departAt: string
  returnAt?: string
  link: string
}

export interface RouteStatus {
  dest: string
  name: string
  dream: number
  good: number
  price: number | null
  airline?: string
  departAt?: string
  returnAt?: string
  link?: string
  prevMin?: number | null
}

export interface ScanResult {
  scannedAt: string
  routes: RouteStatus[]
  wildcard: WildcardHit[]
  alerts: DealAlert[]
  storeUsed: boolean
}

export interface ScanOptions {
  persist?: boolean // grava histórico (true no cron; false na visualização da página)
}

async function scanRoute(
  route: typeof DEALS_CONFIG.routes[number],
  persist: boolean,
): Promise<{ status: RouteStatus; alerts: DealAlert[] }> {
  const alerts: DealAlert[] = []

  let rp: RoutePrice | null = null
  try {
    rp = await cheapestForRoute(route.dest)
  } catch {
    rp = null
  }

  let prevMin: number | null = null

  if (rp) {
    prevMin = await min30d(route.dest).catch(() => null)
    if (persist) await recordPrice(route.dest, rp.price).catch(() => {})

    if (rp.price <= route.dream) {
      alerts.push({
        tier: 'dream', dest: route.dest, name: route.name, price: rp.price,
        target: route.dream, departAt: rp.departAt, returnAt: rp.returnAt, link: rp.link,
      })
    } else if (rp.price <= route.good) {
      alerts.push({
        tier: 'good', dest: route.dest, name: route.name, price: rp.price,
        target: route.good, departAt: rp.departAt, returnAt: rp.returnAt, link: rp.link,
      })
    }

    if (prevMin && rp.price <= prevMin * (1 - DEALS_CONFIG.relativeDropPct / 100)) {
      alerts.push({
        tier: 'drop', dest: route.dest, name: route.name, price: rp.price,
        prevMin, departAt: rp.departAt, returnAt: rp.returnAt, link: rp.link,
      })
    }
  }

  const status: RouteStatus = {
    dest: route.dest,
    name: route.name,
    dream: route.dream,
    good: route.good,
    price: rp ? rp.price : null,
    airline: rp?.airline,
    departAt: rp?.departAt,
    returnAt: rp?.returnAt,
    link: rp?.link,
    prevMin,
  }
  return { status, alerts }
}

export async function runScan(opts: ScanOptions = {}): Promise<ScanResult> {
  const persist = opts.persist !== false
  const scannedAt = new Date().toISOString()
  const storeUsed = storeAvailable()

  const routeResults = await Promise.all(
    DEALS_CONFIG.routes.map(route => scanRoute(route, persist)),
  )

  const routes = routeResults.map(r => r.status)
  const alerts: DealAlert[] = routeResults.flatMap(r => r.alerts)

  let wildcard: WildcardHit[] = []
  if (DEALS_CONFIG.wildcard.enabled) {
    try {
      wildcard = await wildcardScan()
    } catch {
      wildcard = []
    }
    for (const w of wildcard) {
      alerts.push({
        tier: 'wildcard', dest: w.dest, name: w.dest, price: w.price,
        departAt: w.departAt, link: w.link,
      })
    }
  }

  return { scannedAt, routes, wildcard, alerts, storeUsed }
}
