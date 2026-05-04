'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import BirdCabecudinha from './BirdCabecudinha'

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
  const pathname = usePathname()

  // Blog tem layout próprio — não exibir Navbar do site
  if (pathname.startsWith('/blog')) return null

  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '16px 24px' }}>

          {/* Logo */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', lineHeight: 1, flexShrink: 0, color: '#0F2340',
          }}>
            <BirdCabecudinha size={45} />
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, lineHeight: 1, whiteSpace: 'nowrap' }}>
              <b style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 22, letterSpacing: '-0.035em', color: '#0F2340', lineHeight: .95 }}>Go Livoo</b>
              <small style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, fontSize: 8.5, color: '#64748B', letterSpacing: '.2em', lineHeight: 1, textTransform: 'uppercase' }}>Vá mais longe por menos</small>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 4, fontSize: 13.5, marginLeft: 14 }} className="hidden-mobile">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '8px 12px', borderRadius: 8, color: '#0F2340', fontWeight: 500, textDecoration: 'none',
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
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, padding: '8px 12px', color: '#0F2340' }}>BRL · PT</span>

            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: 13.5, padding: '8px 12px', color: '#0F2340', background: 'none', cursor: 'pointer',
                }}>
                  Entrar
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  background: '#1A82D8', color: '#fff', borderRadius: 999, padding: '9px 16px',
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
          <div style={{ borderTop: '1px solid #E2E8F0', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ padding: '10px 8px', fontSize: 15, fontWeight: 500, color: '#0F2340', textDecoration: 'none', borderRadius: 8 }}>
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ flex: 1, padding: '10px', border: '1px solid #E2E8F0', borderRadius: 999, fontSize: 13.5, fontWeight: 600 }}>Entrar</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{ flex: 1, padding: '10px', background: '#1A82D8', color: '#fff', borderRadius: 999, fontSize: 13.5, fontWeight: 600 }}>Criar conta</button>
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
