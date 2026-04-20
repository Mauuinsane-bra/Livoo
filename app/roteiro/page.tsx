'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

// Ícone SVG por categoria de experiência — substitui os emojis antigos
function CategoryIcon({ category, size = 48 }: { category: string; size?: number }) {
  const stroke = '#ffd600'
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke, strokeWidth: 1.8,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (category) {
    case 'esportes':
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      )
    case 'música':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      )
    case 'gastronomia':
      return (
        <svg {...common}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/>
          <line x1="19" y1="15" x2="19" y2="22"/>
        </svg>
      )
    case 'aventura':
      return (
        <svg {...common}>
          <polygon points="12 2 22 20 2 20 12 2"/>
          <polyline points="7 14 10 11 13 14 17 10"/>
        </svg>
      )
    case 'automobilismo':
      return (
        <svg {...common}>
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
          <circle cx="6.5" cy="16.5" r="2.5"/>
          <circle cx="16.5" cy="16.5" r="2.5"/>
        </svg>
      )
    case 'cultura':
      return (
        <svg {...common}>
          <line x1="3" y1="21" x2="21" y2="21"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <polyline points="5 6 12 3 19 6"/>
          <line x1="4" y1="10" x2="4" y2="21"/>
          <line x1="20" y1="10" x2="20" y2="21"/>
          <line x1="8" y1="14" x2="8" y2="17"/>
          <line x1="12" y1="14" x2="12" y2="17"/>
          <line x1="16" y1="14" x2="16" y2="17"/>
        </svg>
      )
    case 'ecoturismo':
      return (
        <svg {...common}>
          <path d="M7 17A6 6 0 1 0 19 9a6 6 0 0 0-12 0"/>
          <path d="M13 21v-4"/>
          <path d="M13 17l-4-4"/>
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
        </svg>
      )
  }
}

function RoteiroContent() {
  const params = useSearchParams()
  const router = useRouter()

  // Aceita ?q=... (SearchWidget) ou ?evento=...&destino=... (página de eventos)
  const rawQ     = params.get('q') ?? ''
  const evento   = params.get('evento') ?? ''
  const destino  = params.get('destino') ?? ''
  const prompt   = rawQ || (evento ? `Quero montar um roteiro para assistir ao evento "${evento}" em ${destino}` : '')
  const includes = params.get('includes')?.split(',') ?? []
  const origin   = params.get('origin') ?? ''

  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [result, setResult] = useState<RoteiroResult | null>(null)

  useEffect(() => {
    if (!prompt) { router.replace('/'); return }

    fetch('/api/roteiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, includes, origin }),
    })
      .then(r => r.json())
      .then(data => { setResult(data); setStatus('done') })
      .catch(() => setStatus('error'))
  }, [prompt, includes, origin])

  // Log no console (não na UI) quando a API responde em modo demo
  useEffect(() => {
    if (result?.isDemoMode) {
      console.info('[Go Livoo] Modo demo do roteiro ativo (OPENAI_API_KEY não configurada).')
    }
  }, [result?.isDemoMode])

  // ── Loading ──────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{
          width: 56, height: 56, border: '4px solid #fafaf7',
          borderTop: '4px solid #ff5722', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74', fontSize: '0.95rem' }}>
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
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f' }}>Algo deu errado</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74' }}>
          {result?.error ?? 'Não foi possível processar o roteiro. Tente novamente.'}
        </p>
        <Link href="/" className="btn-primary">Voltar ao início</Link>
      </div>
    )
  }

  const { parsed, isDemoMode } = result

  if (!parsed) return null

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero do resultado */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d0f 0%, #ff5722 60%, #2B9FEE 100%)', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Aviso modo demo removido do usuário final — log no console apenas via useEffect acima */}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon category={parsed.experienceCategory} size={48} />
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Roteiro identificado
              </p>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                {parsed.event}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>
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
              { label: 'Documentação', value: 'Verificar via Documentação' },
            ].filter(Boolean).map((item) => item && (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '10px 16px',
              }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#fff', margin: 0, fontWeight: 600 }}>{item.value}</p>
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
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#6d6d74', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>
            Seu pedido
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#0d0d0f', lineHeight: 1.65, margin: 0 }}>
            "{prompt}"
          </p>
        </div>

        {/* Observações da IA */}
        {parsed.notes && (
          <div style={{
            background: '#fffbe6', border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: 14, padding: 20, marginBottom: 20,
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#D48A0A', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>
              Observações importantes
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#0d0d0f', lineHeight: 1.65, margin: 0 }}>
              {parsed.notes}
            </p>
          </div>
        )}

        {/* Próximos passos */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: 28,
          boxShadow: '0 4px 20px rgba(13,27,62,0.07)', marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', color: '#0d0d0f', marginBottom: 20 }}>
            Próximos passos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                num: '01',
                title: 'Verificar documentação',
                desc: `Antes de comprar qualquer coisa, confira se você precisa de visto para ${parsed.destination}.`,
                cta: 'Verificar Documentação',
                href: `/prep?destination=${parsed.destinationIATA}&destinationName=${encodeURIComponent(parsed.destination)}`,
                color: '#ff5722',
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
                color: '#ff5722',
              },
              {
                num: '03',
                title: includes.includes('hotel') ? 'Buscar hotéis' : 'Hospedagem (não incluída)',
                desc: includes.includes('hotel')
                  ? `Hotéis próximos ao evento em ${parsed.destination}.`
                  : 'Você não incluiu hospedagem neste roteiro.',
                cta: includes.includes('hotel') ? 'Buscar hotéis' : null,
                href: includes.includes('hotel') ? `/hoteis?city=${encodeURIComponent(parsed.destination)}` : null,
                color: '#ff5722',
              },
              {
                num: '04',
                title: 'Guias e experiências locais',
                desc: `Experiências e guias especializados em ${parsed.destination}.`,
                cta: 'Ver experiências',
                href: `/guias?q=${encodeURIComponent(parsed.searchQuery)}`,
                color: '#ff5722',
              },
            ].map(step => (
              <div key={step.num} style={{
                display: 'flex', gap: 16, padding: '16px 0',
                borderBottom: '1px solid #fafaf7',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: '#0d0d0f',
                  color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem',
                  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', color: '#0d0d0f', marginBottom: 4 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6d6d74', margin: step.cta ? '0 0 10px' : 0 }}>
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
          background: 'linear-gradient(135deg, #0d0d0f 0%, #1a1a20 100%)',
          borderRadius: 14, padding: 32, textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', fontSize: '1.3rem', marginBottom: 10 }}>
            Quer que a Go Livoo monte tudo por você?
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: 24 }}>
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
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74' }}>Carregando...</p>
      </div>
    }>
      <RoteiroContent />
    </Suspense>
  )
}
