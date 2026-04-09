// lib/travelpayouts.ts
// Travelpayouts / Aviasales API — preços reais, sem markup, grátis para afiliados
// Docs: https://travelpayouts.github.io/slate/
//
// Autocomplete: https://autocomplete.travelpayouts.com  → SEM autenticação
// Data API:     https://api.travelpayouts.com           → requer TRAVELPAYOUTS_TOKEN

const AUTOCOMPLETE_URL = 'https://autocomplete.travelpayouts.com'
const DATA_API_URL     = 'https://api.travelpayouts.com'

function getToken(): string {
  return process.env.TRAVELPAYOUTS_TOKEN || ''
}

// ── Types ──────────────────────────────────────────────────

export interface TpAirport {
  iata:    string
  name:    string
  city:    string
  country: string
}

export interface FlightSearchResult {
  id:            string
  airline:       string
  airlineCode:   string
  origin:        string
  destination:   string
  departureTime: string   // "HH:MM" formatado
  arrivalTime:   string   // "" — Data API não retorna (usuário vê no Aviasales)
  duration:      string   // "" — Data API não retorna
  stops:         number
  price:         number
  currency:      string
  link:          string   // link de compra no Aviasales
}

export interface SearchFlightsParams {
  origin:       string   // IATA
  destination:  string   // IATA
  date:         string   // YYYY-MM-DD
  returnDate?:  string
  adults?:      number
  currency?:    string
}

// ── Airport Search — SEM autenticação ─────────────────────
// Funciona imediatamente, sem precisar de nenhuma chave

export async function searchAirports(query: string, locale = 'pt'): Promise<TpAirport[]> {
  const url = `${AUTOCOMPLETE_URL}/places2?locale=${locale}&types[]=airport&types[]=city&term=${encodeURIComponent(query)}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Airport search failed: ${res.status}`)
  }

  const data: TpRawPlace[] = await res.json()

  if (!Array.isArray(data)) return []

  return data
    .filter(item => item.code && (item.type === 'airport' || item.type === 'city'))
    .map(item => ({
      iata:    item.code,
      name:    item.name    || item.code,
      city:    item.city_name || item.name || item.code,
      country: item.country_name || '',
    }))
    .slice(0, 10)
}

interface TpRawPlace {
  code:          string
  name?:         string
  city_name?:    string
  country_name?: string
  country_code?: string
  type?:         string
}

// ── Flight Search — requer TRAVELPAYOUTS_TOKEN ─────────────
// Retorna preços cacheados (atualizados a cada poucas horas)
// Preços idênticos ao Aviasales/Google Flights — sem markup

export async function searchFlights(params: SearchFlightsParams): Promise<FlightSearchResult[]> {
  const token = getToken()
  if (!token) throw new Error('TRAVELPAYOUTS_TOKEN não configurado')

  // A Data API usa cache por mês — converte YYYY-MM-DD → YYYY-MM
  const departMonth = params.date.slice(0, 7)

  const qs = new URLSearchParams({
    origin:      params.origin,
    destination: params.destination,
    depart_date: departMonth,
    currency:    params.currency ?? 'brl',
    one_way:     params.returnDate ? 'false' : 'true',
  })

  if (params.returnDate) qs.set('return_date', params.returnDate)

  const url = `${DATA_API_URL}/v1/prices/cheap?${qs}`

  const res = await fetch(url, {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Flight search failed: ${res.status} ${body}`)
  }

  const data = await res.json()

  if (!data.success || !data.data) return []

  return transformFlightData(data.data, params)
}

// ── Transformação do retorno da API ───────────────────────

function transformFlightData(
  rawData: Record<string, Record<string, TpRawFlight>>,
  params: SearchFlightsParams
): FlightSearchResult[] {
  const results: FlightSearchResult[] = []

  for (const [destCode, flights] of Object.entries(rawData)) {
    for (const [, flight] of Object.entries(flights)) {
      // Formata horário de partida "HH:MM"
      let departureTime = ''
      if (flight.departure_at) {
        const d = new Date(flight.departure_at)
        departureTime = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
      }

      results.push({
        id:            `${params.origin}-${destCode}-${flight.flight_number}-${flight.departure_at ?? ''}`,
        airline:       getAirlineName(flight.airline),
        airlineCode:   flight.airline,
        origin:        params.origin,
        destination:   destCode,
        departureTime,
        arrivalTime:   '',   // não disponível na Data API
        duration:      '',   // não disponível na Data API
        stops:         flight.number_of_changes ?? 0,
        price:         flight.price,
        currency:      (params.currency ?? 'brl').toUpperCase(),
        link:          buildAviasalesUrl(params.origin, destCode, params.date, params.adults ?? 1),
      })
    }
  }

  // Ordena por menor preço
  return results.sort((a, b) => a.price - b.price).slice(0, 15)
}

interface TpRawFlight {
  price:             number
  airline:           string
  flight_number:     number
  departure_at?:     string
  return_at?:        string
  expires_at?:       string
  number_of_changes?: number
}

// ── Link de compra Aviasales (afiliado) ───────────────────

function buildAviasalesUrl(origin: string, dest: string, date: string, adults: number): string {
  // Formato de busca direta do Aviasales: /search/{ORIGIN}{DDMM}{DEST}{PAX}
  // Esse formato aceita ?currency=BRL de forma confiável
  // Exemplo: GRU1510LIS1 = GRU → LIS, 15 de outubro, 1 passageiro
  const [, month, day] = date.split('-')           // "2026-10-15" → ["2026","10","15"]
  const searchCode = `${origin}${day}${month}${dest}${adults}`

  const marker = process.env.TRAVELPAYOUTS_MARKER
  const qs = new URLSearchParams({
    currency: 'BRL',
    ...(marker && { marker }),
  })

  return `https://www.aviasales.com/search/${searchCode}?${qs}`
}

// ── Mapa de cias aéreas ───────────────────────────────────

const AIRLINE_NAMES: Record<string, string> = {
  TP: 'TAP Air Portugal',
  LA: 'LATAM Airlines',
  G3: 'Gol',
  AD: 'Azul',
  AA: 'American Airlines',
  AF: 'Air France',
  KL: 'KLM',
  IB: 'Iberia',
  LH: 'Lufthansa',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  TK: 'Turkish Airlines',
  CM: 'Copa Airlines',
  AV: 'Avianca',
  SQ: 'Singapore Airlines',
  BA: 'British Airways',
  FR: 'Ryanair',
  U2: 'easyJet',
  JJ: 'LATAM Brasil',
  O6: 'Avianca Brasil',
}

function getAirlineName(code: string): string {
  return AIRLINE_NAMES[code] || code
}
