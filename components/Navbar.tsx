'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import BirdSVG from './BirdSVG'

const navLinks = [
  { label: 'Passagens', href: '/passagens' },
  { label: 'Hotéis',    href: '/hoteis' },
  { label: 'Eventos',   href: '/eventos' },
  { label: 'Pacotes',   href: '/pacotes' },
  { label: 'Carros',    href: '/carros' },
  { label: 'Ônibus',    href: '/onibus' },
  { label: 'Guias',     href: '/guias' },
  { label: 'Roteiro Completo', href: '/roteiro', highlight: true },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid #D0DCF0',
      boxShadow: '0 2px 12px rgba(13,27,62,0.06)',
    }}>
      {/* Top bar */}
      <div style={{
        background: '#0D1B3E',
        color: '#fff',
        fontSize: '0.75rem',
        textAlign: 'center',
        padding: '6px 24px',
        letterSpacing: '0.3px',
      }}>
        Plataforma em construção — acesso antecipado disponível
      </div>

      {/* Main navbar */}
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <BirdSVG variant="navbar" size={34} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-name">
              Go Livoo<span className="logo-dot">.</span>
            </span>
            <small className="logo-tagline">Vá mais longe por menos</small>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'nowrap',
        }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.82rem',
                fontWeight: link.highlight ? 700 : 500,
                color: link.highlight ? '#1A56DB' : '#5A6A80',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 8,
                transition: 'color 0.2s, background 0.2s',
                background: link.highlight ? '#EEF4FF' : 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons — desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="hidden-mobile">

          {/* Usuário não logado */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-gold" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
                Criar conta
              </button>
            </SignUpButton>
          </SignedOut>

          {/* Usuário logado */}
          <SignedIn>
            <Link
              href="/#acesso-antecipado"
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 18px' }}
            >
              Meus Roteiros
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: 36, height: 36 },
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
          className="show-mobile"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0D1B3E">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" stroke="#0D1B3E" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" stroke="#0D1B3E" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: '#fff',
          borderTop: '1px solid #D0DCF0',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.95rem',
                fontWeight: link.highlight ? 700 : 500,
                color: link.highlight ? '#1A56DB' : '#0D1B3E',
                textDecoration: 'none',
                borderBottom: '1px solid #EEF4FF',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-outline" style={{ flex: 1 }}>Entrar</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-gold" style={{ flex: 1 }}>Criar conta</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
