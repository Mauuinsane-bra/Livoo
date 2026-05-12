import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const rateLimit = createRateLimiter('hotel-deals', { maxRequests: 20, windowMs: 60_000 })

// ── Destinos curados com metadados visuais ─────────────────────────────────
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

interface DestinationMeta {
  city:        string
  country:     string
  flag:        string
  photo:       string
  hlCity:      string   // nome aceito pela Hotellook API
  region:      string
  bookingSlug: string   // slug para link Booking.com
}

const DESTINATIONS: DestinationMeta[] = [
  // Europa — IDs verificados
  { city: 'Lisboa',          country: 'Portugal',        flag: '🇵🇹', region: 'europa',   hlCity: 'Lisbon',           bookingSlug: 'lisbon',           photo: U('1518241354-e57c7e99e5ce') },
  { city: 'Porto',           country: 'Portugal',        flag: '🇵🇹', region: 'europa',   hlCity: 'Porto',            bookingSlug: 'porto',            photo: U('1555881406-6b46ba2b4c26') },
  { city: 'Paris',           country: 'França',          flag: '🇫🇷', region: 'europa',   hlCity: 'Paris',            bookingSlug: 'paris',            photo: U('1502602898657-3e91760cbb34') },
  { city: 'Barcelona',       country: 'Espanha',         flag: '🇪🇸', region: 'europa',   hlCity: 'Barcelona',        bookingSlug: 'barcelona',        photo: U('1539037116277-4db20889f2d4') },
  { city: 'Madri',           country: 'Espanha',         flag: '🇪🇸', region: 'europa',   hlCity: 'Madrid',           bookingSlug: 'madrid',           photo: U('1559599238-308e4628b70c') },
  { city: 'Roma',            country: 'Itália',          flag: '🇮🇹', region: 'europa',   hlCity: 'Rome',             bookingSlug: 'rome',             photo: U('1552832230-c0197dd311b5') },
  { city: 'Londres',         country: 'Reino Unido',     flag: '🇬🇧', region: 'europa',   hlCity: 'London',           bookingSlug: 'london',           photo: U('1513635269975-59663e0ac1ad') },
  { city: 'Amsterdã',        country: 'Holanda',         flag: '🇳🇱', region: 'europa',   hlCity: 'Amsterdam',        bookingSlug: 'amsterdam',        photo: U('1512470876302-972faa2aa9a4') },
  { city: 'Berlim',          country: 'Alemanha',        flag: '🇩🇪', region: 'europa',   hlCity: 'Berlin',           bookingSlug: 'berlin',           photo: U('1560969184-10fe8719e047') },
  // Américas
  { city: 'Miami',           country: 'EUA',             flag: '🇺🇸', region: 'americas', hlCity: 'Miami',            bookingSlug: 'miami',            photo: U('1533106497176-45ae19e68ba2') },
  { city: 'Nova York',       country: 'EUA',             flag: '🇺🇸', region: 'americas', hlCity: 'New York',         bookingSlug: 'new-york-city',    photo: U('1496442226666-8d4d0e62e6e9') },
  { city: 'Orlando',         country: 'EUA',             flag: '🇺🇸', region: 'americas', hlCity: 'Orlando',          bookingSlug: 'orlando',          photo: U('1605723517503-3cadb5818a0c') },
  { city: 'Cancún',          country: 'México',          flag: '🇲🇽', region: 'americas', hlCity: 'Cancun',           bookingSlug: 'cancun',           photo: U('1510097467424-192d713fd8b2') },
  { city: 'Buenos Aires',    country: 'Argentina',       flag: '🇦🇷', region: 'americas', hlCity: 'Buenos Aires',     bookingSlug: 'buenos-aires',     photo: U('1589909202802-8f4aadce1849') },
  { city: 'Santiago',        country: 'Chile',           flag: '🇨🇱', region: 'americas', hlCity: 'Santiago',         bookingSlug: 'santiago',         photo: U('1689850543263-01a52ccc6943') },
  // Oriente Médio / Ásia
  { city: 'Dubai',           country: 'Emirados Árabes', flag: '🇦🇪', region: 'asia',     hlCity: 'Dubai',            bookingSlug: 'dubai',            photo: U('1512453979798-5ea266f8880c') },
  { city: 'Tóquio',          country: 'Japão',           flag: '🇯🇵', region: 'asia',     hlCity: 'Tokyo',            bookingSlug: 'tokyo',            photo: U('1540959733332-eab44bc62f3c') },
  { city: 'Tbilisi',         country: 'Geórgia',         flag: '🇬🇪', region: 'asia',     hlCity: 'Tbilisi',          bookingSlug: 'tbilisi',          photo: U('1603350576276-24747f7bbf40') },
]

export interface HotelDeal {
  city:        string
  country:     string
  flag:        string
  photo:       string
  region:      string
  priceUSD:    number | null    // null = API não retornou preço
  priceLabel:  string           // "a partir de R$ 220/noite" ou "Ver preços"
  link:        string
  hotelName:   string
  stars:       number
}

function buildBookingLink(slug: string, checkIn: string, checkOut: string): string {
  return `https://www.booking.com/searchresults/pt-br.html?ss=${encodeURIComponent(slug)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=1&no_rooms=1&order=price`
}

// Converte USD → BRL (taxa aproximada)
function usdToBRL(usd: number): number {
  return Math.round(usd * 5.85)
}

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)
  const region = searchParams.get('region') || 'europa'

  const token = process.env.TRAVELPAYOUTS_TOKEN

  // Datas padrão: próximos 30 dias, estadia de 7 noites
  const checkInDate  = new Date()
  checkInDate.setDate(checkInDate.getDate() + 35)
  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + 7)
  const checkIn  = checkInDate.toISOString().split('T')[0]
  const checkOut = checkOutDate.toISOString().split('T')[0]

  const targets = DESTINATIONS.filter(d => d.region === region)

  if (!token) {
    // Demo mode — retorna preços estimados para não deixar a página em branco
    const demoDeals: HotelDeal[] = targets.map(dest => ({
      city:       dest.city,
      country:    dest.country,
      flag:       dest.flag,
      photo:      dest.photo,
      region:     dest.region,
      priceUSD:   null,
      priceLabel: 'Ver preços',
      link:       buildBookingLink(dest.bookingSlug, checkIn, checkOut),
      hotelName:  '',
      stars:      0,
    }))
    return NextResponse.json({ deals: demoDeals, checkIn, checkOut, isDemoMode: true })
  }

  // Busca preços em paralelo via Hotellook cache
  const results = await Promise.allSettled(
    targets.map(async (dest) => {
      const qs = new URLSearchParams({
        location:     dest.hlCity,
        checkInDate:  checkIn,
        checkOutDate: checkOut,
        currency:     'usd',
        token,
        limit:        '5',
        adults:       '1',
      })
      const url = `https://engine.hotellook.com/api/v2/cache.json?${qs}`
      const res = await fetch(url, { next: { revalidate: 21600 } })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()

      // Hotellook retorna array de hotéis
      let hotels: Array<{ priceFrom?: number; hotelName?: string; stars?: number }> = []
      if (Array.isArray(data)) hotels = data
      else if (data?.hotels && Array.isArray(data.hotels)) hotels = data.hotels
      else hotels = Object.values(data).filter((v) => v && typeof v === 'object') as typeof hotels

      // Pega o mais barato com preço válido
      const valid = hotels.filter(h => h.priceFrom && h.priceFrom > 0)
      valid.sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0))
      const best = valid[0]

      if (!best) throw new Error('no price')

      const brl = usdToBRL(best.priceFrom!)
      return {
        city:       dest.city,
        country:    dest.country,
        flag:       dest.flag,
        photo:      dest.photo,
        region:     dest.region,
        priceUSD:   best.priceFrom!,
        priceLabel: `estimado R$ ${brl.toLocaleString('pt-BR')}/noite`,
        link:       buildBookingLink(dest.bookingSlug, checkIn, checkOut),
        hotelName:  best.hotelName || '',
        stars:      best.stars ?? 0,
      } as HotelDeal
    })
  )

  const deals: HotelDeal[] = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    // Fallback para destinos sem preço da API
    const dest = targets[i]
    return {
      city:       dest.city,
      country:    dest.country,
      flag:       dest.flag,
      photo:      dest.photo,
      region:     dest.region,
      priceUSD:   null,
      priceLabel: 'Ver preços',
      link:       buildBookingLink(dest.bookingSlug, checkIn, checkOut),
      hotelName:  '',
      stars:      0,
    } as HotelDeal
  })

  return NextResponse.json({ deals, checkIn, checkOut, isDemoMode: false })
}
