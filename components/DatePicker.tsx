'use client'

import { useState } from 'react'

interface DatePickerProps {
  label: string
  value: string          // 'YYYY-MM-DD' ou '' para flexível
  onChange: (v: string) => void
  min?: string
  max?: string
  placeholder?: string
  /** Quando true, usa label claro para fundo escuro */
  dark?: boolean
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d} ${months[parseInt(m) - 1]} ${y}`
}

export default function DatePicker({ label, value, onChange, min, max, placeholder = 'Selecione a data', dark = false }: DatePickerProps) {
  const [focused, setFocused] = useState(false)
  const [flexible, setFlexible] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const minDate = min ?? today

  const handleFlexible = () => {
    setFlexible(true)
    onChange('')
  }

  const handleDateChange = (v: string) => {
    setFlexible(false)
    onChange(v)
  }

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: dark ? 'rgba(255,255,255,0.6)' : '#64748B',
        marginBottom: 6,
      }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        {/* Valor exibido (estilizado) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '11px 14px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          color: flexible ? '#1A82D8' : value ? '#0F2340' : '#9BA8B8',
          fontStyle: flexible ? 'italic' : 'normal',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          background: flexible ? '#fafaf7' : '#fff',
          borderRadius: 10,
          border: `1.5px solid ${focused ? '#1A82D8' : flexible ? '#1A82D8' : '#E2E8F0'}`,
          transition: 'all 0.2s',
          zIndex: 1,
        }}>
          {flexible ? 'Não decidi — buscando melhores preços' : value ? formatDisplay(value) : placeholder}
        </div>

        {/* Input nativo transparente por cima — aciona o calendário do browser */}
        {!flexible && (
          <input
            type="date"
            value={value}
            min={minDate}
            max={max}
            onChange={e => handleDateChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              padding: '11px 14px',
              border: `1.5px solid transparent`,
              borderRadius: 10,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              color: 'transparent',
              background: 'transparent',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        )}

        {/* Botão limpar quando flexível */}
        {flexible && (
          <button
            onClick={() => { setFlexible(false); onChange('') }}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1A82D8',
              fontSize: '1rem',
              lineHeight: 1,
              padding: 2,
            }}
            title="Escolher data"
          >
            ×
          </button>
        )}
      </div>

      {/* Link "Não decidi" */}
      {!flexible && (
        <button
          onClick={handleFlexible}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem',
            color: '#1A82D8',
            padding: '4px 0 0',
            textDecoration: 'underline',
            display: 'block',
          }}
        >
          Não decidi ainda
        </button>
      )}
    </div>
  )
}
