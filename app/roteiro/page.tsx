'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ParsedItinerary {
  destination: string
  destinationIATA: string
  originIATA?: string
  event: string
  eventDate: string | null
  suggestedDuration: string
  experienceCategory: string
  visaRequired: string
  estimatedBudgetBRL: number | null
  notes: string
  searchQuery: string
}

interface RoteiroResult {
  success: boolean
  parsed?: ParsedItinerary
  flights?: unknown[]
  isDemoMode?: boolean
  error?: string
}

const categoryEmoji: Record<string, string> = {
  esportes: '🏆', música: '🎸', gastronomia: '🍽', aventura: '🧗',
  automobilismo: '🏎', cultura: '🏛', ecoturismo: '🌿', outro: '✈',
}

function RoteiroContent() {
  const params = useSearchParams()
  const prompt   = params.get('q') ?? ''
  const includes = params.get('includes')?.split(',') ?? []
  const origin   = params.get('origin') ?? ''

  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [result, setResult] = useState<RoteiroResult | null>(null)

  useEffect(() => {
    if (!prompt) { setStatus('error'); return }

    fetch('/api/roteiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, includes, origin }),
    })
      .then(r => r.json())
      .then(data => { setResult(data); setStatus('done') })
      .catch(() => setStatus('error'))
  }, [prompt, includes, origin])

  // ── Loading ──────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{
          width: 56, height: 56, border: '4px solid #EEF4FF',
          borderTop: '4px solid #1A56DB', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80', fontSize: '0.95rem' }}>
          Analisando sua experiência e montando o roteiro...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Erro ─────────────────────────────────────────────
  if (status === 'error' || !result?.success) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 24 }}>
        <span style={{ fontSize: 48 }}>⚠️</span>
        <h2 style={{ fontFamily: 'Fraunces, serif', color: '#0D1B3E' }}>Algo deu errado</h2>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80' }}>
          {result?.error ?? 'Não foi possível processar o roteiro. Tente novamente.'}
        </p>
        <Link href="/" className="btn-primary">Voltar ao início</Link>
      </div>
    )
  }

  const { parsed, isDemoMode } = result

  if (!parsed) return null

  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero do resultado */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Aviso modo demo */}
          {isDemoMode && (
            <div style={{
              background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.4)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 24,
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#F5A623',
            }}>
              <strong>Modo demonstração</strong> — Configure <code>OPENAI_API_KEY</code> no <code>.env.local</code> para ativar a IA real de roteiros.
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 48 }}>{categoryEmoji[parsed.experienceCategory] ?? '✈'}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Roteiro identificado
              </p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                {parsed.event}
              </h1>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>
                {parsed.destination}
                {parsed.eventDate ? ` · ${parsed.eventDate}` : ''}
              </p>
            </div>
          </div>

          {/* Chips de detalhes */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
            {[
              { label: 'Duração sugerida', value: parsed.suggestedDuration },
              { label: 'Categoria', value: parsed.experienceCategory },
              parsed.estimatedBudgetBRL ? { label: 'Orçamento estimado', value: `R$ ${parsed.estimatedBudgetBRL.toLocaleString('pt-BR')}` } : null,
              { label: 'Documentação', value: 'Verificar via Livoo Prep' },
            ].filter(Boolean).map((item) => item && (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '10px 16px',
              }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#fff', margin: 0, fontWeight: 600 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '-32px auto 0', padding: '0 24px' }}>

        {/* Pedido original */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: 24,
          boxShadow: '0 4px 20px rgba(13,27,62,0.07)', marginBottom: 20,
        }}>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#5A6A80', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>
            Seu pedido
          </p>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem', color: '#0D1B3E', lineHeight: 1.65, margin: 0 }}>
            "{prompt}"
          </p>
        </div>

        {/* Observações da IA */}
        {parsed.notes && (
          <div style={{
            background: '#FFF8EC', border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: 14, padding: 20, marginBottom: 20,
          }}>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#D48A0A', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>
              Observações importantes
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#0D1B3E', lineHeight: 1.65, margin: 0 }}>
              {parsed.notes}
            </p>
          </div>
        )}

        {/* Próximos passos */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: 28,
          boxShadow: '0 4px 20px rgba(13,27,62,0.07)', marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', color: '#0D1B3E', marginBottom: 20 }}>
            Próximos passos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                num: '01',
                title: 'Verificar documentação',
                desc: `Antes de comprar qualquer coisa, confira se você precisa de visto para ${parsed.destination}.`,
                cta: 'Verificar no Livoo Prep',
                href: `/prep?destination=${parsed.destinationIATA}&destinationName=${encodeURIComponent(parsed.destination)}`,
                color: '#1A56DB',
              },
              {
                num: '02',
                title: includes.includes('voo') ? 'Buscar passagens' : 'Passagens (não incluído)',
                desc: includes.includes('voo')
                  ? `Voos ${origin ? `de ${origin} ` : ''}para ${parsed.destinationIATA}${parsed.eventDate ? ` em ${parsed.eventDate}` : ''}.`
                  : 'Você não incluiu voos neste roteiro.',
                cta: includes.includes('voo') ? 'Buscar passagens' : null,
                href: includes.includes('voo')
                  ? `/passagens?${origin ? `origin=${origin}&` : ''}destination=${parsed.destinationIATA}${parsed.eventDate ? `&date=${parsed.eventDate}` : ''}`
                  : null,
                color: '#1A56DB',
              },
              {
                num: '03',
                title: includes.includes('hotel') ? 'Buscar hotéis' : 'Hospedagem (não incluída)',
                desc: includes.includes('hotel')
                  ? `Hotéis próximos ao evento em ${parsed.destination}.`
                  : 'Você não incluiu hospedagem neste roteiro.',
                cta: includes.includes('hotel') ? 'Buscar hotéis' : null,
                href: includes.includes('hotel') ? `/hoteis?city=${encodeURIComponent(parsed.destination)}` : null,
                color: '#1A56DB',
              },
              {
                num: '04',
                title: 'Guias e experiências locais',
                desc: `Experiências e guias especializados em ${parsed.destination} via GetYourGuide.`,
                cta: 'Ver experiências',
                href: `/guias?q=${encodeURIComponent(parsed.searchQuery)}`,
                color: '#1A56DB',
              },
            ].map(step => (
              <div key={step.num} style={{
                display: 'flex', gap: 16, padding: '16px 0',
                borderBottom: '1px solid #EEF4FF',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: '#0D1B3E',
                  color: '#fff', fontFamily: 'Fraunces, serif', fontSize: '0.85rem',
                  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#0D1B3E', marginBottom: 4 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5A6A80', margin: step.cta ? '0 0 10px' : 0 }}>
                    {step.desc}
                  </p>
                  {step.cta && step.href && (
                    <Link href={step.href} className="btn-outline" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                      {step.cta} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA acesso antecipado */}
        <div style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
          borderRadius: 14, padding: 32, textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: '#fff', fontSize: '1.3rem', marginBottom: 10 }}>
            Quer que a Livoo monte tudo por você?
          </h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: 24 }}>
            Estamos construindo a versão completa — voo + hotel + guia + documentação em um clique.
            Entre na lista e seja um dos primeiros.
          </p>
          <Link href="/#acesso-antecipado" className="btn-gold">
            Quero acesso antecipado
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RoteiroPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80' }}>Carregando...</p>
      </div>
    }>
      <RoteiroContent />
    </Suspense>
  )
}
