'use client'

import { useState } from 'react'

const interestOptions = [
  'Esportes',
  'Shows & Festivais',
  'Gastronomia',
  'Aventura',
  'Automobilismo',
  'Cultura',
  'Ecoturismo',
  'Viagem corporativa',
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setErrorMsg('Você precisa aceitar a política de privacidade para continuar.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, interests }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Algo deu errado. Tente novamente.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(245,166,35,0.3)',
        borderRadius: 16,
        padding: 36,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontFamily: 'Fraunces, serif', color: '#F5A623', fontSize: '1.4rem', marginBottom: 8 }}>
          Você está na lista!
        </h3>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
          Você será um dos primeiros a saber quando a Livoo abrir. Fique de olho no email <strong style={{ color: '#fff' }}>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Nome e Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Seu nome"
          required
          className="input-field"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Seu email"
          required
          className="input-field"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}
        />
      </div>

      {/* Interesses */}
      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
        O que você mais gosta de viver nas viagens? (opcional)
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {interestOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleInterest(opt)}
            style={{
              padding: '5px 12px',
              borderRadius: 50,
              border: `1.5px solid ${interests.includes(opt) ? '#F5A623' : 'rgba(255,255,255,0.2)'}`,
              background: interests.includes(opt) ? 'rgba(245,166,35,0.15)' : 'transparent',
              color: interests.includes(opt) ? '#F5A623' : 'rgba(255,255,255,0.55)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Consent LGPD */}
      <label style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        marginBottom: 20,
        cursor: 'pointer',
        textAlign: 'left',
      }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          style={{ marginTop: 3, accentColor: '#F5A623', width: 15, height: 15, flexShrink: 0 }}
        />
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
          Concordo com a{' '}
          <a href="/privacidade" style={{ color: '#F5A623', textDecoration: 'underline' }}>
            Política de Privacidade
          </a>{' '}
          e autorizo o uso do meu email para comunicações da Go Livoo. Posso cancelar a qualquer momento.
        </span>
      </label>

      {errorMsg && (
        <p style={{
          background: 'rgba(220,38,38,0.15)',
          border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#fca5a5',
          fontSize: '0.85rem',
          marginBottom: 16,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gold"
        style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: status === 'loading' ? 0.7 : 1 }}
      >
        {status === 'loading' ? 'Enviando...' : 'Quero acesso antecipado'}
      </button>
    </form>
  )
}
