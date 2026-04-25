'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

/* ── Logo andorinha SVG (direção 04) ──────────────────── */
function LogoMark({ size = 45 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={size * 0.625} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Go Livoo" fill="currentColor">
      <path d="M32 22.5c-5.5-6-11-10.8-16.5-14.5-5-3.4-10-5.8-15-7.3-.7-.2-.8.8-.2 1.1 4.5 2.2 8.8 5.1 12.9 8.6 4 3.4 7.8 7.4 11.3 11.9-3.5 1.1-6.9 3-10.1 5.6-3.2 2.6-6.3 5.9-9.2 9.9-.3.4.2.9.6.6 3.5-2.6 7-4.6 10.5-5.9 3.5-1.3 7.1-1.9 10.8-1.7 1.6.1 3.2.4 4.9.9 1.7-.5 3.3-.8 4.9-.9 3.7-.2 7.3.4 10.8 1.7 3.5 1.3 7 3.3 10.5 5.9.4.3.9-.2.6-.6-2.9-4-6-7.3-9.2-9.9-3.2-2.6-6.6-4.5-10.1-5.6 3.5-4.5 7.3-8.5 11.3-11.9C56 8.9 60.3 6 64.8 3.8c.6-.3.5-1.3-.2-1.1-5 1.5-10 3.9-15 7.3C44.1 13.7 38.6 18.5 33.1 24.5c-.4.4-.8.4-1.1 0z"/>
    </svg>
  )
}

const navLinks = [
  { label: 'Eventos',    href: '/eventos' },
  { label: 'Roteiro',    href: '/roteiro' },
  { label: 'Passagens',  href: '/passagens' },
  { label: 'Promoções',         href: '/promocoes' },
  { label: 'Explorar Destinos', href: '/explorar-destinos' },
  { label: 'Hotéis',           href: '/hoteis' },
  { label: 'Pacotes',    href: '/pacotes' },
  { label: 'Carros',     href: '/carros' },
  { label: 'Ônibus',    href: '/onibus' },
  { label: 'Blog',       href: '/blog' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e7e6e0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 24px' }}>

          {/* Logo */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', lineHeight: 1, flexShrink: 0, color: '#0d0d0f',
          }}>
            <LogoMark size={45} />
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, lineHeight: 1, whiteSpace: 'nowrap' }}>
              <b style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, letterSpacing: '-0.035em', color: '#0d0d0f', lineHeight: .95 }}>Go Livoo</b>
              <small style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, fontSize: 8.5, color: '#6d6d74', letterSpacing: '.2em', lineHeight: 1, textTransform: 'uppercase' }}>Vá mais longe por menos</small>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 4, fontSize: 13.5, marginLeft: 14 }} className="hidden-mobile">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '8px 12px', borderRadius: 8, color: '#2a2a30', fontWeight: 500, textDecoration: 'none',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fafaf7' }}
                onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search — em breve */}

          {/* Right actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }} className="hidden-mobile">
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, padding: '8px 12px', color: '#2a2a30' }}>BRL · PT</span>

            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: 13.5, padding: '8px 12px', color: '#2a2a30', background: 'none', cursor: 'pointer',
                }}>
                  Entrar
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  background: '#ff5722', color: '#fff', borderRadius: 999, padding: '9px 16px',
                  fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
                }}>
                  Criar conta
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button
            style={{ marginLeft: 'auto', padding: 8, display: 'none' }}
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen
                ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #e7e6e0', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ padding: '10px 8px', fontSize: 15, fontWeight: 500, color: '#2a2a30', textDecoration: 'none', borderRadius: 8 }}>
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ flex: 1, padding: '10px', border: '1px solid #e7e6e0', borderRadius: 999, fontSize: 13.5, fontWeight: 600 }}>Entrar</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{ flex: 1, padding: '10px', background: '#ff5722', color: '#fff', borderRadius: 999, fontSize: 13.5, fontWeight: 600 }}>Criar conta</button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        .show-mobile { display: none; }
        header nav a:hover { background: #fafaf7 !important; }
      `}</style>
    </>
  )
}
