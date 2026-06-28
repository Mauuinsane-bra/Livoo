// lib/home-events.ts
// Fonte única dos eventos exibidos na home (banner de destaque + grade).
//
// REGRA: a home mostra SOMENTE eventos futuros. Cada evento tem uma data real
// (ISO YYYY-MM-DD). `getUpcomingEvents()` filtra os vencidos automaticamente —
// nunca mais é preciso remover evento à mão quando a data passa.
//
// Etapa B (painel Sanity): `getHomeEvents()` vai tentar buscar eventos do Sanity
// e, se vazio, cair nesta lista estática. Por isso o tipo HomeEventItem é o
// contrato compartilhado entre as duas fontes.

export interface HomeEventItem {
  /** Data de início no formato ISO 'YYYY-MM-DD'. */
  date: string
  /** Data de término (opcional, para eventos de vários dias). Usada no filtro de "vencido". */
  endDate?: string
  title: string
  loc: string
  /** Rótulo curto da categoria, ex: 'FESTIVAL · 5 DIAS'. */
  cat: string
  /** Selo no canto do card, ex: 'POPULAR' ou 'Julho 2026'. */
  tag: string
  /** Itens inclusos no roteiro. */
  chips: string[]
  href: string
  imageUrl: string
}

const MONTHS_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

/** Retorna { month: 'JUL', day: '17' } a partir de uma data ISO. */
export function monthDayLabel(iso: string): { month: string; day: string } {
  const [, m, d] = iso.split('-')
  const monthIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1))
  return { month: MONTHS_PT[monthIdx], day: String(parseInt(d, 10)).padStart(2, '0') }
}

/**
 * Filtra eventos vencidos e ordena do mais próximo para o mais distante.
 * Comparação por string ISO 'YYYY-MM-DD' (ordenação lexicográfica = cronológica),
 * evitando problemas de fuso horário no servidor.
 */
export function getUpcomingEvents(events: HomeEventItem[], now: Date = new Date()): HomeEventItem[] {
  const todayISO = now.toISOString().slice(0, 10)
  return events
    .filter((e) => (e.endDate ?? e.date) >= todayISO)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// ── Lista estática (reserva) ─────────────────────────────────────────────────
// Datas reais. Eventos vencidos permanecem aqui sem problema: o filtro os esconde.
// Fotos Unsplash já validadas visualmente (ver tabela de sprints no CLAUDE.md).
export const STATIC_HOME_EVENTS: HomeEventItem[] = [
  {
    date: '2026-07-17', endDate: '2026-07-19',
    title: 'Tomorrowland 2026', loc: 'Boom, Bélgica',
    cat: 'FESTIVAL · 5 DIAS', tag: 'Julho 2026',
    chips: ['Voo', 'Dreamville', 'Full Madness'],
    href: '/eventos',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
  },
  {
    date: '2026-09-03', endDate: '2026-09-13',
    title: 'Rock in Rio 2026', loc: 'Rio de Janeiro · Brasil',
    cat: 'FESTIVAL · 3 DIAS', tag: 'POPULAR',
    chips: ['Voo', 'Hotel: 3 noites Copa', 'Ingresso'],
    href: '/eventos/rock-in-rio',
    imageUrl: 'https://images.unsplash.com/photo-1521547480571-2b6061babf76?auto=format&fit=crop&w=900&q=80',
  },
  {
    date: '2026-10-03', endDate: '2026-10-19',
    title: 'Oktoberfest de Munique', loc: 'Munique, Alemanha',
    cat: 'CULTURA · 16 DIAS', tag: 'Outubro 2026',
    chips: ['Voo', 'Hotel: 5 noites', 'Tenda reservada'],
    href: '/eventos',
    imageUrl: 'https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?auto=format&fit=crop&w=900&q=80',
  },
  {
    date: '2026-11-08', endDate: '2026-11-15',
    title: 'Rota Omakase em Tóquio', loc: 'Tóquio, Japão',
    cat: 'GASTRONOMIA · 7 NOITES', tag: 'Novembro 2026',
    chips: ['Voo', 'Hotel: Ginza', '6 balcões'],
    href: '/eventos',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
  },
  // ── Vencidos (mantidos só como registro; o filtro os esconde) ──
  {
    date: '2026-05-24',
    title: 'GP de Mônaco — Tribuna K', loc: 'Monte Carlo, Mônaco',
    cat: 'F1 · DOMINGO', tag: 'Mônaco 2026',
    chips: ['Voo', 'Hotel: 4 noites', 'Ingresso', 'Heli'],
    href: '/eventos/f1-monaco',
    imageUrl: 'https://images.unsplash.com/photo-1752884991193-f40e0018e483?auto=format&fit=crop&w=900&q=80',
  },
]
