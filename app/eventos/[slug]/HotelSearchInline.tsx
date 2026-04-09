'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  city:              string
  suggestedCheckIn:  string
  suggestedCheckOut: string
}

export default function HotelSearchInline({ city, suggestedCheckIn, suggestedCheckOut }: Props) {
  const router = useRouter()
  const [checkIn,  setCheckIn]  = useState(suggestedCheckIn)
  const [checkOut, setCheckOut] = useState(suggestedCheckOut)
  const [adults,   setAdults]   = useState(1)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const qs = new URLSearchParams({
      location: city,
      checkIn,
      checkOut,
      adults: String(adults),
    })
    router.push(`/hoteis?${qs}`)
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
        🏨 Hotéis em {city}
      </h3>

      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Destino — fixo */}
        <div>
          <label style={labelStyle}>Destino</label>
          <div style={{
            ...inputStyle,
            background: '#EEF4FF', color: '#1A56DB', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>📍</span> {city}
          </div>
        </div>

        {/* Datas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={labelStyle}>Check-in</label>
            <input type="date" style={inputStyle} value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Check-out</label>
            <input type="date" style={inputStyle} value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
          </div>
        </div>

        {/* Hóspedes */}
        <div>
          <label style={labelStyle}>Hóspedes</label>
          <input
            type="number" min={1} max={10}
            style={inputStyle}
            value={adults}
            onChange={e => setAdults(parseInt(e.target.value) || 1)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '11px', fontSize: '0.88rem', fontWeight: 700 }}
        >
          Ver hotéis disponíveis
        </button>
      </form>
    </div>
  )
}
