import { NextRequest, NextResponse } from 'next/server'

// Revalida a cada 6 horas — Travelpayouts atualiza preços nessa frequência
export const revalidate = 21600

const DATA_API_URL = 'https://api.travelpayouts.com'

// Mapa de IATA → cidade + país (destinos mais buscados por brasileiros)
const DESTINATIONS: Record<string, { city: string; country: string; flag: string }> = {
  LIS: { city: 'Lisboa',         country: 'Portugal',        flag: '🇵🇹' },
  OPO: { city: 'Porto',          country: 'Portugal',        flag: '🇵🇹' },
  MAD: { city: 'Madri',          country: 'Espanha',         flag: '🇪🇸' },
  BCN: { city: 'Barcelona',      country: 'Espanha',         flag: '🇪🇸' },
  MIA: { city: 'Miami',          country: 'EUA',             flag: '🇺🇸' },
  JFK: { city: 'Nova York',      country: 'EUA',             flag: '🇺🇸' },
  MCO: { city: 'Orlando',        country: 'EUA',             flag: '🇺🇸' },
  CDG: { city: 'Paris',          country: 'França',          flag: '🇫🇷' },
  LHR: { city: 'Londres',        country: 'Reino Unido',     flag: '🇬🇧' },
  FCO: { city: 'Roma',           country: 'Itália',          flag: '🇮🇹' },
  MXP: { city: 'Milão',          country: 'Itália',          flag: '🇮🇹' },
  FRA: { city: 'Frankfurt',      country: 'Alemanha',        flag: '🇩🇪' },
  AMS: { city: 'Amsterdã',       country: 'Holanda',         flag: '🇳🇱' },
  EZE: { city: 'Buenos Aires',   country: 'Argentina',       flag: '🇦🇷' },
  SCL: { city: 'Santiago',       country: 'Chile',           flag: '🇨🇱' },
  BOG: { city: 'Bogotá',         country: 'Colômbia',        flag: '🇨🇴' },
  CUN: { city: 'Cancún',         country: 'México',          flag: '🇲🇽' },
  MEX: { city: 'Cidade do México', country: 'México',        flag: '🇲🇽' },
  DXB: { city: 'Dubai',          country: 'Emirados Árabes', flag: '🇦🇪' },
  TBS: { city: 'Tbilisi',        country: 'Geórgia',         flag: '🇬🇪' },
  GRU: { city: 'São Paulo',      country: 'Brasil',          flag: '🇧🇷' },
  GIG: { city: 'Rio de Janeiro', country: 'Brasil',          flag: '🇧🇷' },
  BSB: { city: 'Brasília',       country: 'Brasil',          flag: '🇧🇷' },
  SSA: { city: 'Salvador',       country: 'Brasil',          flag: '🇧🇷' },
  FOR: { city: 'Fortaleza',      country: 'Brasil',          flag: '🇧🇷' },
  REC: { city: 'Recife',         country: 'Brasil',          flag: '🇧🇷' },
  CWB: { city: 'Curitiba',       country: 'Brasil',          flag: '🇧🇷' },
  POA: { city: 'Porto Alegre',   country: 'Brasil',          flag: '🇧🇷' },
  FLN: { city: 'Florianópolis',  country: 'Brasil',          flag: '🇧🇷' },
}

export interface CheapFlight {
  destination:        string  // IATA
  destinationCity:    string
  destinationCountry: string
  destinationFlag:    string
  origin:             string  // IATA
  price:              number
  currency:           string
  airline:            string
  airlineCode:        string
  stops:              number
  link:               string
}

function getAirlineName(code: string): string {
  const map: Record<string, string> = {
    TP: 'TAP Air Portugal', LA: 'LATAM', G3: 'GOL', AD: 'Azul',
    AA: 'American', AF: 'Air France', KL: 'KLM', IB: 'Iberia',
    LH: 'Lufthansa', UA: 'United', DL: 'Delta', EK: 'Emirates',
    QR: 'Qatar Airways', TK: 'Turkish', CM: 'Copa', AV: 'Avianca',
    BA: 'British Airways', JJ: 'LATAM Brasil',
  }
  return map[code] || code
}

function buildAviasalesLink(origin: string, dest: string): string {
  const marker = process.env.TRAVELPAYOUTS_MARKER
  const qs = new URLSearchParams({ currency: 'BRL', ...(marker ? { marker } : {}) })
  // Busca aberta (sem data fixa) — usuário escolhe a data no Aviasales
  return `https://www.aviasales.com/search/${origin}${dest}?${qs}`
}

export async function GET(req: NextRequest) {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const origin = (searchParams.get('origin') || 'GRU').toUpperCase()

  // Mês atual e próximo para cobrir mais opções
  const now   = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`

  try {
    // Busca mês atual + próximo mês em paralelo
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

    // Formata resultado final, filtrando destinos conhecidos (não o próprio origin)
    const flights: CheapFlight[] = Object.entries(priceMap)
      .filter(([dest]) => dest !== origin)
      .map(([dest, info]) => {
        const meta = DESTINATIONS[dest]
        return {
          destination:        dest,
          destinationCity:    meta?.city    || dest,
          destinationCountry: meta?.country || '',
          destinationFlag:    meta?.flag    || '✈️',
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
      .slice(0, 24) // máximo 24 resultados

    return NextResponse.json({ flights, origin, updatedAt: new Date().toISOString() })

  } catch (err) {
    console.error('[cheap-flights]', err)
    return NextResponse.json({ error: 'Erro ao buscar preços' }, { status: 500 })
  }
}
