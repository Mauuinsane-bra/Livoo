import { NextResponse } from 'next/server'
import { EVENTS } from '@/lib/events-data'

/**
 * GET /api/event-prices
 *
 * Busca o menor preço de voo (origem GRU) para cada destino dos eventos curados.
 * Usa Travelpayouts /v1/prices/cheap com ISR de 6h.
 *
 * Retorna: { prices: { [iata: string]: { price: number; departDate: string } } }
 */

export const revalidate = 21600 // 6 horas

const API = 'https://api.travelpayouts.com'
const ORIGIN = 'GRU' // São Paulo — maior aeroporto do Brasil

export async function GET() {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) {
    return NextResponse.json({ prices: {}, error: 'token_missing' })
  }

  // Destinos únicos dos eventos curados
  const iatas = [...new Set(
    EVENTS
      .filter(e => e.destinationIata && e.destinationIata !== ORIGIN)
      .map(e => e.destinationIata)
  )]

  // Busca próximos 3 meses para cobrir todos os eventos
  const now = new Date()
  const months: string[] = []
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  try {
    // Busca preços para cada mês em paralelo
    const responses = await Promise.all(
      months.map(month =>
        fetch(`${API}/v1/prices/cheap?origin=${ORIGIN}&currency=brl&depart_date=${month}`, {
          headers: { 'X-Access-Token': token },
          next: { revalidate: 21600 },
        }).then(r => r.ok ? r.json() : { success: false, data: {} })
      )
    )

    // Mescla resultados — menor preço por destino
    const prices: Record<string, { price: number; departDate: string }> = {}

    for (const res of responses) {
      if (!res.success || !res.data) continue
      for (const dest of Object.keys(res.data)) {
        const destUpper = dest.toUpperCase()
        if (!iatas.includes(destUpper)) continue

        // Cada destino pode ter múltiplas opções (por companhia)
        const options = res.data[dest]
        for (const key of Object.keys(options)) {
          const flight = options[key]
          if (flight.price && (!prices[destUpper] || flight.price < prices[destUpper].price)) {
            prices[destUpper] = {
              price: flight.price,
              departDate: flight.depart_date || '',
            }
          }
        }
      }
    }

    return NextResponse.json({ prices })
  } catch {
    return NextResponse.json({ prices: {}, error: 'fetch_failed' })
  }
}
