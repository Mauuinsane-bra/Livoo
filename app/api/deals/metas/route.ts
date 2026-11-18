// app/api/deals/metas/route.ts
// GET /api/deals/metas — menor preço em cache das rotas-alvo pessoais (via GRU, janela 2027).
// Usado na faixa "Minhas metas" da página /promocoes (só aparece para usuário logado).
// Cache em memória (1h) para não disparar ~15 chamadas à Travelpayouts a cada visita.

import { NextResponse } from 'next/server'
import { DEALS_CONFIG } from '@/lib/deals/config'
import { cheapestForRoute } from '@/lib/deals/travelpayouts-deals'

export const dynamic = 'force-dynamic'

const COUNTRY: Record<string, string> = {
  MAD: 'Espanha', ROM: 'Itália', LON: 'Reino Unido', BJS: 'China', TYO: 'Japão',
}

let cache: { at: number; data: unknown } | null = null
const TTL = 60 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data)
  }

  const routes = await Promise.all(
    DEALS_CONFIG.routes.map(async r => {
      let price: number | null = null
      let link: string | undefined
      let departAt: string | undefined
      try {
        const rp = await cheapestForRoute(r.dest)
        if (rp) { price = rp.price; link = rp.link; departAt = rp.departAt }
      } catch { /* mantém price null */ }
      return {
        dest: r.dest, name: r.name, country: COUNTRY[r.dest] || '',
        dream: r.dream, good: r.good, price, link, departAt,
      }
    }),
  )

  const data = { routes, updatedAt: new Date().toISOString() }
  cache = { at: Date.now(), data }
  return NextResponse.json(data)
}
