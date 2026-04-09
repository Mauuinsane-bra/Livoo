// app/api/events/route.ts
// GET /api/events?keyword=F1+Monaco&category=automobilismo&countryCode=BR
//
// Ticketmaster Discovery API (gratuita, sem aprovação)
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// Registre em: https://developer.ticketmaster.com/
// Env: TICKETMASTER_API_KEY no .env.local

import { NextRequest, NextResponse } from 'next/server'

// ── Interfaces ─────────────────────────────────────────────

export interface TMEvent {
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
  source:        'ticketmaster'
}

// ── Helpers ────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  'Brazil':             '🇧🇷',
  'United States':      '🇺🇸',
  'United Kingdom':     '🇬🇧',
  'Argentina':          '🇦🇷',
  'Japan':              '🇯🇵',
  'France':             '🇫🇷',
  'Germany':            '🇩🇪',
  'Spain':              '🇪🇸',
  'Italy':              '🇮🇹',
  'Portugal':           '🇵🇹',
  'Mexico':             '🇲🇽',
  'Colombia':           '🇨🇴',
  'Chile':              '🇨🇱',
  'Uruguay':            '🇺🇾',
  'Paraguay':           '🇵🇾',
  'Peru':               '🇵🇪',
  'Ecuador':            '🇪🇨',
  'Venezuela':          '🇻🇪',
  'Bolivia':            '🇧🇴',
  'Canada':             '🇨🇦',
  'Australia':          '🇦🇺',
  'Netherlands':        '🇳🇱',
  'Belgium':            '🇧🇪',
  'Switzerland':        '🇨🇭',
  'Austria':            '🇦🇹',
  'Monaco':             '🇲🇨',
  'Georgia':            '🇬🇪',
  'China':              '🇨🇳',
  'South Korea':        '🇰🇷',
  'India':              '🇮🇳',
  'South Africa':       '🇿🇦',
  'Czech Republic':     '🇨🇿',
  'Poland':             '🇵🇱',
  'Sweden':             '🇸🇪',
  'Norway':             '🇳🇴',
  'Denmark':            '🇩🇰',
  'Finland':            '🇫🇮',
  'Russia':             '🇷🇺',
  'Ireland':            '🇮🇪',
  'New Zealand':        '🇳🇿',
  'Thailand':           '🇹🇭',
  'Singapore':          '🇸🇬',
  'United Arab Emirates': '🇦🇪',
}

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '🌍'
}

function mapCategory(segment: string, genre?: string): string {
  if (segment === 'Music') return 'shows'
  if (segment === 'Sports') {
    if (genre?.toLowerCase().includes('soccer') || genre?.toLowerCase().includes('football')) return 'futebol'
    if (genre?.toLowerCase().includes('motor') || genre?.toLowerCase().includes('racing') || genre?.toLowerCase().includes('nascar')) return 'automobilismo'
    return 'esportes'
  }
  if (segment === 'Arts & Theatre') return 'cultura'
  return 'cultura'
}

function getTagForEvent(segment: string, genre?: string): { tag: string; tagColor: string } {
  if (segment === 'Music') return { tag: 'Show', tagColor: '#7c3aed' }
  if (genre?.toLowerCase().includes('soccer') || genre?.toLowerCase().includes('football')) {
    return { tag: 'Futebol', tagColor: '#16a34a' }
  }
  if (genre?.toLowerCase().includes('motor') || genre?.toLowerCase().includes('racing')) {
    return { tag: 'Automobilismo', tagColor: '#dc2626' }
  }
  if (segment === 'Sports') return { tag: 'Esporte', tagColor: '#0891b2' }
  return { tag: 'Evento', tagColor: '#F5A623' }
}

function formatDatePT(localDate?: string): string {
  if (!localDate) return 'Em breve'
  const d = new Date(localDate + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPriceEstimate(priceRanges?: Array<{ min: number; max: number; currency: string }>): string {
  if (!priceRanges || priceRanges.length === 0) return 'Consultar preço'
  const { min, currency } = priceRanges[0]
  if (currency === 'BRL') return `A partir de R$ ${Math.round(min).toLocaleString('pt-BR')}`
  if (currency === 'USD') return `A partir de US$ ${Math.round(min).toLocaleString('pt-BR')} (~R$ ${Math.round(min * 5.8).toLocaleString('pt-BR')})`
  if (currency === 'EUR') return `A partir de €${Math.round(min).toLocaleString('pt-BR')} (~R$ ${Math.round(min * 6.2).toLocaleString('pt-BR')})`
  return `A partir de ${currency} ${Math.round(min).toLocaleString('pt-BR')}`
}

function getBestImage(images: Array<{ url: string; width?: number; ratio?: string }>): string {
  if (!images || images.length === 0) return ''
  // Prefer 16_9 ratio with largest width
  const landscape = images
    .filter(img => img.ratio === '16_9' && img.url.startsWith('https'))
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))
  if (landscape.length > 0) return landscape[0].url
  // Fallback to any image
  const any = images.filter(img => img.url.startsWith('https')).sort((a, b) => (b.width ?? 0) - (a.width ?? 0))
  return any[0]?.url ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEvent(ev: any): TMEvent | null {
  const segment = ev.classifications?.[0]?.segment?.name ?? 'Other'
  const genre   = ev.classifications?.[0]?.genre?.name ?? ''
  const venue   = ev._embedded?.venues?.[0]
  const city    = venue?.city?.name ?? ''
  const country = venue?.country?.name ?? ''
  const state   = venue?.state?.name ?? ''

  if (!ev.name || segment === 'Undefined') return null

  const locationStr = city && country
    ? state && country !== 'Brazil' ? `${city}, ${state}` : `${city}, ${country}`
    : country || city || 'Local a confirmar'

  const { tag, tagColor } = getTagForEvent(segment, genre)

  return {
    id:            ev.id,
    title:         ev.name,
    description:   ev.info ?? ev.pleaseNote ?? `${genre ? genre + ' · ' : ''}${locationStr}`,
    date:          formatDatePT(ev.dates?.start?.localDate),
    location:      locationStr,
    country,
    flag:          getFlag(country),
    category:      mapCategory(segment, genre),
    tag,
    tagColor,
    imageUrl:      getBestImage(ev.images ?? []),
    ticketUrl:     ev.url ?? 'https://www.ticketmaster.com',
    ticketLabel:   'Ingressos — Ticketmaster',
    priceEstimate: formatPriceEstimate(ev.priceRanges),
    source:        'ticketmaster',
  }
}

// ── Ticketmaster API call ──────────────────────────────────

async function searchTicketmaster(params: {
  keyword?:     string
  category?:    string
  countryCode?: string
  size?:        number
}): Promise<TMEvent[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY!

  // Category → Ticketmaster classificationName / segmentName
  const segmentMap: Record<string, string> = {
    shows:          'Music',
    futebol:        'Sports',
    esportes:       'Sports',
    automobilismo:  'Sports',
    cultura:        'Arts & Theatre',
  }

  const qs = new URLSearchParams({
    apikey:   apiKey,
    locale:   'pt-BR,en-US',
    size:     String(params.size ?? 20),
    sort:     'date,asc',
    ...(params.countryCode && { countryCode: params.countryCode }),
  })

  if (params.keyword) qs.set('keyword', params.keyword)

  if (params.category && params.category !== 'todos' && segmentMap[params.category]) {
    qs.set('segmentName', segmentMap[params.category])
    if (params.category === 'futebol') qs.set('genreName', 'Soccer')
    if (params.category === 'automobilismo') qs.set('genreName', 'Motorsports/Racing')
  }

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${qs}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Ticketmaster API failed: ${res.status} ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events: any[] = data._embedded?.events ?? []

  return events
    .map(normalizeEvent)
    .filter((e): e is TMEvent => e !== null)
    .filter(e => e.imageUrl !== '') // só eventos com imagem
}

// ── Route handler ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword     = searchParams.get('keyword')     ?? undefined
  const category    = searchParams.get('category')    ?? undefined
  const countryCode = searchParams.get('countryCode') ?? undefined

  if (!process.env.TICKETMASTER_API_KEY) {
    return NextResponse.json(
      {
        events:       [],
        isDemoMode:   true,
        message:      'Adicione TICKETMASTER_API_KEY no .env.local para ativar busca ao vivo.',
      },
      { status: 200 }
    )
  }

  try {
    const events = await searchTicketmaster({ keyword, category, countryCode })
    return NextResponse.json({ events, isDemoMode: false })
  } catch (error: unknown) {
    console.error('Erro Ticketmaster:', error)
    return NextResponse.json(
      { events: [], isDemoMode: false, error: 'Erro ao buscar eventos ao vivo.' },
      { status: 500 }
    )
  }
}
