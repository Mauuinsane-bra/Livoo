// lib/hotellook.ts
// Hotellook API — parte do ecossistema Travelpayouts
// Docs: https://support.travelpayouts.com/hc/en-us/articles/360004211095
//
// Usa o mesmo TRAVELPAYOUTS_TOKEN da busca de voos
// Retorna preços cacheados (atualizados diariamente)

const API_URL = 'https://engine.hotellook.com/api/v2'

// ── Types ──────────────────────────────────────────────────

export interface HotelResult {
  id:            string
  name:          string
  location:      string
  country:       string
  stars:         number
  pricePerNight: number
  currency:      string
  imageUrl:      string
  link:          string
}

export interface SearchHotelsParams {
  location:  string   // nome da cidade ou IATA do aeroporto mais próximo
  checkIn:   string   // YYYY-MM-DD
  checkOut:  string   // YYYY-MM-DD
  adults?:   number
  currency?: string
}

// ── Hotel Search ───────────────────────────────────────────

export async function searchHotels(params: SearchHotelsParams): Promise<HotelResult[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) throw new Error('TRAVELPAYOUTS_TOKEN não configurado')

  const marker = process.env.TRAVELPAYOUTS_MARKER || ''

  const qs = new URLSearchParams({
    location:      params.location,
    checkInDate:   params.checkIn,    // API expects checkInDate not checkIn
    checkOutDate:  params.checkOut,   // API expects checkOutDate not checkOut
    currency:      'usd',             // Hotellook suporta: usd, eur, rub (BRL não disponível na cache API)
    token,
    limit:         '12',
    adults:        String(params.adults ?? 1),
  })

  const url = `${API_URL}/cache.json?${qs}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Hotel search failed: ${res.status} ${body}`)
  }

  const data = await res.json()

  // API pode retornar um array diretamente ou um objeto com array dentro
  let hotels: HotellookRaw[] = []
  if (Array.isArray(data)) {
    hotels = data
  } else if (data && typeof data === 'object' && Array.isArray(data.hotels)) {
    hotels = data.hotels
  } else if (data && typeof data === 'object') {
    // Se for um objeto com hotéis no nível superior
    hotels = Object.values(data).filter(item => item && typeof item === 'object') as HotellookRaw[]
  }

  if (hotels.length === 0) return []

  return hotels
    .filter((h: HotellookRaw) => h.hotelId && h.priceFrom)
    .map((h: HotellookRaw) => ({
      id:            String(h.hotelId),
      name:          h.hotelName,
      location:      h.location?.name || params.location,
      country:       h.location?.country || '',
      stars:         h.stars || 0,
      pricePerNight: Math.round(h.priceFrom || 0),
      currency:      'USD',
      imageUrl:      buildImageUrl(h.hotelId),
      link:          buildHotellookLink(params, marker),
    }))
    .sort((a: HotelResult, b: HotelResult) => a.pricePerNight - b.pricePerNight)
}

// ── Helpers ────────────────────────────────────────────────

function buildImageUrl(hotelId: number): string {
  return `https://photo.hotellook.com/image_v2/limit/${hotelId}/640/400.jpg`
}

function buildHotellookLink(params: SearchHotelsParams, marker: string): string {
  const qs = new URLSearchParams({
    destination: params.location,
    checkIn:     params.checkIn,
    checkOut:    params.checkOut,
    adults:      String(params.adults ?? 1),
    ...(marker && { marker }),
  })
  return `https://search.hotellook.com/?${qs}`
}

// ── Fallback: Booking.com deep link ───────────────────────
// Usado quando a API não retorna resultados

export function buildBookingFallbackUrl(params: SearchHotelsParams): string {
  const aid = process.env.BOOKING_AFFILIATE_ID || '2849997' // Go Livoo affiliate ID
  const qs = new URLSearchParams({
    ss:           params.location,
    checkin:      params.checkIn,
    checkout:     params.checkOut,
    group_adults: String(params.adults ?? 1),
    no_rooms:     '1',
    aid,
  })
  return `https://www.booking.com/searchresults.html?${qs}`
}

// ── Raw type da API ────────────────────────────────────────

interface HotellookRaw {
  hotelId:   number
  hotelName: string
  priceFrom: number
  priceAvg:  number
  stars:     number
  location?: {
    name:    string
    country: string
  }
}
