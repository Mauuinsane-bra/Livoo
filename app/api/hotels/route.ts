// app/api/hotels/route.ts
// GET /api/hotels?location=Paris&checkIn=2026-10-01&checkOut=2026-10-05&adults=2

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const location = searchParams.get('location')
  const checkIn  = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const adults   = parseInt(searchParams.get('adults') ?? '1')

  if (!location || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'Parâmetros obrigatórios: location, checkIn, checkOut' },
      { status: 400 }
    )
  }

  if (!process.env.TRAVELPAYOUTS_TOKEN) {
    return NextResponse.json(
      { error: 'API de hotéis não configurada. Adicione TRAVELPAYOUTS_TOKEN no .env.local.' },
      { status: 503 }
    )
  }

  try {
    const { searchHotels, buildBookingFallbackUrl } = await import('@/lib/hotellook')

    const hotels = await searchHotels({ location, checkIn, checkOut, adults })

    const fallbackUrl = buildBookingFallbackUrl({ location, checkIn, checkOut, adults })

    return NextResponse.json({ hotels, fallbackUrl })

  } catch (error: unknown) {
    console.error('Erro Hotellook:', error)
    const errMsg = error instanceof Error ? error.message : String(error)

    if (errMsg.includes('401') || errMsg.includes('403')) {
      return NextResponse.json(
        { error: 'Token inválido. Verifique TRAVELPAYOUTS_TOKEN.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao buscar hotéis. Tente novamente.' },
      { status: 500 }
    )
  }
}
