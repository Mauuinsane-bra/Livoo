import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pacotes de Viagem — Go Livoo',
  description: 'Pacotes completos de viagem com voo, hotel, guia e documentação. Em breve na Go Livoo.',
}

const packages = [
  {
    title: 'Pacote Futebol Brasileiro',
    desc: 'Voo + hotel + ingresso para os principais estádios do Brasil. Perfeito para torcedores de fora do estado.',
    icon: '⚽',
    category: 'Esportes',
    status: 'Em breve',
    href: '/eventos',
  },
  {
    title: 'Pacote Fórmula 1',
    desc: 'Tudo incluído para os GPs de F1: voo, hotel próximo ao circuito, ingresso e transfer.',
    icon: '🏎',
    category: 'Automobilismo',
    status: 'Em breve',
    href: '/eventos',
  },
  {
    title: 'Pacote Festival de Música',
    desc: 'Lollapalooza, Rock in Rio e mais — voo + hotel + ingresso + guia de dicas no destino.',
    icon: '🎸',
    category: 'Shows',
    status: 'Em breve',
    href: '/eventos',
  },
  {
    title: 'Pacote Cultura & Gastronomia',
    desc: 'Roteiros temáticos para destinos gastronômicos e culturais, com guias locais especializados.',
    icon: '🍽',
    category: 'Cultura',
    status: 'Em breve',
    href: '/guias',
  },
]

export default function PacotesPage() {
  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(245,166,35,0.15)',
          color: '#F5A623',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 50,
          marginBottom: 20,
          border: '1px solid rgba(245,166,35,0.3)',
        }}>
          Em desenvolvimento
        </span>
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Pacotes completos de viagem
        </h1>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 560,
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Voo + hotel + ingresso + guia + documentação — tudo em um só lugar.
          Estamos montando os primeiros pacotes. Enquanto isso, explore os eventos disponíveis.
        </p>
      </div>

      {/* Cards de categorias */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#1A56DB',
          }}>
            Categorias de pacotes
          </span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#0D1B3E',
            marginTop: 8,
          }}>
            O que estamos preparando
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 60,
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 2px 12px rgba(13,27,62,0.06)',
                border: '1px solid #D0DCF0',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>{pkg.icon}</span>
              <div>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#1A56DB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {pkg.category}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.1rem',
                color: '#0D1B3E',
                margin: 0,
              }}>
                {pkg.title}
              </h3>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.88rem',
                color: '#5A6A80',
                lineHeight: 1.6,
                margin: 0,
                flex: 1,
              }}>
                {pkg.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#F5A623',
                  background: 'rgba(245,166,35,0.1)',
                  padding: '3px 10px',
                  borderRadius: 50,
                }}>
                  {pkg.status}
                </span>
                <Link href={pkg.href} style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.82rem',
                  color: '#1A56DB',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}>
                  Ver eventos →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA intermediário */}
        <div style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            color: '#fff',
            marginBottom: 12,
          }}>
            Não encontrou o pacote que procura?
          </h3>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 28,
            maxWidth: 480,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            Use o Roteiro Completo — descreva a experiência que quer ter e a Go Livoo monta o pacote para você.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-gold">
              Montar meu roteiro
            </Link>
            <Link href="/eventos" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Ver eventos disponíveis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
