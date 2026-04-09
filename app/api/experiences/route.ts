// app/api/experiences/route.ts
// GET /api/experiences?destination=Rio+de+Janeiro&date=2026-08-10&category=tours
//
// GetYourGuide Affiliate API
// Docs: https://developers.getyourguide.com/docs/affiliate/api-reference
// Requer: GETYOURGUIDE_API_KEY no .env.local (aprovação pelo programa de afiliados)

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('experiences', { maxRequests: 20, windowMs: 60_000 })

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)

  const destination = searchParams.get('destination') ? sanitizeString(searchParams.get('destination')!, 100) : null
  const date        = searchParams.get('date')        ?? undefined
  const category    = searchParams.get('category')    ? sanitizeString(searchParams.get('category')!, 50) : undefined

  if (!destination) {
    return NextResponse.json(
      { error: 'Parâmetro obrigatório: destination' },
      { status: 400 }
    )
  }

  // GetYourGuide API requer aprovação — fallback imediato enquanto não aprovado
  if (!process.env.GETYOURGUIDE_API_KEY) {
    return NextResponse.json(
      {
        error: 'API de experiências não configurada. Adicione GETYOURGUIDE_API_KEY no .env.local.',
        fallbackUrl: buildGygFallback(destination, category),
      },
      { status: 503 }
    )
  }

  try {
    const experiences = await searchExperiences({ destination, date, category })
    const fallbackUrl = buildGygFallback(destination, category)
    return NextResponse.json({ experiences, fallbackUrl })

  } catch (error: unknown) {
    console.error('Erro ao buscar experiências')
    return NextResponse.json(
      {
        error: 'Erro ao buscar experiências.',
        fallbackUrl: buildGygFallback(destination, category),
      },
      { status: 500 }
    )
  }
}

// ── GetYourGuide API ───────────────────────────────────────

interface SearchParams {
  destination: string
  date?:       string
  category?:   string
}

async function searchExperiences(params: SearchParams) {
  const apiKey = process.env.GETYOURGUIDE_API_KEY!
  const partnerId = process.env.GETYOURGUIDE_PARTNER_ID || ''

  const qs = new URLSearchParams({
    q:        params.destination,
    count:    '12',
    currency: 'BRL',
    language: 'pt',
  })

  if (params.date)     qs.set('date_from', params.date)
  if (params.category) qs.set('category',  params.category)

  const res = await fetch(`https://api.getyourguide.com/1/activities?${qs}`, {
    headers: {
      'X-Access-Token': apiKey,
      'Accept':         'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GYG API failed: ${res.status} ${body}`)
  }

  const data = await res.json()

  if (!data.data?.activities) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.data.activities.map((a: any) => ({
    id:          String(a.activity_id),
    title:       a.title,
    location:    a.location?.city || params.destination,
    duration:    a.duration_range?.duration ? `${a.duration_range.duration} ${a.duration_range.unit}` : '',
    rating:      parseFloat(a.avg_rating ?? '0'),
    reviewCount: a.number_of_reviews ?? 0,
    price:       parseFloat(a.price?.values?.BRL ?? a.price?.values?.USD ?? '0'),
    currency:    a.price?.values?.BRL ? 'BRL' : 'USD',
    imageUrl:    a.pictures?.[0]?.variants?.find((v: { width: number }) => v.width >= 600)?.url || '',
    link:        buildGygActivityUrl(a.activity_id, partnerId),
    category:    a.categories?.[0]?.name || 'Experiência',
  }))
}

// ── URL helpers ────────────────────────────────────────────

function buildGygActivityUrl(activityId: string, partnerId: string): string {
  const base = `https://www.getyourguide.com/activity/${activityId}`
  return partnerId ? `${base}?partner_id=${partnerId}` : base
}

function buildGygFallback(destination: string, category?: string): string {
  const partnerId = process.env.GETYOURGUIDE_PARTNER_ID || ''
  const qs = new URLSearchParams({ q: destination })
  if (category)   qs.set('filter[categories]', category)
  if (partnerId)  qs.set('partner_id', partnerId)
  return `https://www.getyourguide.com/s/?${qs}`
}
