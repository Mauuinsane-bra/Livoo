// lib/roteiro-types.ts
// Tipos compartilhados do roteiro — usados pela API, pelo motor (roteiro-engine)
// e pelo gerador de PDF. Ficam fora de app/api para evitar import circular.

export interface BudgetCategory {
  category: string
  estimated: number
  percentage: number
  tip: string
}

export interface HighlightItem {
  day: string
  title: string
  desc: string
}

export interface DayActivity {
  time: string
  title: string
  desc: string
  link?: string
}

export interface DayRestaurant {
  name: string
  desc: string
}

export interface DayPlan {
  day: number
  title: string
  activities: DayActivity[]
  /** Curiosidade histórica/cultural única do dia (etimologia, fato escondido). */
  curiosity?: string
  /** Joia escondida "por perto" — lugar fora do circuito turístico óbvio. */
  hiddenGem?: string
  /** Dica de viajante experiente (horário, fila, golpe a evitar, atalho). */
  travelerTip?: string
  /** Restaurantes recomendados com descrição curta. */
  restaurants?: DayRestaurant[]
}

export interface ChecklistSection {
  category: string
  items: string[]
}

export interface PreviewData {
  destination: string
  destinationIATA: string
  duration: string
  totalBudget: number
  budgetBreakdown: BudgetCategory[]
  highlights: HighlightItem[]
  visaInfo: string
  bestTime: string
}

export interface FullItinerary extends PreviewData {
  dayByDay: DayPlan[]
  flightLink: string
  hotelLink: string
  checklist: ChecklistSection[]
}
