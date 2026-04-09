'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AirportSearch, { type Airport } from '@/components/AirportSearch'

interface Props {
  destinationIata:  string
  destinationLabel: string
  suggestedDate:    string
}

export default function FlightSearchInline({ destinationIata, destinationLabel, suggestedDate }: Props) {
  const router = useRouter()
  const [origin, setOrigin] = useState<Airport | null>(null)
  const [date,   setDate]   = useState(suggestedDate)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!origin) return
    const qs = new URLSearchParams({
      origin:      origin.iata,
      destination: destinationIata,
      date,
      passengers:  '1',
    })
    router.push(`/passagens?${qs}`)
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.7rem', fontWeight: 700,
    color: '#5A6A80', textTransform: 'uppercase',
    letterSpacing: '0.8px', display: 'block', marginBottom: 5,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
    background: '#F4F7FF', border: '1.5px solid #D0DCF0',
    borderRadius: 8, color: '#0D1B3E', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px',
      boxShadow: '0 4px 20px rgba(13,27,62,0.08)',
      border: '1px solid #D0DCF0',
    }}>
      <h3 style={{
        fontFamily: 'Fraunces, serif', fontSize: '0.95rem',
        color: '#0D1B3E', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        ✈️ Buscar voo para {destinationLabel.split(',')[0]}
      </h3>

      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Origem */}
        <div>
          <label style={labelStyle}>Sua cidade de origem</label>
          <AirportSearch
            placeholder="De onde você vai partir?"
            value={origin}
            onChange={setOrigin}
          />
        </div>

        {/* Destino — fixo */}
        <div>
          <label style={labelStyle}>Destino</label>
          <div style={{
            ...inputStyle,
            background: '#EEF4FF', color: '#1A56DB', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>📍</span> {destinationLabel} ({destinationIata})
          </div>
        </div>

        {/* Data */}
        <div>
          <label style={labelStyle}>Data de ida</label>
          <input
            type="date"
            style={inputStyle}
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!origin}
          className="btn-primary"
          style={{
            width: '100%', padding: '11px',
            fontSize: '0.88rem', fontWeight: 700,
            opacity: origin ? 1 : 0.5, cursor: origin ? 'pointer' : 'not-allowed',
          }}
        >
          Ver voos disponíveis
        </button>
      </form>
    </div>
  )
}
