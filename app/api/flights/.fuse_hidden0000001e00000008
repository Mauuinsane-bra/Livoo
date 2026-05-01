// app/api/flights/route.ts
// GET /api/flights?origin=GRU&destination=LIS&date=2026-10-15&passengers=1
// GET /api/flights?origin=GRU&destination=LIS&date=2026-10-15&returnDate=2026-10-25&passengers=1

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, isValidIATA, isValidDate, isValidInt } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('flights', { maxRequests: 30, windowMs: 60_000 })

export async function GET(req: NextRequest) {
  // Rate limiting
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)

  const origin      = (searchParams.get('origin') || searchParams.get('originSkyId') || '').toUpperCase()
  const destination = (searchParams.get('destination') || searchParams.get('destinationSkyId') || '').toUpperCase()
  const date        = searchParams.get('date') || ''
  const returnDate  = searchParams.get('returnDate') || ''
  const passengers  = isValidInt(searchParams.get('passengers'), 1, 9) ?? 1

  // Validação de input
  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: 'Parâmetros obrigatórios: origin, destination, date' },
      { status: 400 }
    )
  }

  if (!isValidIATA(origin) || !isValidIATA(destination)) {
    return NextResponse.json(
      { error: 'Códigos de aeroporto inválidos. Use códigos IATA (3 letras, ex: GRU, LIS).' },
      { status: 400 }
    )
  }

  if (!isValidDate(date)) {
    return NextResponse.json(
      { error: 'Data de ida inválida. Use formato YYYY-MM-DD.' },
      { status: 400 }
    )
  }

  if (returnDate && !isValidDate(returnDate)) {
    return NextResponse.json(
      { error: 'Data de volta inválida. Use formato YYYY-MM-DD.' },
      { status: 400 }
    )
  }

  if (!process.env.TRAVELPAYOUTS_TOKEN) {
    return NextResponse.json(
      { error: 'API de voos não configurada. Adicione TRAVELPAYOUTS_TOKEN no .env.local para ativar a busca real de voos.' },
      { status: 503 }
    )
  }

  try {
    const { searchFlights } = await import('@/lib/travelpayouts')

    const outboundPromise = searchFlights({
      origin,
      destination,
      date,
      adults:   passengers,
      currency: 'brl',
    })

    const returnPromise = returnDate
      ? searchFlights({
          origin:      destination,
          destination: origin,
          date:        returnDate,
          adults:      passengers,
          currency:    'brl',
        })
      : Promise.resolve([])

    const [outbound, returning] = await Promise.all([outboundPromise, returnPromise])

    return NextResponse.json({
      outbound,
      returning,
      isRoundTrip: Boolean(returnDate),
    })

  } catch (error: unknown) {
    console.error('Erro ao buscar voos')
    const errMsg = error instanceof Error ? error.message : ''

    if (errMsg.includes('401') || errMsg.includes('403')) {
      return NextResponse.json(
        { error: 'Erro de autenticação na API de voos.' },
        { status: 401 }
      )
    }
    if (errMsg.includes('429')) {
      return NextResponse.json(
        { error: 'Limite de requisições atingido. Aguarde alguns instantes e tente novamente.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao buscar voos. Tente novamente.' },
      { status: 500 }
    )
  }
}
