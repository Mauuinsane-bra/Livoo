'use client'

import { useEffect, useState } from 'react'

/**
 * Cache global dos preços — evita refetch entre componentes na mesma página.
 * Preenchido na primeira montagem, reutilizado por todas as instâncias.
 */
let priceCache: Record<string, { price: number; departDate: string }> | null = null
let fetchPromise: Promise<void> | null = null

async function ensurePrices() {
  if (priceCache) return
  if (fetchPromise) { await fetchPromise; return }

  fetchPromise = fetch('/api/event-prices')
    .then(r => r.json())
    .then(data => { priceCache = data.prices || {} })
    .catch(() => { priceCache = {} })

  await fetchPromise
}

interface Props {
  iata: string
  /** Estilo visual: 'badge' (compacto) ou 'line' (texto inline) */
  variant?: 'badge' | 'line'
}

export default function EventPriceTag({ iata, variant = 'badge' }: Props) {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ensurePrices().then(() => {
      const p = priceCache?.[iata.toUpperCase()]
      setPrice(p?.price ?? null)
      setLoading(false)
    })
  }, [iata])

  if (loading) {
    return (
      <span style={{
        display: 'inline-block',
        background: '#F4F6F9',
        borderRadius: 8,
        padding: variant === 'badge' ? '4px 12px' : '2px 8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: variant === 'badge' ? '0.72rem' : '0.78rem',
        color: '#94A3B8',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        carregando...
      </span>
    )
  }

  if (!price) return null

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  if (variant === 'line') {
    return (
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.82rem',
        color: '#16a34a',
        fontWeight: 600,
      }}>
        voos a partir de {formatted}
      </span>
    )
  }

  // variant === 'badge'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'rgba(22, 163, 106, 0.08)',
      border: '1px solid rgba(22, 163, 106, 0.2)',
      borderRadius: 8,
      padding: '4px 10px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.72rem',
      fontWeight: 700,
      color: '#16a34a',
      whiteSpace: 'nowrap',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
      </svg>
      a partir de {formatted}
    </span>
  )
}
