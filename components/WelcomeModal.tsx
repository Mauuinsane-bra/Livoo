'use client'
// components/WelcomeModal.tsx
// Modal de boas-vindas na primeira visita — explica o diferencial em 2 frases
// Usa localStorage para mostrar apenas uma vez

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function WelcomeModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('golivoo_welcomed')) {
        // Pequeno delay para não bloquear a renderização inicial
        const t = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(t)
      }
    } catch { /* localStorage indisponível */ }
  }, [])

  function dismiss() {
    try { localStorage.setItem('golivoo_welcomed', '1') } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,35,64,.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24, padding: '48px 40px',
          maxWidth: 480, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,.3)',
          animation: 'welcomeIn .35s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        {/* Swallow SVG */}
        <div style={{ marginBottom: 24 }}>
          <svg width="52" height="52" viewBox="0 0 100 100" fill="none" style={{ display: 'block', margin: '0 auto' }}>
            <rect width="100" height="100" rx="22" fill="#0F2340"/>
            <path d="M18 62 C25 50, 38 48, 50 50 C62 48, 75 50, 82 62 C75 58, 65 56, 58 62 L50 75 L42 62 C35 56, 25 58, 18 62Z" fill="#F5A800"/>
            <ellipse cx="50" cy="44" rx="14" ry="12" fill="#FF8C42"/>
            <circle cx="56" cy="41" r="5" fill="#fff"/>
            <circle cx="57.5" cy="40" r="2.5" fill="#0F2340"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 28,
          color: 'var(--navy)', margin: '0 0 16px', lineHeight: 1.2,
        }}>
          Não busque passagem.<br />Descreva o que quer viver.
        </h2>

        <p style={{ fontSize: 15, color: 'var(--gray)', lineHeight: 1.6, margin: '0 0 32px' }}>
          A Go Livoo descobre o evento, monta o roteiro completo com voo, hotel e ingressos — e cuida de toda a documentação.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/roteiro"
            onClick={dismiss}
            style={{
              background: 'var(--navy)', color: '#fff',
              padding: '13px 28px', borderRadius: 12,
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}
          >
            Montar meu roteiro
          </Link>
          <button
            onClick={dismiss}
            style={{
              background: 'transparent', border: '1.5px solid var(--border)',
              padding: '13px 24px', borderRadius: 12,
              fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--gray)',
            }}
          >
            Explorar primeiro
          </button>
        </div>
      </div>

      <style>{`
        @keyframes welcomeIn {
          from { opacity: 0; transform: scale(.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
