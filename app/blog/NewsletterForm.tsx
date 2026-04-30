'use client'

// app/blog/NewsletterForm.tsx
// Usa Server Action + useFormState: funciona com ou sem JavaScript no browser.

import { useFormState, useFormStatus } from 'react-dom'
import { newsletterSubscribe, type NewsletterState } from './newsletter-action'

// Botão com estado de "enviando" automático via useFormStatus
function SubmitButton({ label, full }: { label: string; full?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        ...(full
          ? { width: '100%', padding: '11px' }
          : { padding: '14px 24px', boxShadow: '0 3px 0 #000', letterSpacing: '-.01em' }),
        background: 'var(--ink)',
        color: '#fff',
        borderRadius: full ? 10 : 14,
        fontWeight: 800,
        fontSize: full ? 13 : 14,
        fontFamily: "'Archivo', sans-serif",
        border: 0,
        cursor: pending ? 'wait' : 'pointer',
        opacity: pending ? 0.7 : 1,
        transition: 'opacity .15s',
      }}
    >
      {pending ? 'Enviando…' : label}
    </button>
  )
}

interface Props {
  variant?: 'hero' | 'sidebar'
}

export default function NewsletterForm({ variant = 'hero' }: Props) {
  const [state, action] = useFormState<NewsletterState, FormData>(newsletterSubscribe, null)

  // Sidebar variant
  if (variant === 'sidebar') {
    if (state?.ok) {
      return (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '14px 16px', fontSize: 13.5, color: '#166534', fontWeight: 600, lineHeight: 1.5 }}>
          ✓ Cadastro confirmado! Em breve você recebe nossas novidades.
        </div>
      )
    }
    return (
      <form action={action}>
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13.5, background: '#fff', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
        />
        {state?.error && (
          <p style={{ color: '#dc2626', fontSize: 12, margin: '0 0 8px', fontWeight: 600 }}>{state.error}</p>
        )}
        <SubmitButton label="Quero receber" full />
      </form>
    )
  }

  // Hero variant
  if (state?.ok) {
    return (
      <div style={{ flex: 1, background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 14, padding: '14px 18px', fontSize: 15, color: '#166534', fontWeight: 700, marginTop: 22 }}>
        ✓ Cadastro confirmado! Em breve você recebe nossas novidades.
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
      <input
        type="email"
        name="email"
        required
        placeholder="seu@email.com"
        style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: '2px solid var(--ink)', borderRadius: 14, background: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, outline: 'none' }}
      />
      <SubmitButton label="Quero receber" />
      {state?.error && (
        <p style={{ width: '100%', color: '#dc2626', fontSize: 13, margin: '2px 0 0', fontWeight: 600 }}>{state.error}</p>
      )}
    </form>
  )
}
