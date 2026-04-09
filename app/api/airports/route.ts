// app/api/airports/route.ts
// GET /api/airports?q=Guarulhos   → busca aeroportos via Travelpayouts Autocomplete
// GET /api/airports?q=GRU         → também funciona com IATA
//
// IMPORTANTE: O autocomplete do Travelpayouts NÃO requer autenticação.
// Funciona imediatamente, sem configurar nenhuma chave de API.

import { NextRequest, NextResponse } from 'next/server'

// ── Lista estática de fallback (usada apenas se a API falhar) ───
const STATIC_AIRPORTS = [
  // Brasil
  { iata: 'GRU', name: 'Guarulhos (GRU)', city: 'São Paulo', country: 'Brasil' },
  { iata: 'CGH', name: 'Congonhas (CGH)', city: 'São Paulo', country: 'Brasil' },
  { iata: 'GIG', name: 'Galeão (GIG)', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'SDU', name: 'Santos Dumont (SDU)', city: 'Rio de Janeiro', country: 'Brasil' },
  { iata: 'BSB', name: 'JK (BSB)', city: 'Brasília', country: 'Brasil' },
  { iata: 'SSA', name: 'Luís Eduardo Magalhães (SSA)', city: 'Salvador', country: 'Brasil' },
  { iata: 'REC', name: 'Guararapes (REC)', city: 'Recife', country: 'Brasil' },
  { iata: 'FOR', name: 'Pinto Martins (FOR)', city: 'Fortaleza', country: 'Brasil' },
  { iata: 'POA', name: 'Salgado Filho (POA)', city: 'Porto Alegre', country: 'Brasil' },
  { iata: 'CWB', name: 'Afonso Pena (CWB)', city: 'Curitiba', country: 'Brasil' },
  { iata: 'BEL', name: 'Val de Cans (BEL)', city: 'Belém', country: 'Brasil' },
  { iata: 'MAO', name: 'Eduardo Gomes (MAO)', city: 'Manaus', country: 'Brasil' },
  { iata: 'FLN', name: 'Hercílio Luz (FLN)', city: 'Florianópolis', country: 'Brasil' },
  { iata: 'VCP', name: 'Viracopos (VCP)', city: 'Campinas', country: 'Brasil' },
  { iata: 'NAT', name: 'Grande do Norte (NAT)', city: 'Natal', country: 'Brasil' },
  { iata: 'CNF', name: 'Confins (CNF)', city: 'Belo Horizonte', country: 'Brasil' },
  { iata: 'GYN', name: 'Santa Genoveva (GYN)', city: 'Goiânia', country: 'Brasil' },
  { iata: 'VIX', name: 'Eurico Salles (VIX)', city: 'Vitória', country: 'Brasil' },
  // Portugal
  { iata: 'LIS', name: 'Humberto Delgado (LIS)', city: 'Lisboa', country: 'Portugal' },
  { iata: 'OPO', name: 'Francisco Sá Carneiro (OPO)', city: 'Porto', country: 'Portugal' },
  { iata: 'FAO', name: 'Faro (FAO)', city: 'Faro', country: 'Portugal' },
  // Europa
  { iata: 'CDG', name: 'Charles de Gaulle (CDG)', city: 'Paris', country: 'França' },
  { iata: 'LHR', name: 'Heathrow (LHR)', city: 'Londres', country: 'Reino Unido' },
  { iata: 'MAD', name: 'Barajas (MAD)', city: 'Madrid', country: 'Espanha' },
  { iata: 'BCN', name: 'El Prat (BCN)', city: 'Barcelona', country: 'Espanha' },
  { iata: 'FCO', name: 'Fiumicino (FCO)', city: 'Roma', country: 'Itália' },
  { iata: 'FRA', name: 'Frankfurt (FRA)', city: 'Frankfurt', country: 'Alemanha' },
  { iata: 'AMS', name: 'Schiphol (AMS)', city: 'Amsterdã', country: 'Países Baixos' },
  { iata: 'IST', name: 'Istanbul (IST)', city: 'Istambul', country: 'Turquia' },
  { iata: 'TBS', name: 'Shota Rustaveli (TBS)', city: 'Tbilisi', country: 'Geórgia' },
  // América do Norte
  { iata: 'MIA', name: 'Miami International (MIA)', city: 'Miami', country: 'EUA' },
  { iata: 'JFK', name: 'JFK (JFK)', city: 'Nova York', country: 'EUA' },
  { iata: 'LAX', name: 'LAX (LAX)', city: 'Los Angeles', country: 'EUA' },
  { iata: 'YYZ', name: 'Pearson (YYZ)', city: 'Toronto', country: 'Canadá' },
  // América do Sul
  { iata: 'EZE', name: 'Ezeiza (EZE)', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'SCL', name: 'Arturo Merino Benítez (SCL)', city: 'Santiago', country: 'Chile' },
  { iata: 'BOG', name: 'El Dorado (BOG)', city: 'Bogotá', country: 'Colômbia' },
  { iata: 'LIM', name: 'Jorge Chávez (LIM)', city: 'Lima', country: 'Peru' },
  // Ásia
  { iata: 'NRT', name: 'Narita (NRT)', city: 'Tóquio', country: 'Japão' },
  { iata: 'DXB', name: 'Dubai International (DXB)', city: 'Dubai', country: 'Emirados' },
  { iata: 'SIN', name: 'Changi (SIN)', city: 'Singapura', country: 'Singapura' },
  // África
  { iata: 'JNB', name: 'O.R. Tambo (JNB)', city: 'Joanesburgo', country: 'África do Sul' },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = (searchParams.get('q') ?? '').trim().slice(0, 50) // limitar tamanho

  if (query.length < 1) {
    return NextResponse.json({ airports: [] })
  }

  // Travelpayouts autocomplete — sem autenticação, sempre disponível
  try {
    const { searchAirports } = await import('@/lib/travelpayouts')
    const airports = await searchAirports(query)
    if (airports.length > 0) {
      return NextResponse.json({ airports })
    }
  } catch (error) {
    console.error('Travelpayouts autocomplete error:', error)
    // Cai no fallback abaixo
  }

  // Fallback: filtra lista estática
  const q = query.toLowerCase()
  const filtered = STATIC_AIRPORTS.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, 10)

  return NextResponse.json({ airports: filtered })
}
