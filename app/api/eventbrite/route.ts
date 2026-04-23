// app/api/eventbrite/route.ts
// GET /api/eventbrite?keyword=coachella&category=shows&country=US
//
// Eventbrite API v3 (gratuita, cadastro em eventbrite.com/platform)
// Docs: https://www.eventbrite.com/platform/api
// Env: EVENTBRITE_API_KEY no .env.local

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ── Tipos ────────────────────────────────────────────────────

export interface EBEvent {
  id:            string
  title:         string
  description:   string
  date:          string
  location:      string
  country:       string
  flag:          string
  category:      string
  tag:           string
  tagColor:      string
  imageUrl:      string
  ticketUrl:     string
  ticketLabel:   string
  priceEstimate: string
  source:        'eventbrite'
}

// ── Helpers ──────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸', 'BR': '🇧🇷', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
  'ES': '🇪🇸', 'IT': '🇮🇹', 'PT': '🇵🇹', 'AR': '🇦🇷', 'MX': '🇲🇽',
  'JP': '🇯🇵', 'AU': '🇦🇺', 'CA': '🇨🇦', 'NL': '🇳🇱', 'BE': '🇧🇪',
  'CH': '🇨🇭', 'AT': '🇦🇹', 'IE': '🇮🇪', 'SE': '🇸🇪', 'NO': '🇳🇴',
  'DK': '🇩🇰', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'IN': '🇮🇳', 'ZA': '🇿🇦',
  'NZ': '🇳🇿', 'CO': '🇨🇴', 'CL': '🇨🇱', 'TH': '🇹🇭', 'AE': '🇦🇪',
}

const CATEGORY_MAP: Record<string, { tag: string; tagColor: string; category: string }> = {
  '103': { tag: 'Show',      tagColor: '#7c3aed', category: 'shows'         }, // Music
  '108': { tag: 'Esporte',   tagColor: '#0891b2', category: 'esportes'      }, // Sports
  '105': { tag: 'Cultura',   tagColor: '#0891b2', category: 'cultura'       }, // Performing & Visual Arts
  '110': { tag: 'Aventura',  tagColor: '#16a34a', category: 'esportes'      }, // Travel & Outdoor
  '104': { tag: 'Festival',  tagColor: '#db2777', category: 'cultura'       }, // Film & Media
  '101': { tag: 'Negócios',  tagColor: '#64748b', category: 'cultura'       }, // Business
  '111': { tag: 'Festival',  tagColor: '#7c3aed', category: 'shows'         }, // Entertainment
  '113': { tag: 'Comunidade','tagColor': '#16a34a', category: 'cultura'     }, // Community
}

function formatDatePT(start?: { utc?: string; local?: string }): string {
  const dt = start?.local ?? start?.utc
  if (!dt) return 'Em breve'
  const d = new Date(dt)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEB(ev: any): EBEvent | null {
  if (!ev?.name?.text || !ev?.url) return null

  const venue      = ev.venue
  const city       = venue?.address?.city        ?? ''
  const country    = venue?.address?.country_code ?? ''
  const countryName = venue?.address?.country     ?? country

  const location = city && countryName ? `${city}, ${countryName}` : city || countryName || 'Local a confirmar'

  const catId  = ev.category_id ?? '111'
  const catInfo = CATEGORY_MAP[catId] ?? { tag: 'Evento', tagColor: '#F5A800', category: 'cultura' }

  const imageUrl = ev.logo?.url ?? ev.logo?.original?.url ?? ''
  const ticketClass = ev.ticket_classes?.[0]
  let priceEstimate = 'Consultar preço'
  if (ticketClass) {
    if (ticketClass.free) {
      priceEstimate = 'Entrada gratuita'
    } else if (ticketClass.cost?.display) {
      priceEstimate = `A partir de ${ticketClass.cost.display}`
    }
  }

  return {
    id:            `eb-${ev.id}`,
    title:         ev.name.text,
    description:   ev.description?.text?.slice(0, 120) ?? `${catInfo.tag} em ${location}`,
    date:          formatDatePT(ev.start),
    location,
    country:       countryName,
    flag:          COUNTRY_FLAGS[country] ?? '🌍',
    category:      catInfo.category,
    tag:           catInfo.tag,
    tagColor:      catInfo.tagColor,
    imageUrl:      imageUrl.startsWith('https') ? imageUrl : '',
    ticketUrl:     ev.url,
    ticketLabel:   'Ingressos — Eventbrite',
    priceEstimate,
    source:        'eventbrite',
  }
}

// ── Eventbrite API call ──────────────────────────────────────

async function searchEventbrite(params: {
  keyword?:  string
  category?: string
  country?:  string
}): Promise<EBEvent[]> {
  const token = process.env.EVENTBRITE_API_KEY!

  const catIdMap: Record<string, string> = {
    shows:         '103',
    esportes:      '108',
    automobilismo: '108',
    futebol:       '108',
    cultura:       '105',
  }

  const qs = new URLSearchParams({
    expand:                  'venue,ticket_classes,logo',
    'start_date.range_start': new Date().toISOString(),
    sort_by:                 'best',
    page_size:               '20',
  })

  if (params.keyword)  qs.set('q', params.keyword)
  if (params.country)  qs.set('location.country', params.country)
  if (params.category && params.category !== 'todos' && catIdMap[params.category]) {
    qs.set('categories', catIdMap[params.category])
  }

  const res = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?${qs}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Eventbrite API failed: ${res.status} ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.events ?? [])
    .map(normalizeEB)
    .filter((e: EBEvent | null): e is EBEvent => e !== null && e.imageUrl !== '')
}

// ── Route handler ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword  = searchParams.get('keyword')  ?? undefined
  const category = searchParams.get('category') ?? undefined
  const country  = searchParams.get('country')  ?? undefined

  if (!process.env.EVENTBRITE_API_KEY) {
    return NextResponse.json({ events: [], isDemoMode: true })
  }

  try {
    const events = await searchEventbrite({ keyword, category, country })
    return NextResponse.json({ events, isDemoMode: false })
  } catch (error) {
    console.error('[Go Livoo] Eventbrite API error:', error)
    return NextResponse.json({ events: [], isDemoMode: false, error: 'Erro ao buscar eventos.' }, { status: 500 })
  }
}
