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
    { label: 'Sobre a Livoo',   href: '/sobre' },
    { label: 'Blog de viagens', href: '/blog' },
    { label: 'Parceiros',       href: '/parceiros' },
    { label: 'Contato',         href: '/contato' },
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
      background: '#0D1B3E',
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
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#F5A623',
                  display: 'block',
                }}>
                  Livoo.
                </span>
                <small style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
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
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 280,
            }}>
              Você quer a experiência. A Livoo resolve o resto.
              Empresa em constituição — 2026.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
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
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            © {new Date().getFullYear()} Livoo. Empresa em constituição.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Instagram', 'LinkedIn', 'TikTok'].map((social) => (
              <a
                key={social}
                href={`https://${social.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {social}
              </a>
            ))}
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
