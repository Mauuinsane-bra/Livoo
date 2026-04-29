/**
 * Trending Destinations — busca server-side dos destinos com voos mais baratos
 * Usado na homepage para a seção "Destinos em Alta" (dinâmico, não estático).
 *
 * Chama a API Travelpayouts /v1/prices/cheap para o mês atual e o próximo,
 * filtra apenas destinos internacionais mapeados, e retorna os top N por menor preço.
 *
 * Cache: next.revalidate = 21600 (6h) nas fetches individuais.
 */

const API_URL = 'https://api.travelpayouts.com'

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

// Destinos internacionais com metadados verificados
// (subset do DESTINATIONS do cheap-flights — só internacionais)
const INTL_DESTINATIONS: Record<string, { city: string; country: string; sub: string; photo: string }> = {
  // Europa
  LIS: { city: 'Lisboa',           country: 'Portugal',        sub: 'Portugal · EU',   photo: U('1518241354-e57c7e99e5ce') },
  OPO: { city: 'Porto',            country: 'Portugal',        sub: 'Portugal · EU',   photo: U('1555881406-6b46ba2b4c26') },
  MAD: { city: 'Madri',            country: 'Espanha',         sub: 'Espanha · EU',    photo: U('1559599238-308e4628b70c') },
  BCN: { city: 'Barcelona',        country: 'Espanha',         sub: 'Espanha · EU',    photo: U('1539037116277-4db20889f2d4') },
  CDG: { city: 'Paris',            country: 'França',          sub: 'França · EU',     photo: U('1502602898657-3e91760cbb34') },
  LHR: { city: 'Londres',          country: 'Reino Unido',     sub: 'Reino Unido · EU', photo: U('1513635269975-59663e0ac1ad') },
  FCO: { city: 'Roma',             country: 'Itália',          sub: 'Itália · EU',     photo: U('1552832230-c0197dd311b5') },
  MXP: { city: 'Milão',            country: 'Itália',          sub: 'Itália · EU',     photo: U('1610016302534-6f67f1c968d8') },
  FRA: { city: 'Frankfurt',        country: 'Alemanha',        sub: 'Alemanha · EU',   photo: U('1577185816322-21f2a92b1342') },
  AMS: { city: 'Amsterdã',         country: 'Holanda',         sub: 'Holanda · EU',    photo: U('1512470876302-972faa2aa9a4') },
  // Oriente Médio / Ásia
  DXB: { city: 'Dubai',            country: 'Emirados Árabes', sub: 'Emirados · AS',   photo: U('1512453979798-5ea266f8880c') },
  TBS: { city: 'Tbilisi',          country: 'Geórgia',         sub: 'Geórgia · AS',    photo: U('1603350576276-24747f7bbf40') },
  // América do Norte
  MIA: { city: 'Miami',            country: 'EUA',             sub: 'EUA · NA',        photo: U('1533106497176-45ae19e68ba2') },
  JFK: { city: 'Nova York',        country: 'EUA',             sub: 'EUA · NA',        photo: U('1496442226666-8d4d0e62e6e9') },
  MCO: { city: 'Orlando',          country: 'EUA',             sub: 'EUA · NA',        photo: U('1605723517503-3cadb5818a0c') },
  CUN: { city: 'Cancún',           country: 'México',          sub: 'México · NA',     photo: U('1510097467424-192d713fd8b2') },
  MEX: { city: 'Cidade do México', country: 'México',          sub: 'México · NA',     photo: U('1585464231875-d9ef1f5ad396') },
  // América do Sul (excluindo Brasil)
  EZE: { city: 'Buenos Aires',     country: 'Argentina',       sub: 'Argentina · SA',  photo: U('1589909202802-8f4aadce1849') },
  BUE: { city: 'Buenos Aires',     country: 'Argentina',       sub: 'Argentina · SA',  photo: U('1589909202802-8f4aadce1849') },
  SCL: { city: 'Santiago',         country: 'Chile',           sub: 'Chile · SA',      photo: U('1689850543263-01a52ccc6943') },
  BOG: { city: 'Bogotá',           country: 'Colômbia',        sub: 'Colômbia · SA',   photo: U('1534943441045-1009d7cb0bb9') },
  LIM: { city: 'Lima',             country: 'Peru',            sub: 'Peru · SA',       photo: U('1577587230708-187fdbef4d91') },
  MVD: { city: 'Montevidéu',       country: 'Uruguai',         sub: 'Uruguai · SA',    photo: U('1598289993193-5efe1657f971') },
  BRC: { city: 'Bariloche',        country: 'Argentina',       sub: 'Argentina · SA',  photo: U('1575819453111-abb276cd4973') },
}

// IATAs brasileiros — para filtrar e não mostrar voos domésticos
const BR_IATAS = new Set([
  'GRU','SAO','GIG','SDU','BSB','SSA','FOR','REC','CWB','POA','FLN',
  'BHZ','CNF','VIX','GYN','SLZ','IGU','AJU','BPS','MCZ','NVT','JPA',
  'NAT','THE','MOC','LDB','MAO','BEL','CGB','CGR','PMW','RIO','JOI',
  'SJP','JDO','PNZ','IOS',
])

export interface TrendingDestination {
  iata:    string
  name:    string
  sub:     string   // "País · Continente"
  photo:   string
  price:   number   // menor preço em BRL
  href:    string   // link para /explorar-destinos ou /passagens
}

/**
 * Busca os destinos internacionais em alta (menor preço) saindo de uma origem BR.
 * Retorna array de até `count` destinos, ordenados por preço crescente.
 * Em caso de erro ou sem token, retorna array vazio (homepage mostra fallback estático).
 */
export async function getTrendingDestinations(
  origin = 'GRU',
  count = 5,
): Promise<TrendingDestination[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) return []

  try {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`

    const [r1, r2] = await Promise.all([
      fetch(`${API_URL}/v1/prices/cheap?origin=${origin}&currency=brl&depart_date=${thisMonth}`, {
        headers: { 'X-Access-Token': token },
        next: { revalidate: 21600 }, // cache 6h
      }),
      fetch(`${API_URL}/v1/prices/cheap?origin=${origin}&currency=brl&depart_date=${nextMonth}`, {
        headers: { 'X-Access-Token': token },
        next: { revalidate: 21600 },
      }),
    ])

    const [d1, d2] = await Promise.all([r1.json(), r2.json()])

    // Menor preço por destino
    const priceMap: Record<string, number> = {}

    for (const dataset of [d1, d2]) {
      if (!dataset.success || !dataset.data) continue
      for (const [dest, flights] of Object.entries(
        dataset.data as Record<string, Record<string, { price: number }>>
      )) {
        for (const flight of Object.values(flights)) {
          if (!priceMap[dest] || flight.price < priceMap[dest]) {
            priceMap[dest] = flight.price
          }
        }
      }
    }

    // Filtra: só internacionais mapeados, deduplica por cidade
    const seenCities = new Set<string>()
    const results: TrendingDestination[] = []

    const sorted = Object.entries(priceMap)
      .filter(([iata]) => !BR_IATAS.has(iata) && INTL_DESTINATIONS[iata])
      .sort((a, b) => a[1] - b[1])

    for (const [iata, price] of sorted) {
      const meta = INTL_DESTINATIONS[iata]
      if (seenCities.has(meta.city)) continue // deduplica EZE/BUE etc.
      seenCities.add(meta.city)
      results.push({
        iata,
        name: meta.city,
        sub: meta.sub,
        photo: meta.photo,
        price,
        href: '/explorar-destinos',
      })
      if (results.length >= count) break
    }

    return results
  } catch (err) {
    console.error('[trending-destinations]', err)
    return []
  }
}
