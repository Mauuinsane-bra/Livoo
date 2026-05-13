// components/PageHero.tsx
// Hero padrão pra páginas internas — padroniza o visual cross-page.
// Usar em qualquer página secundária que precise abrir com hierarquia visual coerente com a home.
//
// Uso:
//   <PageHero
//     eyebrow="Passagens aéreas"
//     title="Encontre o melhor voo"
//     subtitle="Compare preços em tempo real..."
//   />

import type { ReactNode } from 'react'

interface PageHeroProps {
  /** Linha pequena acima do título (eyebrow/label) — opcional */
  eyebrow?: string
  /** Título principal do hero (h1) */
  title: string
  /** Subtítulo descritivo abaixo do título */
  subtitle?: string
  /** Elementos extras renderizados após o subtítulo (ex: botões, chips de categoria) */
  children?: ReactNode
  /** Alinhamento — default: center */
  align?: 'center' | 'left'
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  align = 'center',
}: PageHeroProps) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
      padding: '64px 0 52px',
    }}>
      <div className="container" style={{ textAlign: align }}>
        {eyebrow && (
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,180,216,0.15)', color: '#7ee8fa',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 20, border: '1px solid rgba(0,180,216,0.3)',
            fontFamily: 'Inter, sans-serif',
          }}>
            {eyebrow}
          </span>
        )}
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
          color: '#fff', margin: '0 0 16px',
          lineHeight: 1.15,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: align === 'center' ? 560 : undefined,
            margin: align === 'center' ? '0 auto 24px' : '0 0 24px',
            lineHeight: 1.7,
          }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
