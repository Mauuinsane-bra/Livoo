'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import BirdSVG from './BirdSVG'

const catTabs = [
  {
    // Avião de papel / voo
    label: 'Passagens', href: '/passagens',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/><path d="M10.5 13.5L14 10"/></svg>,
  },
  {
    // Calendário com estrela
    label: 'Eventos', href: '/eventos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14l.8 1.6 1.8.3-1.3 1.2.3 1.8L12 18l-1.6.9.3-1.8-1.3-1.2 1.8-.3L12 14z"/></svg>,
  },
  {
    // Cama de hotel (H com cama)
    label: 'Hotéis', href: '/hoteis',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V10a2 2 0 012-2h16a2 2 0 012 2v10"/><path d="M2 20h20"/><path d="M6 8V4"/><path d="M18 8V4"/><path d="M2 14h20"/><rect x="6" y="14" width="5" height="6"/></svg>,
  },
  {
    // Mala de viagem
    label: 'Pacotes', href: '/pacotes',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="14" rx="2"/><path d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/></svg>,
  },
  {
    // Carro sedan simples
    label: 'Carros', href: '/carros',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a1 1 0 01-1-1v-4l2.5-6h13l2.5 6V16a1 1 0 01-1 1h-2"/><path d="M7 9h10"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>,
  },
  {
    // Ônibus de lado
    label: 'Ônibus', href: '/onibus',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="13" rx="2"/><path d="M1 10h22"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="20" r="2"/><path d="M6 17v-4m12 4v-4"/><path d="M4 17h16"/></svg>,
  },
  {
    // Pessoa com pin de localização
    label: 'Guias', href: '/guias',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M12 12v2"/><path d="M10 21a2 2 0 004 0"/><path d="M6.2 18.4A8 8 0 0112 16a8 8 0 015.8 2.4"/></svg>,
  },
  {
    // Passaporte
    label: 'Documentação', href: '/prep',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M4 7h16M4 17h16"/></svg>,
  },
  {
    // Seta descendo com cifrão — preço baixo
    label: 'Voos Baratos', href: '/voos-baratos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 7H9.5a3.5 3.5 0 100 7H14a3.5 3.5 0 110 7H6"/></svg>,
  },
  {
    // Escudo com check — seguro
    label: 'Seguro Viagem', href: '/prep',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 2px 12px rgba(15,35,64,0.06)',
    }}>
      {/* ── Linha principal: logo + busca + ações ── */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <BirdSVG variant="navbar" size={44} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span className="logo-name">
              Go <span className="logo-dot">Livoo</span>.
            </span>
            <small className="logo-tagline">Vá mais longe por menos</small>
          </div>
        </Link>

        {/* Mini search bar central */}
        <div style={{
          flex: 1,
          maxWidth: 380,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '1.5px solid #E2E8F0',
          borderRadius: 100,
          padding: '9px 16px',
          background: '#FAFBFC',
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: '#AAB',
          cursor: 'text',
        }}
          className="hidden-mobile"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Busque evento, destino ou experiência…
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }} className="hidden-mobile">

          {/* Voos baratos CTA */}
          <Link href="/voos-baratos" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#FFF8EC', border: '1.5px solid #F5A800',
            color: '#B87A00', textDecoration: 'none',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
            padding: '7px 14px', borderRadius: 100,
            whiteSpace: 'nowrap',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Voos Baratos
          </Link>

          {/* Divisor */}
          <div style={{ width: 1, height: 24, background: '#E2E8F0', margin: '0 2px' }} />

          {/* Instagram */}
          <a
            href="https://www.instagram.com/golivootravel"
            target="_blank"
            rel="noopener noreferrer"
            title="@golivootravel"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: '50%',
              border: '1.5px solid #E2E8F0', color: '#64748B',
              textDecoration: 'none', transition: 'border-color .15s, color .15s, background .15s',
              flexShrink: 0,
            }}
            onMouseOver={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = '#C13584'
              el.style.color = '#C13584'
              el.style.background = '#FFF0F8'
            }}
            onMouseOut={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = '#E2E8F0'
              el.style.color = '#64748B'
              el.style.background = 'transparent'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          {/* Divisor */}
          <div style={{ width: 1, height: 24, background: '#E2E8F0', margin: '0 2px' }} />

          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                background: 'transparent', border: '1.5px solid #CBD5E1',
                color: '#0F2340', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                padding: '8px 16px', borderRadius: 100, cursor: 'pointer',
                transition: 'border-color .15s',
              }}>
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={{
                background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
                border: 'none', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                padding: '9px 20px', borderRadius: 100, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(26,130,216,0.35)',
              }}>
                Criar conta grátis
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/meus-roteiros" style={{
              background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
              color: '#fff', textDecoration: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
              padding: '9px 20px', borderRadius: 100,
              boxShadow: '0 2px 8px rgba(26,130,216,0.35)',
            }}>
              Meus Roteiros
            </Link>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 34, height: 34 } } }} />
          </SignedIn>
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, marginLeft: 'auto' }}
          className="show-mobile"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0F2340">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" stroke="#0F2340" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" stroke="#0F2340" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      {/* ── Category tabs ── */}
      <nav style={{ background: '#fff', borderTop: '1px solid #E2E8F0' }}>
        <div style={{
          display: 'flex',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          overflowX: 'auto',
        }}>
          {catTabs.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 17px', textDecoration: 'none', color: '#64748B',
                fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                borderBottom: '2.5px solid transparent',
                transition: '.15s', fontFamily: 'Inter, sans-serif',
              }}
              onMouseOver={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#1A82D8'
              }}
              onMouseOut={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#64748B'
              }}
            >
              <span style={{ width: 19, height: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </span>
              {cat.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px 24px' }}>
          {catTabs.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600,
                color: '#0F2340', textDecoration: 'none',
                borderBottom: '1px solid #E6F3FF',
              }}
            >
              <span style={{ width: 18, height: 18, color: '#1A82D8' }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-outline" style={{ flex: 1 }}>Entrar</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-gold" style={{ flex: 1 }}>Cadastrar</button>
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
