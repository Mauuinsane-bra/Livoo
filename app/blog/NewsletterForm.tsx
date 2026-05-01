'use client'

// app/blog/NewsletterForm.tsx
// Simple useState + fetch — works with any React/Next.js version.

import { useState, useRef } from 'react'

interface Props {
  variant?: 'hero' | 'sidebar'
}

export default function NewsletterForm({ variant = 'hero' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = inputRef.current?.value?.trim() ?? ''
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Erro ao cadastrar. Tente novamente.')
        setStatus('error')
      } else {
        setStatus('ok')
      }
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.')
      setStatus('error')
    }
  }

  // ── Sidebar ──────────────────────────────────────────────
  if (variant === 'sidebar') {
    if (status === 'ok') {
      return (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '14px 16px', fontSize: 13.5, color: '#166534', fontWeight: 600, lineHeight: 1.5 }}>
          ✓ Cadastro confirmado! Em breve você recebe nossas novidades.
        </div>
      )
    }
    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13.5, background: '#fff', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
        />
        {status === 'error' && (
          <p style={{ color: '#dc2626', fontSize: 12, margin: '0 0 8px', fontWeight: 600 }}>{errorMsg}</p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ width: '100%', padding: '11px', background: 'var(--ink)', color: '#fff', borderRadius: 10, fontWeight: 800, fontSize: 13, fontFamily: "'Archivo', sans-serif", border: 0, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, transition: 'opacity .15s' }}
        >
          {status === 'loading' ? 'Enviando…' : 'Quero receber'}
        </button>
      </form>
    )
  }

  // ── Hero ─────────────────────────────────────────────────
  if (status === 'ok') {
    return (
      <div style={{ flex: 1, background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '14px 18px', fontSize: 15, color: '#166534', fontWeight: 700, marginTop: 22 }}>
        ✓ Cadastro confirmado! Em breve você recebe nossas novidades.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
      <input
        ref={inputRef}
        type="email"
        name="email"
        required
        placeholder="seu@email.com"
        style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: '2px solid var(--ink)', borderRadius: 14, background: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, outline: 'none' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ padding: '14px 24px', boxShadow: '0 3px 0 #000', letterSpacing: '-.01em', background: 'var(--ink)', color: '#fff', borderRadius: 14, fontWeight: 800, fontSize: 14, fontFamily: "'Archivo', sans-serif", border: 0, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, transition: 'opacity .15s' }}
      >
        {status === 'loading' ? 'Enviando…' : 'Quero receber'}
      </button>
      {status === 'error' && (
        <p style={{ width: '100%', color: '#dc2626', fontSize: 13, margin: '2px 0 0', fontWeight: 600 }}>{errorMsg}</p>
      )}
    </form>
  )
}
