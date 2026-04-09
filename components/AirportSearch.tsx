'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface Airport {
  iata:      string
  skyId?:    string   // Skyscanner skyId (geralmente = IATA)
  entityId?: string   // Skyscanner entityId (necessário para busca de voos)
  name:      string
  city:      string
  country:   string
}

interface AirportSearchProps {
  placeholder?: string
  value?: Airport | null
  onChange: (airport: Airport | null) => void
  label?: string
}

export default function AirportSearch({ placeholder = 'Cidade ou aeroporto', value, onChange, label }: AirportSearchProps) {
  const [query,   setQuery]   = useState(value ? `${value.city} (${value.iata})` : '')
  const [results, setResults] = useState<Airport[]>([])
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Sincroniza se valor externo mudar
  useEffect(() => {
    if (value) setQuery(`${value.city} (${value.iata})`)
    else setQuery('')
  }, [value])

  const fetchAirports = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res  = await fetch(`/api/airports?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      const list: Airport[] = (data.airports ?? []).map((a: Airport) => ({
        iata:     a.iata,
        skyId:    a.skyId    || a.iata,
        entityId: a.entityId || '',
        city:     a.city,
        name:     a.name,
        country:  a.country,
      }))
      setResults(list)
      setOpen(list.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    onChange(null) // limpa selecao ao digitar

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchAirports(q), 220)
  }

  function handleSelect(airport: Airport) {
    onChange(airport)
    setQuery(`${airport.city} (${airport.iata})`)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#5A6A80',
          marginBottom: 6,
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => {
            setFocused(true)
            if (results.length > 0) setOpen(true)
            else if (query.length >= 1) fetchAirports(query)
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '11px 36px 11px 14px',
            border: `1.5px solid ${focused ? '#1A56DB' : '#D0DCF0'}`,
            borderRadius: 10,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.9rem',
            color: '#0D1B3E',
            background: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />

        {/* Icone / spinner */}
        <span style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: value ? '#1A56DB' : '#5A6A80',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}>
          {loading
            ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #D0DCF0', borderTop: '2px solid #1A56DB', borderRadius: '50%', animation: 'spinAirport 0.6s linear infinite' }} />
            : <span style={{ fontSize: '1rem' }}>&#9992;</span>
          }
        </span>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1.5px solid #D0DCF0',
          borderRadius: 10,
          boxShadow: '0 8px 32px rgba(13,27,62,0.12)',
          zIndex: 200,
          overflow: 'hidden',
          maxHeight: 300,
          overflowY: 'auto',
        }}>
          {results.map((airport, i) => (
            <button
              key={`${airport.iata}-${i}`}
              type="button"
              onMouseDown={() => handleSelect(airport)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: i < results.length - 1 ? '1px solid #F4F7FF' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F4F7FF')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {/* IATA badge */}
              <span style={{
                minWidth: 40,
                background: '#EEF4FF',
                color: '#1A56DB',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 6px',
                borderRadius: 6,
                textAlign: 'center',
              }}>
                {airport.iata}
              </span>
              {/* Info */}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'block',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#0D1B3E',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {airport.city}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: '#5A6A80',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {airport.name}{airport.country ? ` · ${airport.country}` : ''}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spinAirport { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
