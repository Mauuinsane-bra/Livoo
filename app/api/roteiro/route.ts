// app/api/roteiro/route.ts
// POST /api/roteiro — interpreta pedido de roteiro via GPT-4o

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'

// Rate limiting mais agressivo para rota com custo (OpenAI)
const rateLimit = createRateLimiter('roteiro', { maxRequests: 10, windowMs: 60_000 })

const MAX_PROMPT_LENGTH = 1000

// Remove tentativas óbvias de prompt injection
function sanitizePrompt(prompt: string): string {
  let clean = sanitizeString(prompt, MAX_PROMPT_LENGTH)

  // Remove padrões comuns de injection
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /you\s+are\s+now\s+/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /<<SYS>>/gi,
    /forget\s+(everything|all|your)\s*/gi,
    /override\s+(your|the)\s+(instructions?|rules?|prompt)/gi,
    /do\s+not\s+follow\s+(your|the)\s+(instructions?|rules?)/gi,
  ]

  for (const pattern of injectionPatterns) {
    clean = clean.replace(pattern, '')
  }

  return clean.trim()
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const blocked = rateLimit(req)
  if (blocked) return blocked

  try {
    const body = await req.json()
    const { prompt: rawPrompt, includes } = body as {
      prompt: string
      includes?: string[]
    }

    if (!rawPrompt || typeof rawPrompt !== 'string' || rawPrompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Descreva melhor o que você quer viver (mínimo 10 caracteres).' },
        { status: 400 }
      )
    }

    if (rawPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Descrição muito longa (máximo ${MAX_PROMPT_LENGTH} caracteres).` },
        { status: 400 }
      )
    }

    // Validar includes
    const validIncludes = ['voo', 'hotel', 'guia', 'ingresso', 'transfer', 'seguro']
    const safeIncludes = Array.isArray(includes)
      ? includes.filter((i): i is string => typeof i === 'string' && validIncludes.includes(i))
      : []

    const prompt = sanitizePrompt(rawPrompt)

    // Se não tiver OpenAI configurado, retorna resposta simulada
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

    // Busca de voos se incluído
    let flights = null
    if (safeIncludes.includes('voo') && parsed.originIATA && parsed.destinationIATA && process.env.TRAVELPAYOUTS_TOKEN) {
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
      } catch {
        console.error('Erro ao buscar voos para roteiro')
      }
    }

    // Salvar roteiro no Supabase
    try {
      const { saveItinerary } = await import('@/lib/supabase')
      await saveItinerary({ prompt, parsed_data: { ...parsed, includes: safeIncludes, flights } })
    } catch {
      // Não falhar se não salvar (Supabase pode não estar configurado em dev)
    }

    return NextResponse.json({ success: true, parsed, flights })

  } catch (err) {
    console.error('Erro ao processar roteiro')
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erro ao processar roteiro. Tente novamente.' },
      { status: 500 }
    )
  }
}
