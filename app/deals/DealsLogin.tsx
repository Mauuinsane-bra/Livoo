'use client'

import { useState } from 'react'

export default function DealsLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await fetch('/api/deals/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json().catch(() => ({}))
        setErr(data.error || 'senha incorreta')
      }
    } catch {
      setErr('erro de conexao')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form
        onSubmit={submit}
        style={{ width: '100%', maxWidth: 360, background: '#fff', border: '1px solid #D0DCF0', borderRadius: 12, padding: 28 }}
      >
        <h1 style={{ fontSize: 20, color: '#0D1B3E', margin: '0 0 6px' }}>Radar de passagens</h1>
        <p style={{ fontSize: 13, color: '#5A6A80', margin: '0 0 18px' }}>Area privada. Informe a senha de acesso.</p>

        {!configured && (
          <p style={{ fontSize: 12, color: '#B45309', background: '#FFF8EC', padding: 10, borderRadius: 8, margin: '0 0 14px' }}>
            Gate ainda nao configurado: defina DEALS_PAGE_PASSWORD no ambiente.
          </p>
        )}

        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Senha"
          autoFocus
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #D0DCF0', borderRadius: 8, fontSize: 14, marginBottom: 12 }}
        />

        {err && <p style={{ color: '#DC2626', fontSize: 12, margin: '0 0 12px' }}>{err}</p>}

        <button
          type="submit"
          disabled={loading || !pw}
          style={{ width: '100%', padding: '11px 0', background: '#0D1B3E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading || !pw ? 0.6 : 1 }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
