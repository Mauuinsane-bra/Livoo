// app/api/roteiro/route.ts
// POST /api/roteiro — interpreta pedido de roteiro via GPT-4o

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, includes } = body as {
      prompt: string
      includes?: string[]
    }

    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Descreva melhor o que você quer viver (mínimo 10 caracteres).' },
        { status: 400 }
      )
    }

    // Se não tiver OpenAI configurado, retorna resposta simulada para desenvolvimento
    if (!process.env.OPENAI_API_KEY) {
      const mockResponse = {
        success: true,
        parsed: {
          destination:        'Destino identificado pela IA (configure OPENAI_API_KEY)',
          destinationIATA:    'N/A',
          originIATA:         'GRU',
          event:              prompt,
          eventDate:          null,
          suggestedDuration:  '7 dias',
          experienceCategory: 'outro',
          visaRequired:       'verificar via Sherpa',
          estimatedBudgetBRL: null,
          notes:              'Configure OPENAI_API_KEY no .env.local para ativar a IA de roteiros.',
          searchQuery:        prompt,
        },
        flights: null,
        isDemoMode: true,
      }
      return NextResponse.json(mockResponse)
    }

    // Interpretação via GPT-4o
    const { parseItineraryRequest } = await import('@/lib/openai')
    const parsed = await parseItineraryRequest(prompt)

    // Busca de voos se incluído (via Travelpayouts — gratuito, sem markup)
    let flights = null
    if (includes?.includes('voo') && parsed.originIATA && parsed.destinationIATA && process.env.TRAVELPAYOUTS_TOKEN) {
      try {
        const { searchFlights } = await import('@/lib/travelpayouts')
        const today = new Date()
        const eventDate = parsed.eventDate
          ? new Date(parsed.eventDate)
          : new Date(today.setMonth(today.getMonth() + 3))

        flights = await searchFlights({
          origin:      parsed.originIATA,
          destination: parsed.destinationIATA,
          date:        eventDate.toISOString().split('T')[0],
          currency:    'brl',
        })
      } catch (flightError) {
        console.error('Erro ao buscar voos:', flightError)
      }
    }

    // Salvar no banco local
    try {
      const { saveItinerary } = await import('@/lib/db')
      await saveItinerary({ prompt, parsedData: { ...parsed, includes, flights } })
    } catch (dbError) {
      console.warn('Itinerário não salvo no banco:', dbError)
    }

    return NextResponse.json({ success: true, parsed, flights })

  } catch (error) {
    console.error('Erro na rota /api/roteiro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar roteiro. Tente novamente.' },
      { status: 500 }
    )
  }
}
