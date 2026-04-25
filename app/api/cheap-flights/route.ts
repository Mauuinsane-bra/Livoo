import { NextRequest, NextResponse } from 'next/server'

// force-dynamic: cada chamada com ?origin= diferente retorna resultado fresco
// (a cache de 6h é feita nas chamadas fetch individuais para o Travelpayouts)
export const dynamic = 'force-dynamic'

const DATA_API_URL = 'https://api.travelpayouts.com'

// Mapa de IATA → cidade + país + foto (Unsplash — IDs verificados manualmente)
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

const DESTINATIONS: Record<string, { city: string; country: string; flag: string; photo: string }> = {
  // Europa
  LIS: { city: 'Lisboa',           country: 'Portugal',        flag: '🇵🇹', photo: U('1534430480872-3498386e7856') },
  OPO: { city: 'Porto',            country: 'Portugal',        flag: '🇵🇹', photo: U('1555881400-74d7acaacd2b') },
  MAD: { city: 'Madri',            country: 'Espanha',         flag: '🇪🇸', photo: U('1543783207-ec64e4d8de4b') },
  BCN: { city: 'Barcelona',        country: 'Espanha',         flag: '🇪🇸', photo: U('1539037116277-4db20889f2d4') },
  CDG: { city: 'Paris',            country: 'França',          flag: '🇫🇷', photo: U('1502602898657-3e91760cbb34') },
  LHR: { city: 'Londres',          country: 'Reino Unido',     flag: '🇬🇧', photo: U('1513635269975-59663e0ac1ad') },
  FCO: { city: 'Roma',             country: 'Itália',          flag: '🇮🇹', photo: U('1552832230-c0197dd311b5') },
  MXP: { city: 'Milão',            country: 'Itália',          flag: '🇮🇹', photo: U('1610016302534-6f67f1c968d8') },
  FRA: { city: 'Frankfurt',        country: 'Alemanha',        flag: '🇩🇪', photo: U('1577185816322-21f2a92b1342') },
  AMS: { city: 'Amsterdã',         country: 'Holanda',         flag: '🇳🇱', photo: U('1512470876302-972faa2aa9a4') },
  // Oriente Médio / Ásia
  DXB: { city: 'Dubai',            country: 'Emirados Árabes', flag: '🇦🇪', photo: U('1512453979798-5ea266f8880c') },
  TBS: { city: 'Tbilisi',          country: 'Geórgia',         flag: '🇬🇪', photo: U('1603350576276-24747f7bbf40') },
  // América do Norte
  MIA: { city: 'Miami',            country: 'EUA',             flag: '🇺🇸', photo: U('1533106497176-45ae19e68ba2') },
  JFK: { city: 'Nova York',        country: 'EUA',             flag: '🇺🇸', photo: U('1496442226666-8d4d0e62e6e9') },
  MCO: { city: 'Orlando',          country: 'EUA',             flag: '🇺🇸', photo: U('1605723517503-3cadb5818a0c') },
  CUN: { city: 'Cancún',           country: 'México',          flag: '🇲🇽', photo: U('1510097467424-192d713fd8b2') },
  MEX: { city: 'Cidade do México', country: 'México',          flag: '🇲🇽', photo: U('1585464231875-d9ef1f5ad396') },
  // Brasil — principais origens
  GRU: { city: 'São Paulo',        country: 'Brasil',          flag: '🇧🇷', photo: U('1554168848-228452c09d60') },
  SAO: { city: 'São Paulo',        country: 'Brasil',          flag: '🇧🇷', photo: U('1554168848-228452c09d60') },
  GIG: { city: 'Rio de Janeiro',   country: 'Brasil',          flag: '🇧🇷', photo: U('1483729558449-99ef09a8c325') },
  SDU: { city: 'Rio de Janeiro',   country: 'Brasil',          flag: '🇧🇷', photo: U('1483729558449-99ef09a8c325') },
  BSB: { city: 'Brasília',         country: 'Brasil',          flag: '🇧🇷', photo: U('1625426078245-6911839409dd') },
  SSA: { city: 'Salvador',         country: 'Brasil',          flag: '🇧🇷', photo: U('1603237568326-e7c5adde84ff') },
  FOR: { city: 'Fortaleza',        country: 'Brasil',          flag: '🇧🇷', photo: U('1560971923-16c232d1ee89') },
  REC: { city: 'Recife',           country: 'Brasil',          flag: '🇧🇷', photo: U('1563455227142-d0f82238d6f8') },
  CWB: { city: 'Curitiba',         country: 'Brasil',          flag: '🇧🇷', photo: U('1616642325314-fe17e194b380') },
  POA: { city: 'Porto Alegre',     country: 'Brasil',          flag: '🇧🇷', photo: U('1632516654640-adc4c3681255') },
  FLN: { city: 'Florianópolis',    country: 'Brasil',          flag: '🇧🇷', photo: U('1565574337618-b08146e94992') },
  // Brasil — destinos domésticos
  BHZ: { city: 'Belo Horizonte',   country: 'Brasil',          flag: '🇧🇷', photo: U('1568688503154-9edd877da0c7') },
  CNF: { city: 'Belo Horizonte',   country: 'Brasil',          flag: '🇧🇷', photo: U('1568688503154-9edd877da0c7') },
  VIX: { city: 'Vitória',          country: 'Brasil',          flag: '🇧🇷', photo: U('1651839043560-640c9f2d926f') },
  GYN: { city: 'Goiânia',          country: 'Brasil',          flag: '🇧🇷', photo: U('1625426078245-6911839409dd') },
  SLZ: { city: 'São Luís',         country: 'Brasil',          flag: '🇧🇷', photo: U('1614824467812-c3c62c3fd005') },
  IGU: { city: 'Foz do Iguaçu',    country: 'Brasil',          flag: '🇧🇷', photo: U('1538703012804-b74999aa11b9') },
  AJU: { city: 'Aracaju',          country: 'Brasil',          flag: '🇧🇷', photo: U('1617888906135-d9fe72bd2784') },
  BPS: { city: 'Porto Seguro',     country: 'Brasil',          flag: '🇧🇷', photo: U('1734104742554-603118a8213c') },
  MCZ: { city: 'Maceió',           country: 'Brasil',          flag: '🇧🇷', photo: U('1632415978225-ffe0d0f2703e') },
  NVT: { city: 'Navegantes',       country: 'Brasil',          flag: '🇧🇷', photo: U('1565574337618-b08146e94992') },
  JPA: { city: 'João Pessoa',      country: 'Brasil',          flag: '🇧🇷', photo: U('1598289944397-6aae6321cfa2') },
  NAT: { city: 'Natal',            country: 'Brasil',          flag: '🇧🇷', photo: U('1643850271872-29eead934f68') },
  THE: { city: 'Teresina',         country: 'Brasil',          flag: '🇧🇷', photo: U('1560971923-16c232d1ee89') },
  MOC: { city: 'Montes Claros',    country: 'Brasil',          flag: '🇧🇷', photo: U('1568688503154-9edd877da0c7') },
  LDB: { city: 'Londrina',         country: 'Brasil',          flag: '🇧🇷', photo: U('1616642325314-fe17e194b380') },
  MAO: { city: 'Manaus',           country: 'Brasil',          flag: '🇧🇷', photo: U('1700753618948-79f177a3b19e') },
  BEL: { city: 'Belém',            country: 'Brasil',          flag: '🇧🇷', photo: U('1649681357620-54170d946bb0') },
  CGB: { city: 'Cuiabá',           country: 'Brasil',          flag: '🇧🇷', photo: U('1598568536940-ce8d1bc05b1a') },
  CGR: { city: 'Campo Grande',     country: 'Brasil',          flag: '🇧🇷', photo: U('1598568536940-ce8d1bc05b1a') },
  PMW: { city: 'Palmas',           country: 'Brasil',          flag: '🇧🇷', photo: U('1625426078245-6911839409dd') },
  // Brasil — destinos extras que a API Travelpayouts retorna
  RIO: { city: 'Rio de Janeiro',   country: 'Brasil',          flag: '🇧🇷', photo: U('1483729558449-99ef09a8c325') }, // código metro RJ
  JOI: { city: 'Joinville',        country: 'Brasil',          flag: '🇧🇷', photo: U('1702693177338-0fb78ad59b9f') },
  SJP: { city: 'S. J. Rio Preto',  country: 'Brasil',          flag: '🇧🇷', photo: U('1554168848-228452c09d60') },    // SP interior
  JDO: { city: 'Juazeiro do Norte', country: 'Brasil',         flag: '🇧🇷', photo: U('1560971923-16c232d1ee89') },    // Cariri CE
  PNZ: { city: 'Petrolina',        country: 'Brasil',          flag: '🇧🇷', photo: U('1563455227142-d0f82238d6f8') }, // Sertão PE
  IOS: { city: 'Ilhéus',           country: 'Brasil',          flag: '🇧🇷', photo: U('1682152572654-6c0ec46f4aa4') },
  // Internacional — América do Sul
  SRZ: { city: 'Santa Cruz',       country: 'Bolívia',         flag: '🇧🇴', photo: U('1672676935367-68dde281958d') },
  EZE: { city: 'Buenos Aires',     country: 'Argentina',       flag: '🇦🇷', photo: U('1589909202802-8f4aadce1849') },
  BUE: { city: 'Buenos Aires',     country: 'Argentina',       flag: '🇦🇷', photo: U('1589909202802-8f4aadce1849') },
  SCL: { city: 'Santiago',         country: 'Chile',           flag: '🇨🇱', photo: U('1689850543263-01a52ccc6943') },
  BOG: { city: 'Bogotá',           country: 'Colômbia',        flag: '🇨🇴', photo: U('1534943441045-1009d7cb0bb9') },
  LIM: { city: 'Lima',             country: 'Peru',            flag: '🇵🇪', photo: U('1577587230708-187fdbef4d91') },
  UIO: { city: 'Quito',            country: 'Equador',         flag: '🇪🇨', photo: U('1610226977124-9fd2755d09f2') },
  MVD: { city: 'Montevidéu',       country: 'Uruguai',         flag: '🇺🇾', photo: U('1598289993193-5efe1657f971') },
  ASU: { city: 'Assunção',         country: 'Paraguai',        flag: '🇵🇾', photo: U('1589909202802-8f4aadce1849') },
  GEO: { city: 'Georgetown',       country: 'Guiana',          flag: '🇬🇾', photo: U('1510097467424-192d713fd8b2') },
  BRC: { city: 'Bariloche',        country: 'Argentina',       flag: '🇦🇷', photo: U('1575819453111-abb276cd4973') },
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
  departDate:          string  // YYYY-MM-DD — data de partida
  returnDate:          string  // YYYY-MM-DD — data de retorno ('' se só ida)
  isRoundTrip:         boolean // true quando return_at está presente na resposta
  link:                string
  region:              string  // para agrupamento em /melhores-destinos
}

// Mapeamento de IATA → região para agrupamento em /melhores-destinos
const REGION_MAP: Record<string, string> = {
  // Brasil
  GRU: 'brasil', SAO: 'brasil', GIG: 'brasil', SDU: 'brasil', BSB: 'brasil',
  SSA: 'brasil', FOR: 'brasil', REC: 'brasil', CWB: 'brasil', POA: 'brasil',
  FLN: 'brasil', BHZ: 'brasil', CNF: 'brasil', MAO: 'brasil', BEL: 'brasil',
  IGU: 'brasil', NAT: 'brasil', MCZ: 'brasil', JPA: 'brasil', VIX: 'brasil',
  GYN: 'brasil', SLZ: 'brasil', AJU: 'brasil', CGR: 'brasil', CGB: 'brasil',
  JOI: 'brasil', NVT: 'brasil', LDB: 'brasil', RIO: 'brasil', MOC: 'brasil',
  PMW: 'brasil', THE: 'brasil', SJP: 'brasil', JDO: 'brasil', PNZ: 'brasil',
  IOS: 'brasil', BPS: 'brasil',
  // Europa
  LIS: 'europa', OPO: 'europa', MAD: 'europa', BCN: 'europa', CDG: 'europa',
  LHR: 'europa', FCO: 'europa', MXP: 'europa', FRA: 'europa', AMS: 'europa',
  ARN: 'europa', CPH: 'europa', HEL: 'europa', ZRH: 'europa', VIE: 'europa',
  BRU: 'europa', DUB: 'europa', ATH: 'europa', IST: 'europa', WAW: 'europa',
  // EUA
  MIA: 'eua', JFK: 'eua', MCO: 'eua', LAX: 'eua', ORD: 'eua',
  BOS: 'eua', SFO: 'eua', IAH: 'eua', ATL: 'eua', DFW: 'eua',
  // Canadá
  YYZ: 'canada', YVR: 'canada', YUL: 'canada', YYC: 'canada',
  // América do Sul
  EZE: 'america-sul', BUE: 'america-sul', SCL: 'america-sul', BOG: 'america-sul',
  LIM: 'america-sul', UIO: 'america-sul', MVD: 'america-sul', ASU: 'america-sul',
  GEO: 'america-sul', BRC: 'america-sul', SRZ: 'america-sul',
  // Caribe e México
  CUN: 'caribe', MEX: 'caribe', HAV: 'caribe', PTY: 'caribe', SJO: 'caribe',
  SDQ: 'caribe', PUJ: 'caribe', MBJ: 'caribe',
  // Oriente Médio e Ásia
  DXB: 'oriente-medio', TBS: 'asia', NRT: 'asia', HND: 'asia',
  BKK: 'asia', SIN: 'asia', KUL: 'asia', ICN: 'asia', HKG: 'asia',
  DEL: 'asia', BOM: 'asia', CMB: 'asia',
  // África
  JNB: 'africa', CAI: 'africa', CMN: 'africa', NBO: 'africa', LOS: 'africa',
  // Oceania
  SYD: 'oceania', MEL: 'oceania', AKL: 'oceania',
}

function getRegion(iata: string): string {
  return REGION_MAP[iata] || 'outros'
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

// Trip.com (br.trip.com) — deeplink em Português com preços em BRL
// Aceita códigos IATA em lowercase (ex: gru, cwb, lhr)
// Travelpayouts program ID: 121 — requer aprovação do programa para tracking via tp.media
// Para ativar comissão: conectar ao programa Trip.com em app.travelpayouts.com/programs/121
// e então envolver a URL com: https://tp.media/r?marker={MARKER}&p=121&u={encoded_url}
function buildFlightLink(origin: string, dest: string, departDate?: string): string {
  const o = origin.toLowerCase()
  const d = dest.toLowerCase()

  const baseUrl = 'https://br.trip.com/flights/showfarefirst'
  const params = new URLSearchParams({
    dcity:    o,
    acity:    d,
    triptype: 'ow',
    class:    'y',
    quantity: '1',
    locale:   'pt-BR',
    curr:     'BRL',
  })
  if (departDate && departDate.length === 10) {
    params.set('ddate', departDate)
  }

  const tripUrl = `${baseUrl}?${params.toString()}`

  // Quando o programa Trip.com for aprovado no Travelpayouts, descomentar:
  // const marker = process.env.TRAVELPAYOUTS_MARKER
  // if (marker) return `https://tp.media/r?marker=${marker}&p=121&u=${encodeURIComponent(tripUrl)}`

  return tripUrl
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
    const priceMap: Record<string, {
      price: number; airline: string; stops: number
      departDate: string; returnDate: string; isRoundTrip: boolean
    }> = {}

    for (const dataset of [d1, d2]) {
      if (!dataset.success || !dataset.data) continue
      for (const [dest, flights] of Object.entries(dataset.data as Record<string, Record<string, {
        price: number; airline: string; number_of_changes: number
        departure_at?: string; return_at?: string
      }>>)) {
        for (const flight of Object.values(flights)) {
          if (!priceMap[dest] || flight.price < priceMap[dest].price) {
            // departure_at e return_at vêm como ISO string — extrai só YYYY-MM-DD
            const departDate  = flight.departure_at ? flight.departure_at.substring(0, 10) : ''
            const returnDate  = flight.return_at    ? flight.return_at.substring(0, 10)    : ''
            const isRoundTrip = !!flight.return_at
            priceMap[dest] = {
              price: flight.price,
              airline: flight.airline,
              stops: flight.number_of_changes ?? 0,
              departDate,
              returnDate,
              isRoundTrip,
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
          departDate:         info.departDate,
          returnDate:         info.returnDate,
          isRoundTrip:        info.isRoundTrip,
          link:               buildFlightLink(origin, dest, info.departDate),
          region:             getRegion(dest),
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
