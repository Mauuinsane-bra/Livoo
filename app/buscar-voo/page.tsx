'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Mapa de IATA -> nome da cidade em portugues (para exibicao no header)
const CITY_NAMES: Record<string, string> = {
  GRU: 'São Paulo', SAO: 'São Paulo',
  GIG: 'Rio de Janeiro', SDU: 'Rio de Janeiro', RIO: 'Rio de Janeiro',
  BSB: 'Brasília', SSA: 'Salvador', FOR: 'Fortaleza', REC: 'Recife',
  CWB: 'Curitiba', POA: 'Porto Alegre', FLN: 'Florianópolis',
  BHZ: 'Belo Horizonte', CNF: 'Belo Horizonte', MAO: 'Manaus',
  BEL: 'Belém', NAT: 'Natal', JPA: 'João Pessoa', MCZ: 'Maceió',
  IGU: 'Foz do Iguaçu', VIX: 'Vitória', GYN: 'Goiânia', SLZ: 'São Luís',
  CGB: 'Cuiabá', CGR: 'Campo Grande', AJU: 'Aracaju', THE: 'Teresina',
  LDB: 'Londrina', JOI: 'Joinville', NVT: 'Navegantes', PMW: 'Palmas',
  MOC: 'Montes Claros', BPS: 'Porto Seguro', SJP: 'S. J. Rio Preto',
  JDO: 'Juazeiro do Norte', PNZ: 'Petrolina', IOS: 'Ilhéus',
  LIS: 'Lisboa', OPO: 'Porto', MAD: 'Madri', BCN: 'Barcelona',
  CDG: 'Paris', LHR: 'Londres', FCO: 'Roma', MXP: 'Milão',
  FRA: 'Frankfurt', AMS: 'Amsterdã', DXB: 'Dubai', TBS: 'Tbilisi',
  MIA: 'Miami', JFK: 'Nova York', MCO: 'Orlando', CUN: 'Cancún',
  MEX: 'Cidade do México', EZE: 'Buenos Aires', BUE: 'Buenos Aires',
  SCL: 'Santiago', BOG: 'Bogotá', LIM: 'Lima', UIO: 'Quito',
  MVD: 'Montevidéu', ASU: 'Assunção', SRZ: 'Santa Cruz',
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length < 10) return ''
  const [year, month, day] = dateStr.split('-')
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
  const m = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} de ${months[m] ?? ''} de ${year}`
}

const KIWI_AFFILID = 'travelpayoutsdeeplink_www.golivoo.com.br_a576819c844940aeb1161c401-715532'

function buildKiwiDeeplink(origin: string, dest: string, date: string): string {
  const params = new URLSearchParams({
    affilid:  KIWI_AFFILID,
    from:     origin.toUpperCase(),
    to:       dest.toUpperCase(),
    lang:     'br',
    currency: 'BRL',
  })
  if (date && date.length === 10) {
    const [y, m, d] = date.split('-')
    params.set('departure', `${d}-${m}-${y}`)
  }
  return `https://www.kiwi.com/deep?${params.toString()}`
}

function FlightSearchContent() {
  const searchParams = useSearchParams()

  const origin = (searchParams.get('origin') || 'GRU').toUpperCase()
  const dest   = (searchParams.get('dest')   || '').toUpperCase()
  const date   = searchParams.get('date') || ''

  const originCity = CITY_NAMES[origin] || origin
  const destCity   = CITY_NAMES[dest]   || dest

  const kiwiUrl = dest ? buildKiwiDeeplink(origin, dest, date) : ''

  useEffect(() => {
    if (!kiwiUrl) return
    const t = setTimeout(() => {
      window.location.href = kiwiUrl
    }, 1500)
    return () => clearTimeout(t)
  }, [kiwiUrl])

  return (
    <>
      <section style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
        padding: '40px 24px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link href="/voos-baratos" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,.65)', fontSize: 12, fontFamily: 'Inter, sans-serif',
            textDecoration: 'none', marginBottom: 20,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Voltar para Voos Baratos
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff',
              fontSize: 'clamp(22px, 3vw, 38px)', lineHeight: 1.1, letterSpacing: '-.5px',
              margin: 0,
            }}>
              {dest
                ? <>{originCity} <span style={{ color: '#F5A800', fontSize: '0.75em' }}>→</span> {destCity}</>
                : <>Voos saindo de <span style={{ color: '#F5A800' }}>{originCity}</span></>
              }
            </h1>
          </div>

          <p style={{
            color: 'rgba(255,255,255,.72)', fontFamily: 'Inter, sans-serif',
            fontSize: 14, lineHeight: 1.6, margin: 0,
          }}>
            {date && `Partida: ${formatDate(date)} · `}
            Busca em Português · preços em Reais (R$)
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px', textAlign: 'center' }}>
        {kiwiUrl ? (
          <>
            <div style={{
              width: 56, height: 56, margin: '0 auto 20px',
              border: '3px solid #E2E8F0', borderTopColor: '#1A82D8',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <h2 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '1.4rem',
              color: '#0F2340', marginBottom: 10,
            }}>
              Abrindo sua busca no Kiwi.com
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 14,
              color: '#64748B', lineHeight: 1.7, marginBottom: 28,
            }}>
              Você será redirecionado em instantes. A busca abre em{' '}
              <strong style={{ color: '#0F2340' }}>Português</strong> com preços em{' '}
              <strong style={{ color: '#0F2340' }}>Reais (R$)</strong>.
            </p>
            <a
              href={kiwiUrl}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
                color: '#fff', textDecoration: 'none', borderRadius: 12,
                padding: '13px 28px',
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 16px rgba(26,130,216,.3)',
              }}
            >
              Abrir agora no Kiwi.com
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </a>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9aaabb',
              marginTop: 14, lineHeight: 1.6,
            }}>
              Sem custo adicional para você · Go Livoo pode receber comissão de afiliado
            </p>
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '1.4rem',
              color: '#0F2340', marginBottom: 10,
            }}>
              Escolha uma rota
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 14,
              color: '#64748B', lineHeight: 1.7, marginBottom: 24,
            }}>
              Vá até o monitor de preços, escolha um destino e o abriremos automaticamente para você em Português e Reais.
            </p>
            <Link href="/voos-baratos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
              color: '#fff', textDecoration: 'none', borderRadius: 12,
              padding: '13px 28px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 16px rgba(26,130,216,.3)',
            }}>
              Ver voos baratos
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

export default function BuscarVooPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
        fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#64748B',
        gap: 12,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2" strokeLinecap="round">
          <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
        </svg>
        Carregando busca de voos…
      </div>
    }>
      <FlightSearchContent />
    </Suspense>
  )
}
