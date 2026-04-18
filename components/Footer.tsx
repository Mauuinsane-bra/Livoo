import Link from 'next/link'
import BirdSVG from './BirdSVG'

const footerLinks = {
  Produto: [
    { label: 'Roteiro Completo', href: '/roteiro' },
    { label: 'Busca de Voos',    href: '/passagens' },
    { label: 'Hotéis',          href: '/hoteis' },
    { label: 'Ônibus',          href: '/onibus' },
    { label: 'Guias Turísticos',href: '/guias' },
    { label: 'Livoo Prep',      href: '/prep' },
  ],
  Empresa: [
    { label: 'Sobre a Go Livoo', href: '/sobre' },
    { label: 'Como funciona',    href: '/como-funciona' },
    { label: 'Blog de viagens',  href: '/blog' },
    { label: 'Contato',          href: '/contato' },
  ],
  Legal: [
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Termos de Uso',           href: '/termos' },
    { label: 'Política de Cookies',     href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: '#0F2340',
      color: '#fff',
      padding: '64px 0 32px',
    }}>
      <div className="container">
        {/* Top: logo + links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr repeat(3, auto)',
          gap: 48,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexWrap: 'wrap',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <BirdSVG variant="footer" size={32} />
              <div>
                <span style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#F5A800',
                  display: 'block',
                }}>
                  Go Livoo.
                </span>
                <small style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                }}>
                  Vá mais longe por menos
                </small>
              </div>
            </Link>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 280,
            }}>
              Você quer a experiência. A Go Livoo resolve o resto.
              Empresa em constituição — 2026.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 16,
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.88rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 28,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            © {new Date().getFullYear()} Go Livoo. Empresa em constituição.
          </p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a
              href="https://www.instagram.com/golivootravel"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              @golivootravel
            </a>
          </div>
        </div>
      </div>

      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      ` }} />
    </footer>
  )
}
