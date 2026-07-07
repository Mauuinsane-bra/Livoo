// lib/base-url.ts
// Descobre a URL pública do site a partir da própria requisição.
//
// Bug corrigido em 06/jul/2026: os checkouts do Stripe usavam
// `NEXT_PUBLIC_URL ?? 'http://localhost:3000'` como success_url — a env var
// nunca foi configurada na Vercel, então TODO pagamento em produção
// redirecionava o cliente para localhost:3000 (ERR_CONNECTION_REFUSED).
// Derivar dos headers torna o redirect correto em qualquer ambiente
// (produção, preview da Vercel, dev local), sem depender de env var.

import type { NextRequest } from 'next/server'

export function getBaseUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_URL
  if (envUrl && envUrl.startsWith('http')) return envUrl.replace(/\/$/, '')

  // Vercel/proxies preenchem x-forwarded-host e x-forwarded-proto
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (host) {
    const proto = req.headers.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  return 'http://localhost:3000'
}
