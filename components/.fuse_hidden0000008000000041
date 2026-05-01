'use client'

import EventPriceTag from '@/components/EventPriceTag'

/**
 * Exibe preço dinâmico de voo (via Travelpayouts) dentro dos cards de pacote.
 * Recebe uma lista de IATA codes dos eventos do pacote e mostra o menor.
 */
export default function PackagePriceRow({ iatas }: { iatas: string[] }) {
  // Filtra IATAs válidos (não vazios e não GRU — que é a origem)
  const validIatas = iatas.filter(c => c && c !== 'GRU')

  if (validIatas.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
      {/* Mostra o price tag do primeiro IATA válido como representativo */}
      <EventPriceTag iata={validIatas[0]} variant="badge" />
    </div>
  )
}
