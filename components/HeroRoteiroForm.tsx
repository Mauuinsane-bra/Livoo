'use client'
// components/HeroRoteiroForm.tsx
// Form-herói da homepage: o visitante descreve a experiência/destino e é
// levado ao /roteiro com o campo já preenchido. É o CTA principal do site.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics'

const EXAMPLES = ['GP de Mônaco', 'Oktoberfest em Munique', 'Rock in Rio', 'Cerejeiras em Tóquio']

export default function HeroRoteiroForm() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function go(destination: string, source: 'input' | 'chip') {
    const dest = destination.trim()
    track('home_hero_cta', { destination: dest || '(vazio)', source })
    router.push(dest ? `/roteiro?destination=${encodeURIComponent(dest)}` : '/roteiro')
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 18, boxShadow: '0 8px 32px rgba(15,35,64,0.08)' }}>
      <form
        onSubmit={e => { e.preventDefault(); go(value, 'input') }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder='Ex: "GP de Mônaco", "aurora boreal", "Lisboa em setembro"...'
          aria-label="Que experiência você quer viver?"
          style={{
            flex: 1, minWidth: 220, border: '1.5px solid var(--line)', borderRadius: 12,
            padding: '15px 16px', fontSize: 15, fontFamily: 'Inter, sans-serif',
            color: '#0F2340', outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#F5A800', color: '#0F2340', border: 0, borderRadius: 12,
            padding: '15px 26px', fontFamily: 'Nunito, sans-serif', fontWeight: 800,
            fontSize: 15.5, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Montar meu roteiro →
        </button>
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Tente:
        </span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => go(ex, 'chip')}
            style={{
              background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 999,
              padding: '6px 13px', fontSize: 12.5, fontFamily: 'Inter, sans-serif',
              color: '#0F2340', cursor: 'pointer', fontWeight: 500,
            }}
          >
            {ex}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: 'var(--muted)', margin: '12px 2px 0' }}>
        Preview gratuito na hora · Roteiro completo dia a dia, com PDF no seu e-mail, por R$ 29,90
      </p>
    </div>
  )
}
