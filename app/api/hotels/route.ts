// app/api/hotels/route.ts
// GET /api/hotels?location=Paris&checkIn=2026-10-01&checkOut=2026-10-05&adults=2

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, isValidDate, isValidInt, sanitizeString } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('hotels', { maxRequests: 30, windowMs: 60_000 })

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)

  const locationRaw = searchParams.get('location') || ''
  const checkIn     = searchParams.get('checkIn')  || ''
  const checkOut    = searchParams.get('checkOut') || ''
  const adults      = isValidInt(searchParams.get('adults'), 1, 10) ?? 1

  if (!locationRaw || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'Parâmetros obrigatórios: location, checkIn, checkOut' },
      { status: 400 }
    )
  }

  const location = sanitizeString(locationRaw, 100)

  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return NextResponse.json(
      { error: 'Datas inválidas. Use formato YYYY-MM-DD.' },
      { status: 400 }
    )
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    return NextResponse.json(
      { error: 'Data de check-out deve ser posterior ao check-in.' },
      { status: 400 }
    )
  }

  const { searchHotels, buildBookingFallbackUrl } = await import('@/lib/hotellook')
  const fallbackUrl = buildBookingFallbackUrl({ location, checkIn, checkOut, adults })

  if (!process.env.TRAVELPAYOUTS_TOKEN) {
    // Sem token não há preços em cache, mas o deep link de disponibilidade
    // (com afiliado) continua útil — não devolver erro.
    return NextResponse.json({ hotels: [], fallbackUrl })
  }

  try {
    const hotels = await searchHotels({ location, checkIn, checkOut, adults })
    return NextResponse.json({ hotels, fallbackUrl })

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    // O endpoint de cache do Hotellook (engine.hotellook.com/api/v2/cache.json)
    // foi descontinuado (retorna 404) — detectado em 06/jul/2026. Degradação
    // graciosa: sem preços, mas com o link de disponibilidade (mesmo padrão
    // do /api/hotel-deals).
    console.error('Erro ao buscar hotéis (fallback aplicado):', errMsg)
    return NextResponse.json({ hotels: [], fallbackUrl })
  }
}
