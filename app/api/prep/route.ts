// app/api/prep/route.ts
// GET /api/prep?nationality=BR&destination=GE

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, isValidCountryCode, sanitizeString } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('prep', { maxRequests: 15, windowMs: 60_000 })

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)
  const nationality     = (searchParams.get('nationality') ?? 'BR').toUpperCase()
  const destination     = (searchParams.get('destination') ?? '').toUpperCase()
  const destinationName = searchParams.get('destinationName')
    ? sanitizeString(searchParams.get('destinationName')!, 100)
    : destination

  if (!destination) {
    return NextResponse.json(
      { error: 'Parâmetro obrigatório: destination (ex: GE para Geórgia)' },
      { status: 400 }
    )
  }

  if (!isValidCountryCode(nationality)) {
    return NextResponse.json(
      { error: 'Código de nacionalidade inválido. Use ISO 3166-1 alpha-2 (ex: BR).' },
      { status: 400 }
    )
  }

  if (!isValidCountryCode(destination)) {
    return NextResponse.json(
      { error: 'Código de destino inválido. Use ISO 3166-1 alpha-2 (ex: GE).' },
      { status: 400 }
    )
  }

  // Se Sherpa não configurado, retorna dados de demonstração
  if (!process.env.SHERPA_API_KEY) {
    const demoResult = {
      destination,
      nationality,
      visaRequired:        false,
      visaType:            'not_required',
      visaInfo:            'Configure SHERPA_API_KEY para dados reais em tempo real.',
      passportValidity:    'Mín. 6 meses após retorno (regra geral)',
      vaccinesRequired:    [],
      vaccinesRecommended: [{ name: 'Febre Amarela', status: 'recommended', details: 'Recomendada para viajantes do Brasil' }],
      entryRestrictions:   [],
      lastUpdated:         new Date().toISOString(),
      source:              'Modo demonstração',
      isDemoMode:          true,
    }

    return NextResponse.json({ requirements: demoResult })
  }

  try {
    const { checkEntryRequirements } = await import('@/lib/sherpa')
    const requirements = await checkEntryRequirements(nationality, destination)

    // Salvar no banco local
    try {
      const { savePrepCheck } = await import('@/lib/db')
      await savePrepCheck({
        nationality,
        destination,
        destinationName: destinationName ?? undefined,
        result: requirements as unknown as Record<string, unknown>,
      })
    } catch {
      // Não falhar se não salvar
    }

    return NextResponse.json({ requirements })
  } catch {
    console.error('Erro ao verificar documentação')
    return NextResponse.json(
      { error: 'Erro ao verificar requisitos. Tente novamente.' },
      { status: 500 }
    )
  }
}
