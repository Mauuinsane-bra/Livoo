'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import BirdSVG from './BirdSVG'

const catTabs = [
  {
    label: 'Passagens', href: '/passagens',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  },
  {
    label: 'Eventos', href: '/eventos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  },
  {
    label: 'Hotéis', href: '/hoteis',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    label: 'Pacotes', href: '/pacotes',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  },
  {
    label: 'Carros', href: '/carros',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    label: 'Ônibus', href: '/onibus',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  },
  {
    label: 'Guias', href: '/guias',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
  },
  {
    label: 'Documentação', href: '/prep',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    label: 'Voos Baratos', href: '/voos-baratos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    label: 'Roteiro IA', href: '/roteiro',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }} className="hidden-mobile">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/golivootravel"
            target="_blank"
            rel="noopener noreferrer"
            title="@golivootravel"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid #E2E8F0', color: '#0F2340',
              textDecoration: 'none', transition: 'border-color .15s, color .15s',
            }}
            onMouseOver={e => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#C13584'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#C13584'
            }}
            onMouseOut={e => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#E2E8F0'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#0F2340'
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                background: 'transparent', border: '1.5px solid #E2E8F0',
                color: '#0F2340', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
              }}>
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={{
                background: '#1A82D8', border: 'none', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                padding: '9px 20px', borderRadius: 100, cursor: 'pointer',
              }}>
                Cadastrar
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/meus-roteiros" style={{
              background: '#1A82D8', color: '#fff', textDecoration: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
              padding: '9px 20px', borderRadius: 100,
            }}>
              Meus Roteiros
            </Link>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }} />
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
