'use client'
// app/blog/NewsletterForm.tsx — Formulário de newsletter funcional (client component)

import { useState } from 'react'

type Variant = 'hero' | 'sidebar'

export default function NewsletterForm({ variant = 'hero' }: { variant?: Variant }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Leitor Go Livoo', email: email.trim(), interests: [] }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMsg('Cadastro confirmado! Em breve novidades no seu email 📩')
        setEmail('')
      } else {
        setStatus('error')
        setMsg(data.error ?? 'Tente novamente.')
      }
    } catch {
      setStatus('error')
      setMsg('Erro de conexão. Tente novamente.')
    }
  }

  if (variant === 'sidebar') {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          disabled={status === 'loading' || status === 'ok'}
          required
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13.5, background: '#fff', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
        />
        {status === 'ok' || status === 'error' ? (
          <p style={{ fontSize: 12.5, margin: '0 0 8px', color: status === 'ok' ? 'var(--green, #22c55e)' : 'var(--red, #ef4444)', fontWeight: 600 }}>
            {msg}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === 'loading' || status === 'ok'}
          style={{ width: '100%', background: 'var(--ink)', color: '#fff', padding: '11px', borderRadius: 10, fontWeight: 800, fontSize: 13, fontFamily: "'Archivo', sans-serif", border: 0, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'ok' ? .6 : 1 }}
        >
          {status === 'loading' ? 'Cadastrando...' : status === 'ok' ? '✓ Cadastrado!' : 'Quero receber'}
        </button>
      </form>
    )
  }

  // variant === 'hero'
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        disabled={status === 'loading' || status === 'ok'}
        required
        style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: '2px solid var(--ink)', borderRadius: 14, background: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, outline: 'none' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'ok'}
          style={{ background: 'var(--ink)', color: '#fff', padding: '14px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, fontFamily: "'Archivo', sans-serif", letterSpacing: '-.01em', boxShadow: '0 3px 0 #000', border: 0, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'ok' ? .6 : 1 }}
        >
          {status === 'loading' ? 'Cadastrando...' : status === 'ok' ? '✓ Cadastrado!' : 'Quero receber'}
        </button>
        {(status === 'ok' || status === 'error') && (
          <span style={{ fontSize: 12, color: status === 'ok' ? '#22c55e' : '#ef4444', fontWeight: 600, paddingLeft: 4 }}>
            {msg}
          </span>
        )}
      </div>
    </form>
  )
}
