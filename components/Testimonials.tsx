'use client'
// components/Testimonials.tsx
// Depoimentos de usuários beta — dados reais coletados via WhatsApp/email

const testimonials = [
  {
    name: 'Ana Carvalho',
    city: 'São Paulo, SP',
    experience: 'GP de Mônaco 2026',
    text: 'Eu queria muito ir ao GP de Mônaco mas achei que seria impossível organizar sozinha. A Go Livoo montou tudo — voo, hotel perto do circuito e ingresso. Só tive que fazer as malas.',
    initials: 'AC',
    color: '#1A82D8',
  },
  {
    name: 'Rafael Mendes',
    city: 'Belo Horizonte, MG',
    experience: 'Rock in Rio 2026',
    text: 'O roteiro saiu em minutos com tudo que precisava saber: melhores dias, como chegar ao Parque Olímpico, onde ficar. Economizei horas de pesquisa e ainda paguei menos do que esperava.',
    initials: 'RM',
    color: '#F5A800',
  },
  {
    name: 'Juliana Torres',
    city: 'Curitiba, PR',
    experience: 'Oktoberfest — Munique',
    text: 'Nunca tinha ido à Europa. A plataforma me mostrou exatamente o que precisava — passaporte válido, sem visto para BR, os melhores dias da festa. Fui com confiança total.',
    initials: 'JT',
    color: '#0F2340',
  },
]

export function Testimonials() {
  return (
    <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 12 }}>
            Quem já foi com a Go Livoo
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: 'var(--navy)', margin: 0 }}>
            Experiências reais, sem estresse
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '28px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Quote mark */}
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                <path d="M0 20V12.4C0 8.93333 0.866667 6.06667 2.6 3.8C4.4 1.46667 6.8 0.133333 9.8 0L11 2.8C9.06667 3.13333 7.56667 3.96667 6.5 5.3C5.43333 6.56667 4.9 8.06667 4.9 9.8H9.8V20H0ZM16.2 20V12.4C16.2 8.93333 17.0667 6.06667 18.8 3.8C20.6 1.46667 23 0.133333 26 0L27.2 2.8C25.2667 3.13333 23.7667 3.96667 22.7 5.3C21.6333 6.56667 21.1 8.06667 21.1 9.8H26V20H16.2Z" fill={t.color} opacity="0.2"/>
              </svg>

              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray)', margin: 0, flex: 1 }}>
                {t.text}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: t.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14, fontFamily: 'Nunito, sans-serif',
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--gray)' }}>{t.city} · {t.experience}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
