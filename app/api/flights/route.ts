// app/api/flights/route.ts
// GET /api/flights?origin=GRU&destination=LIS&date=2026-10-15&passengers=1
// GET /api/flights?origin=GRU&destination=LIS&date=2026-10-15&returnDate=2026-10-25&passengers=1
// Suporta ida simples e ida+volta (duas chamadas paralelas ao Travelpayouts)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const origin      = searchParams.get('origin')      || searchParams.get('originSkyId')
  const destination = searchParams.get('destination') || searchParams.get('destinationSkyId')
  const date        = searchParams.get('date')
  const returnDate  = searchParams.get('returnDate') ?? undefined
  const passengers  = parseInt(searchParams.get('passengers') ?? '1')

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: 'Parâmetros obrigatórios: origin, destination, date' },
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

    // Busca sempre o voo de ida
    const outboundPromise = searchFlights({
      origin,
      destination,
      date,
      adults:   passengers,
      currency: 'brl',
    })

    // Se tiver data de volta, busca também o voo de retorno em paralelo
    const returnPromise = returnDate
      ? searchFlights({
          origin:      destination, // invertido: destino vira origem
          destination: origin,      // origem vira destino
          date:        returnDate,
          adults:      passengers,
          currency:    'brl',
        })
      : Promise.resolve([])

    const [outbound, returning] = await Promise.all([outboundPromise, returnPromise])

    return NextResponse.json({
      outbound,                          // voos de ida
      returning,                         // voos de volta (vazio se só ida)
      isRoundTrip: Boolean(returnDate),
    })

  } catch (error: unknown) {
    console.error('Erro Travelpayouts flights:', error)
    const errMsg = error instanceof Error ? error.message : String(error)

    if (errMsg.includes('401') || errMsg.includes('403')) {
      return NextResponse.json(
        { error: 'Token inválido. Verifique TRAVELPAYOUTS_TOKEN no .env.local.' },
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
