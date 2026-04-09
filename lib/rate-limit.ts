// lib/rate-limit.ts
// Rate limiting in-memory reutilizável para todas as API routes.
// NOTA: Em produção serverless (Vercel), substituir por Upstash Redis.

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count:   number
  resetAt: number
}

interface RateLimiterConfig {
  maxRequests: number    // máximo de requisições por janela
  windowMs:    number    // janela em milissegundos
}

const stores = new Map<string, Map<string, RateLimitRecord>>()

export function createRateLimiter(name: string, config: RateLimiterConfig) {
  if (!stores.has(name)) {
    stores.set(name, new Map())
  }
  const store = stores.get(name)!

  return function checkRate(req: NextRequest): NextResponse | null {
    const ip = getClientIp(req)
    const now = Date.now()
    const record = store.get(ip)

    if (!record || now > record.resetAt) {
      store.set(ip, { count: 1, resetAt: now + config.windowMs })
      return null // permitido
    }

    if (record.count >= config.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)
      return NextResponse.json(
        { error: `Limite de requisições atingido. Aguarde ${retryAfter} segundos.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    record.count++
    return null // permitido
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim())
    return ips[ips.length - 1] || 'unknown'
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// ── Validadores reutilizáveis ─────────────────────────

/** Valida código IATA (3 letras maiúsculas) */
export function isValidIATA(code: string): boolean {
  return /^[A-Z]{3}$/.test(code.toUpperCase())
}

/** Valida data no formato YYYY-MM-DD */
export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const d = new Date(date + 'T12:00:00')
  return !isNaN(d.getTime())
}

/** Valida número inteiro dentro de um range */
export function isValidInt(value: string | null, min: number, max: number): number | null {
  if (!value) return null
  const n = parseInt(value)
  if (isNaN(n) || n < min || n > max) return null
  return n
}

/** Valida código de país ISO 3166-1 alpha-2 */
export function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code.toUpperCase())
}

/** Limita tamanho de string e remove caracteres perigosos */
export function sanitizeString(str: string, maxLength: number = 200): string {
  return str.trim().slice(0, maxLength)
}
