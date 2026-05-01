// lib/skyscrapper.ts
// Sky Scrapper API (via RapidAPI) — Skyscanner scraper
// Docs: https://rapidapi.com/apiheya/api/sky-scrapper

const BASE_URL = 'https://sky-scrapper.p.rapidapi.com'

function getHeaders() {
  return {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
    'Content-Type': 'application/json',
  }
}

// ── Types ──────────────────────────────────────────────────

export interface SkyAirport {
  skyId: string
  entityId: string
  iata: string
  city: string
  name: string
  country: string
}

export interface FlightSearchResult {
  id: string
  airline: string
  airlineCode: string
  logoUrl?: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  currency: string
}

export interface SearchFlightsParams {
  originSkyId: string
  originEntityId: string
  destinationSkyId: string
  destinationEntityId: string
  date: string
  returnDate?: string
  adults?: number
  currency?: string
  market?: string
  countryCode?: string
  sortBy?: string
  limit?: number
}

// ── Airport Search ─────────────────────────────────────────

export async function searchAirports(query: string): Promise<SkyAirport[]> {
  const url = `${BASE_URL}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=pt-BR`

  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Airport search failed: ${res.status}`)
  }

  const data = await res.json()

  if (!data.status || !Array.isArray(data.data)) {
    return []
  }

  return data.data
    .map((item: SkyRawAirport) => {
      const skyId = item.skyId || item.navigation?.relevantFlightParams?.skyId || ''
      const entityId = item.entityId || item.navigation?.entityId || ''
      const subtitle = item.presentation?.subtitle || ''
      const parts = subtitle.split(',')
      const city = parts[0]?.trim() || subtitle
      const country = parts[parts.length - 1]?.trim() || ''

      return {
        skyId,
        entityId,
        iata: skyId,
        city,
        name: item.presentation?.title || item.navigation?.localizedName || skyId,
        country,
      }
    })
    .filter((a: SkyAirport) => a.skyId && a.entityId)
}

interface SkyRawAirport {
  skyId?: string
  entityId?: string
  presentation?: { title?: string; subtitle?: string }
  navigation?: {
    entityId?: string
    localizedName?: string
    relevantFlightParams?: { skyId?: string; entityId?: string }
  }
}

// ── Flight Search ──────────────────────────────────────────

export async function searchFlights(params: SearchFlightsParams): Promise<FlightSearchResult[]> {
  const qs = new URLSearchParams({
    originSkyId:        params.originSkyId,
    destinationSkyId:   params.destinationSkyId,
    originEntityId:     params.originEntityId,
    destinationEntityId: params.destinationEntityId,
    date:               params.date,
    adults:             String(params.adults ?? 1),
    currency:           params.currency  ?? 'BRL',
    market:             params.market    ?? 'pt-BR',
    countryCode:        params.countryCode ?? 'BR',
    sortBy:             params.sortBy    ?? 'best',
  })

  if (params.returnDate) qs.set('returnDate', params.returnDate)
  if (params.limit)      qs.set('limit',      String(params.limit))

  const url = `${BASE_URL}/api/v2/flights/searchFlights?${qs}`

  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Flight search failed: ${res.status} ${body}`)
  }

  const data = await res.json()

  if (!data.status) {
    // API returned an error status
    throw new Error(data.message || 'Flight search returned no data')
  }

  const itineraries = data.data?.itineraries
  if (!Array.isArray(itineraries) || itineraries.length === 0) {
    return []
  }

  return transformItineraries(itineraries, params.currency ?? 'BRL')
}

// ── Helpers ────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface SkyItinerary {
  id?: string
  price?: { raw?: number; formatted?: string }
  legs?: SkyLeg[]
}

interface SkyLeg {
  origin?:      { id?: string; displayCode?: string }
  destination?: { id?: string; displayCode?: string }
  departure?: string
  arrival?: string
  durationInMinutes?: number
  stopCount?: number
  carriers?: {
    marketing?: Array<{ id?: number; alternateId?: string; name?: string; logoUrl?: string }>
  }
}

function transformItineraries(itineraries: SkyItinerary[], currency: string): FlightSearchResult[] {
  const results: FlightSearchResult[] = []

  for (const it of itineraries) {
    const leg = it.legs?.[0]
    if (!leg) continue

    const marketing = leg.carriers?.marketing?.[0]

    results.push({
      id:            it.id ?? String(Math.random()),
      airline:       marketing?.name      ?? 'Companhia aérea',
      airlineCode:   marketing?.alternateId ?? '',
      logoUrl:       marketing?.logoUrl,
      origin:        leg.origin?.displayCode      ?? leg.origin?.id      ?? '',
      destination:   leg.destination?.displayCode ?? leg.destination?.id ?? '',
      departureTime: leg.departure ?? '',
      arrivalTime:   leg.arrival   ?? '',
      duration:      formatDuration(leg.durationInMinutes ?? 0),
      stops:         leg.stopCount ?? 0,
      price:         it.price?.raw ?? 0,
      currency,
    })
  }

  return results
}
