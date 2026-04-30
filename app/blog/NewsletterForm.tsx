'use client'

import { useState } from 'react'

interface Props {
  variant?: 'hero' | 'sidebar'
}

export default function NewsletterForm({ variant = 'hero' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Leitor Go Livoo', email: email.trim(), interests: [] }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMsg(data.error || 'Algo deu errado. Tente novamente.')
      } else {
        setStatus('ok')
        setMsg('Cadastro realizado! Em breve você receberá nossas novidades.')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMsg('Falha na conexão. Tente novamente.')
    }
  }

  if (variant === 'sidebar') {
    return (
      <form onSubmit={handleSubmit}>
        {status === 'ok' ? (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '14px 16px', fontSize: 13.5, color: '#166534', fontWeight: 600, lineHeight: 1.5 }}>
            ✓ {msg}
          </div>
        ) : (
          <>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={status === 'loading'}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13.5, background: '#fff', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ width: '100%', background: 'var(--ink)', color: '#fff', padding: '11px', borderRadius: 10, fontWeight: 800, fontSize: 13, fontFamily: "'Archivo', sans-serif", border: 0, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Enviando…' : 'Quero receber'}
            </button>
            {status === 'error' && (
              <p style={{ color: '#dc2626', fontSize: 12, margin: '6px 0 0', fontWeight: 600 }}>{msg}</p>
            )}
          </>
        )}
      </form>
    )
  }

  // hero variant
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
      {status === 'ok' ? (
        <div style={{ flex: 1, background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '14px 18px', fontSize: 15, color: '#166534', fontWeight: 700 }}>
          ✓ {msg}
        </div>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={status === 'loading'}
            style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: '2px solid var(--ink)', borderRadius: 14, background: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, outline: 'none' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{ background: 'var(--ink)', color: '#fff', padding: '14px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, fontFamily: "'Archivo', sans-serif", letterSpacing: '-.01em', boxShadow: '0 3px 0 #000', border: 0, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
          >
            {status === 'loading' ? 'Enviando…' : 'Quero receber'}
          </button>
          {status === 'error' && (
            <p style={{ width: '100%', color: '#dc2626', fontSize: 13, margin: '2px 0 0', fontWeight: 600 }}>{msg}</p>
          )}
        </>
      )}
    </form>
  )
}
