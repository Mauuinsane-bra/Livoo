'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BirdCabecudinha from './BirdCabecudinha'

const cols = {
  Produto: [
    { label: 'Eventos',         href: '/eventos' },
    { label: 'Roteiro Completo',href: '/roteiro' },
    { label: 'Passagens',       href: '/passagens' },
    { label: 'Promoções',         href: '/promocoes' },
    { label: 'Explorar Destinos', href: '/explorar-destinos' },
    { label: 'Hotéis',           href: '/hoteis' },
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
  const pathname = usePathname()

  // Blog tem layout próprio — não exibir Footer do site
  if (pathname.startsWith('/blog')) return null

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '52px 0 28px', marginTop: 40 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)', gap: 28 }} className="footer-grid">

          {/* Col 1 — brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0F2340', marginBottom: 14 }}>
              <BirdCabecudinha size={40} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, lineHeight: 1 }}>
                <b style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.035em', lineHeight: .95 }}>Go Livoo</b>
                <small style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#64748B', letterSpacing: '.2em', textTransform: 'uppercase' }}>Vá mais longe por menos</small>
              </span>
            </Link>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748B', lineHeight: 1.65, maxWidth: 260, marginBottom: 20 }}>
              Você quer a experiência. A Go Livoo resolve o resto.
            </p>
            {/* Social pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/livoo_travel' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontSize: 11.5, fontWeight: 600, padding: '5px 12px', border: '1px solid #E2E8F0',
                    borderRadius: 999, color: '#0F2340', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                    transition: 'border-color .15s, color .15s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0F2340'; (e.currentTarget as HTMLAnchorElement).style.color = '#0F2340'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLAnchorElement).style.color = '#0F2340'; }}
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
                fontFamily: 'Nunito, sans-serif', fontSize: 13, textTransform: 'uppercase',
                color: '#64748B', letterSpacing: '.06em', margin: '0 0 10px', fontWeight: 700,
              }}>
                {title}
              </h5>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ fontSize: 13, color: '#0F2340', textDecoration: 'none', transition: 'color .15s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1A82D8'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#0F2340'; }}
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
          borderTop: '1px solid #E2E8F0', marginTop: 28, paddingTop: 18,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#64748B',
        }}>
          <span>© 2026 Go Livoo.</span>
          <span>PT-BR · BRL</span>
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
