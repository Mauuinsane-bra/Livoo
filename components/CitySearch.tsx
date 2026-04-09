'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface CityOption {
  city: string
  country: string
  iata?: string
}

interface Props {
  value: string
  onChange: (city: string) => void
  placeholder?: string
  inputStyle?: React.CSSProperties
  dark?: boolean        // true = fundo navy (formulários de busca)
  required?: boolean
}

export default function CitySearch({
  value,
  onChange,
  placeholder = 'Ex: São Paulo',
  inputStyle,
  dark = true,
  required = false,
}: Props) {
  const [query,       setQuery]       = useState(value)
  const [options,     setOptions]     = useState<CityOption[]>([])
  const [open,        setOpen]        = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef  = useRef<HTMLDivElement>(null)

  // Sincroniza query quando value muda externamente
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setOptions([]); return }
    setLoading(true)
    try {
      const res  = await fetch(`/api/airports?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      // Deduplica por cidade — cada cidade aparece uma vez
      const seen = new Set<string>()
      const cities: CityOption[] = []
      for (const a of (data.airports ?? [])) {
        const key = `${a.city}|${a.country}`
        if (!seen.has(key)) {
          seen.add(key)
          cities.push({ city: a.city, country: a.country, iata: a.iata })
        }
      }
      setOptions(cities)
      setOpen(cities.length > 0)
    } catch {
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    onChange(q) // propaga mesmo antes de selecionar (para validação)
    setHighlighted(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 280)
  }

  function handleSelect(opt: CityOption) {
    setQuery(opt.city)
    onChange(opt.city)
    setOpen(false)
    setOptions([])
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      handleSelect(options[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const baseInput: React.CSSProperties = dark ? {
    width: '100%', padding: '12px 14px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem',
    background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
    borderRadius: 10, color: '#fff', outline: 'none',
    boxSizing: 'border-box',
    ...inputStyle,
  } : {
    width: '100%', padding: '12px 14px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem',
    background: '#fff', border: '1.5px solid #D0DCF0',
    borderRadius: 10, color: '#0D1B3E', outline: 'none',
    boxSizing: 'border-box',
    ...inputStyle,
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && options.length > 0 && setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={baseInput}
      />

      {/* Indicador de loading */}
      {loading && (
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.7rem',
          color: dark ? 'rgba(255,255,255,0.5)' : '#5A6A80',
        }}>
          ...
        </span>
      )}

      {/* Dropdown */}
      {open && options.length > 0 && (
        <ul style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '1px solid #D0DCF0',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(13,27,62,0.12)',
          listStyle: 'none', margin: 0, padding: 4,
          maxHeight: 280, overflowY: 'auto',
        }}>
          {options.map((opt, i) => (
            <li
              key={`${opt.city}-${opt.country}`}
              onMouseDown={() => handleSelect(opt)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                background: highlighted === i ? '#EEF4FF' : 'transparent',
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.9rem', color: '#0D1B3E', fontWeight: 500,
              }}>
                {opt.city}
              </span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.78rem', color: '#5A6A80',
              }}>
                {opt.country}
              </span>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        input::placeholder { color: ${dark ? 'rgba(255,255,255,0.45)' : '#9BA8BC'} !important; }
      `}</style>
    </div>
  )
}
