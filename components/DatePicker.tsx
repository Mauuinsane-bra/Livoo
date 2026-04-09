'use client'

import { useState } from 'react'

interface DatePickerProps {
  label: string
  value: string          // 'YYYY-MM-DD'
  onChange: (v: string) => void
  min?: string
  max?: string
  placeholder?: string
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d} ${months[parseInt(m) - 1]} ${y}`
}

export default function DatePicker({ label, value, onChange, min, max, placeholder = 'Selecione a data' }: DatePickerProps) {
  const [focused, setFocused] = useState(false)

  // min padrão = hoje
  const today = new Date().toISOString().split('T')[0]
  const minDate = min ?? today

  return (
    <div style={{ position: 'relative' }}>
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

      <div style={{ position: 'relative' }}>
        {/* Valor exibido (estilizado) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '11px 36px 11px 14px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.9rem',
          color: value ? '#0D1B3E' : '#9BA8B8',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 10,
          border: `1.5px solid ${focused ? '#1A56DB' : '#D0DCF0'}`,
          transition: 'border-color 0.2s',
          zIndex: 1,
        }}>
          {value ? formatDisplay(value) : placeholder}
        </div>

        {/* Ícone calendário */}
        <span style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? '#1A56DB' : '#5A6A80',
          fontSize: '1rem',
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'color 0.2s',
        }}>
          📅
        </span>

        {/* Input nativo transparente por cima — aciona o calendário do browser */}
        <input
          type="date"
          value={value}
          min={minDate}
          max={max}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            padding: '11px 36px 11px 14px',
            border: `1.5px solid transparent`,
            borderRadius: 10,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.9rem',
            color: 'transparent',   // texto oculto — mostramos o div estilizado
            background: 'transparent',
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
          }}
        />
      </div>
    </div>
  )
}
