import { NextRequest, NextResponse } from 'next/server'

// force-dynamic: cada chamada com ?origin= diferente retorna resultado fresco
// (a cache de 6h é feita nas chamadas fetch individuais para o Travelpayouts)
export const dynamic = 'force-dynamic'

const DATA_API_URL = 'https://api.travelpayouts.com'

// Mapa de IATA → cidade + país + foto (Unsplash / picsum confiável)
const DESTINATIONS: Record<string, { city: string; country: string; flag: string; photo: string }> = {
  LIS: { city: 'Lisboa',           country: 'Portugal',        flag: '🇵🇹', photo: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80' },
  OPO: { city: 'Porto',            country: 'Portugal',        flag: '🇵🇹', photo: 'https://images.unsplash.com/photo-1555881400-74d7acaacd2b?auto=format&fit=crop&w=800&q=80' },
  MAD: { city: 'Madri',            country: 'Espanha',         flag: '🇪🇸', photo: 'https://images.unsplash.com/photo-1543783207-ec64e4d8de4b?auto=format&fit=crop&w=800&q=80' },
  BCN: { city: 'Barcelona',        country: 'Espanha',         flag: '🇪🇸', photo: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80' },
  MIA: { city: 'Miami',            country: 'EUA',             flag: '🇺🇸', photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
  JFK: { city: 'Nova York',        country: 'EUA',             flag: '🇺🇸', photo: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80' },
  MCO: { city: 'Orlando',          country: 'EUA',             flag: '🇺🇸', photo: 'https://picsum.photos/seed/orlando/800/500' },
  CDG: { city: 'Paris',            country: 'França',          flag: '🇫🇷', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  LHR: { city: 'Londres',          country: 'Reino Unido',     flag: '🇬🇧', photo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
  FCO: { city: 'Roma',             country: 'Itália',          flag: '🇮🇹', photo: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
  MXP: { city: 'Milão',            country: 'Itália',          flag: '🇮🇹', photo: 'https://picsum.photos/seed/milan/800/500' },
  FRA: { city: 'Frankfurt',        country: 'Alemanha',        flag: '🇩🇪', photo: 'https://picsum.photos/seed/frankfurt/800/500' },
  AMS: { city: 'Amsterdã',         country: 'Holanda',         flag: '🇳🇱', photo: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80' },
  EZE: { city: 'Buenos Aires',     country: 'Argentina',       flag: '🇦🇷', photo: 'https://picsum.photos/seed/buenosaires/800/500' },
  SCL: { city: 'Santiago',         country: 'Chile',           flag: '🇨🇱', photo: 'https://picsum.photos/seed/santiago/800/500' },
  BOG: { city: 'Bogotá',           country: 'Colômbia',        flag: '🇨🇴', photo: 'https://picsum.photos/seed/bogota/800/500' },
  CUN: { city: 'Cancún',           country: 'México',          flag: '🇲🇽', photo: 'https://picsum.photos/seed/cancun/800/500' },
  MEX: { city: 'Cidade do México', country: 'México',          flag: '🇲🇽', photo: 'https://picsum.photos/seed/mexicocity/800/500' },
  DXB: { city: 'Dubai',            country: 'Emirados Árabes', flag: '🇦🇪', photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  TBS: { city: 'Tbilisi',          country: 'Geórgia',         flag: '🇬🇪', photo: 'https://picsum.photos/seed/tbilisi/800/500' },
  GRU: { city: 'São Paulo',        country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/saopaulo/800/500' },
  GIG: { city: 'Rio de Janeiro',   country: 'Brasil',          flag: '🇧🇷', photo: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
  BSB: { city: 'Brasília',         country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/brasilia/800/500' },
  SSA: { city: 'Salvador',         country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/salvador/800/500' },
  FOR: { city: 'Fortaleza',        country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/fortaleza/800/500' },
  REC: { city: 'Recife',           country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/recife/800/500' },
  CWB: { city: 'Curitiba',         country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/curitiba/800/500' },
  POA: { city: 'Porto Alegre',     country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/portoalegre/800/500' },
  FLN: { city: 'Florianópolis',    country: 'Brasil',          flag: '🇧🇷', photo: 'https://picsum.photos/seed/florianopolis/800/500' },
}

export interface CheapFlight {
  destination:         string  // IATA
  destinationCity:     string
  destinationCountry:  string
  destinationFlag:     string
  destinationPhoto:    string
  origin:              string  // IATA
  price:               number
  currency:            string
  airline:             string
  airlineCode:         string
  stops:               number
  link:                string
}

function getAirlineName(code: string): string {
  const map: Record<string, string> = {
    TP: 'TAP Air Portugal', LA: 'LATAM', G3: 'GOL', AD: 'Azul',
    AA: 'American Airlines', AF: 'Air France', KL: 'KLM', IB: 'Iberia',
    LH: 'Lufthansa', UA: 'United', DL: 'Delta', EK: 'Emirates',
    QR: 'Qatar Airways', TK: 'Turkish Airlines', CM: 'Copa Airlines',
    AV: 'Avianca', BA: 'British Airways', JJ: 'LATAM Brasil',
  }
  return map[code] || code
}

// Formato correto Aviasales: {ORIGIN}1{DESTINATION} (1 adulto, sem data → busca flexível)
function buildAviasalesLink(origin: string, dest: string): string {
  const marker = process.env.TRAVELPAYOUTS_MARKER
  const base = `https://www.aviasales.com/search/${origin}1${dest}`
  if (marker) return `${base}?marker=${marker}&currency=BRL`
  return `${base}?currency=BRL`
}

export async function GET(req: NextRequest) {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const origin = (searchParams.get('origin') || 'GRU').toUpperCase()

  // Mês atual e próximo para cobrir mais opções
  const now        = new Date()
  const thisMonth  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const nextMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`

  try {
    // Busca mês atual + próximo mês em paralelo
    // next.revalidate nas fetches individuais mantém cache de 6h por URL
    const [r1, r2] = await Promise.all([
      fetch(`${DATA_API_URL}/v1/prices/cheap?origin=${origin}&currency=brl&depart_date=${thisMonth}`, {
        headers: { 'X-Access-Token': token },
        next: { revalidate: 21600 },
      }),
      fetch(`${DATA_API_URL}/v1/prices/cheap?origin=${origin}&currency=brl&depart_date=${nextMonthStr}`, {
        headers: { 'X-Access-Token': token },
        next: { revalidate: 21600 },
      }),
    ])

    const [d1, d2] = await Promise.all([r1.json(), r2.json()])

    // Mescla resultados, mantendo menor preço por destino
    const priceMap: Record<string, { price: number; airline: string; stops: number }> = {}

    for (const dataset of [d1, d2]) {
      if (!dataset.success || !dataset.data) continue
      for (const [dest, flights] of Object.entries(dataset.data as Record<string, Record<string, { price: number; airline: string; number_of_changes: number }>>)) {
        for (const flight of Object.values(flights)) {
          if (!priceMap[dest] || flight.price < priceMap[dest].price) {
            priceMap[dest] = {
              price:   flight.price,
              airline: flight.airline,
              stops:   flight.number_of_changes ?? 0,
            }
          }
        }
      }
    }

    // Formata resultado final, filtrando destinos conhecidos (excluindo a própria origem)
    const flights: CheapFlight[] = Object.entries(priceMap)
      .filter(([dest]) => dest !== origin)
      .map(([dest, info]) => {
        const meta = DESTINATIONS[dest]
        return {
          destination:        dest,
          destinationCity:    meta?.city    || dest,
          destinationCountry: meta?.country || '',
          destinationFlag:    meta?.flag    || '✈️',
          destinationPhoto:   meta?.photo   || `https://picsum.photos/seed/${dest}/800/500`,
          origin,
          price:              info.price,
          currency:           'BRL',
          airline:            getAirlineName(info.airline),
          airlineCode:        info.airline,
          stops:              info.stops,
          link:               buildAviasalesLink(origin, dest),
        }
      })
      .sort((a, b) => a.price - b.price)
      .slice(0, 24)

    return NextResponse.json({ flights, origin, updatedAt: new Date().toISOString() })

  } catch (err) {
    console.error('[cheap-flights]', err)
    return NextResponse.json({ error: 'Erro ao buscar preços' }, { status: 500 })
  }
}
