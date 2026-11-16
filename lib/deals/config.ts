// lib/deals/config.ts
// Buscador pessoal de passagens em promoção — uso exclusivo do dono do site.
// Isolado em lib/deals + app/deals + app/api/deals para não acoplar ao site público.

export interface DealRoute {
  dest: string   // IATA (city code)
  name: string   // nome amigável
  dream: number  // alvo "sonho" — tarifa-erro / super promo (alerta prioritário)
  good: number   // alvo "bom" — preço realista (alerta informativo)
}

export const DEALS_CONFIG = {
  // Origem canônica. CWB/FLN não têm cobertura intercontinental no cache da Travelpayouts;
  // na prática tudo conecta por GRU de qualquer forma.
  origin: 'GRU',
  currency: 'brl',

  // Janela de viagem: mar–mai/2027, ~20 dias (volta cai no mês seguinte).
  departMonths: ['2027-03', '2027-04', '2027-05'] as string[],
  returnSpanMonths: 1,

  routes: [
    { dest: 'MAD', name: 'Madri',   dream: 3000, good: 3700 },
    { dest: 'ROM', name: 'Roma',    dream: 3000, good: 3700 },
    { dest: 'LON', name: 'Londres', dream: 3000, good: 4300 },
    { dest: 'BJS', name: 'Pequim',  dream: 4500, good: 5000 },
    { dest: 'TYO', name: 'Toquio',  dream: 4500, good: 5500 },
  ] as DealRoute[],

  // Queda relativa: alerta se o preço cair X% abaixo da própria mínima dos últimos 30 dias.
  relativeDropPct: 15,

  wildcard: {
    enabled: true,
    maxPrice: 3500, // destino intercontinental abaixo disso vira alerta-surpresa
    // domésticos BR + América do Sul vizinha — ignorados na varredura surpresa
    ignore: [
      'FLN', 'BHZ', 'VIX', 'RIO', 'GIG', 'SDU', 'REC', 'FOR', 'BPS', 'SLZ',
      'MCZ', 'SSA', 'NAT', 'THE', 'JPA', 'IGU', 'JDO', 'CWB', 'POA', 'CGB',
      'CGR', 'MAO', 'BEL', 'GYN', 'BSB', 'VCP', 'CNF', 'MGF', 'NVT', 'JOI',
      'LDB', 'CXJ', 'PMW', 'AJU', 'CGH', 'GRU', 'SCL', 'BUE', 'MVD', 'ASU',
      'LIM', 'EZE', 'AEP', 'MDE', 'BOG', 'UIO', 'CCS', 'LPB', 'VVI',
    ] as string[],
  },
}

// 'YYYY-MM' + offset de meses -> 'YYYY-MM'
export function addMonth(month: string, add: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + add, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
