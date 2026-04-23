'use client'

import Link from 'next/link'

function LogoMark() {
  return (
    <svg viewBox="0 0 64 40" width="38" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
      <path d="M32 22.5c-5.5-6-11-10.8-16.5-14.5-5-3.4-10-5.8-15-7.3-.7-.2-.8.8-.2 1.1 4.5 2.2 8.8 5.1 12.9 8.6 4 3.4 7.8 7.4 11.3 11.9-3.5 1.1-6.9 3-10.1 5.6-3.2 2.6-6.3 5.9-9.2 9.9-.3.4.2.9.6.6 3.5-2.6 7-4.6 10.5-5.9 3.5-1.3 7.1-1.9 10.8-1.7 1.6.1 3.2.4 4.9.9 1.7-.5 3.3-.8 4.9-.9 3.7-.2 7.3.4 10.8 1.7 3.5 1.3 7 3.3 10.5 5.9.4.3.9-.2.6-.6-2.9-4-6-7.3-9.2-9.9-3.2-2.6-6.6-4.5-10.1-5.6 3.5-4.5 7.3-8.5 11.3-11.9C56 8.9 60.3 6 64.8 3.8c.6-.3.5-1.3-.2-1.1-5 1.5-10 3.9-15 7.3C44.1 13.7 38.6 18.5 33.1 24.5c-.4.4-.8.4-1.1 0z"/>
    </svg>
  )
}

const cols = {
  Produto: [
    { label: 'Eventos',         href: '/eventos' },
    { label: 'Roteiro Completo',href: '/roteiro' },
    { label: 'Passagens',       href: '/passagens' },
    { label: 'Promoções',       href: '/promocoes' },
    { label: 'Hotéis',         href: '/hoteis' },
    { label: 'Voos Baratos',    href: '/voos-baratos' },
    { label: 'Pacotes',         href: '/pacotes' },
    { label: 'Carros',          href: '/carros' },
    { label: 'Ônibus',         href: '/onibus' },
    { label: 'Guias',           href: '/guias' },
    { label: 'Livoo Prep',      href: '/prep' },
  ],
  Empresa: [
    { label: 'Sobre a Go Livoo', href: '/sobre' },
    { label: 'Como funciona',    href: '/como-funciona' },
    { label: 'Blog de viagens',  href: '/blog' },
    { label: 'Contato',          href: '/contato' },
  ],
  Legal: [
    { label: 'Privacidade', href: '/privacidade' },
    { label: 'Termos de Uso', href: '/termos' },
  ],
  Suporte: [
    { label: 'FAQ',              href: '/contato' },
    { label: 'Acessibilidade',   href: '/contato' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #e7e6e0', padding: '52px 0 28px', marginTop: 40 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)', gap: 28 }} className="footer-grid">

          {/* Col 1 — brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0d0d0f', marginBottom: 14 }}>
              <LogoMark />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, lineHeight: 1 }}>
                <b style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.035em', lineHeight: .95 }}>Go Livoo</b>
                <small style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#6d6d74', letterSpacing: '.2em', textTransform: 'uppercase' }}>Vá mais longe por menos</small>
              </span>
            </Link>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6d6d74', lineHeight: 1.65, maxWidth: 260, marginBottom: 20 }}>
              Você quer a experiência. A Go Livoo resolve o resto.
            </p>
            {/* Social pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/livoo_travel' },
                { label: 'TikTok', href: '#' },
                { label: 'YouTube', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontSize: 11.5, fontWeight: 600, padding: '5px 12px', border: '1px solid #e7e6e0',
                    borderRadius: 999, color: '#2a2a30', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                    transition: 'border-color .15s, color .15s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0d0d0f'; (e.currentTarget as HTMLAnchorElement).style.color = '#0d0d0f'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e7e6e0'; (e.currentTarget as HTMLAnchorElement).style.color = '#2a2a30'; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Cols 2–5 — links */}
          {(Object.entries(cols) as [string, { label: string; href: string }[]][]).map(([title, links]) => (
            <div key={title}>
              <h5 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, textTransform: 'uppercase',
                color: '#6d6d74', letterSpacing: '.06em', margin: '0 0 10px', fontWeight: 700,
              }}>
                {title}
              </h5>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ fontSize: 13, color: '#2a2a30', textDecoration: 'none', transition: 'color .15s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ff5722'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#2a2a30'; }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #e7e6e0', marginTop: 28, paddingTop: 18,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#6d6d74',
        }}>
          <span>© 2026 Go Livoo. Empresa em constituição.</span>
          <span>v0.1 · PT-BR · BRL</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
