'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Mapa de IATA → nome da cidade em português (para exibição no header)
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

// Travelpayouts affiliate marker (público — não é dado sensível)
const TP_MARKER = '514088'
// promo_id 4095 = widget de busca de voos (Aviasales/JetRadar)
const TP_PROMO  = '4095'

function FlightSearchContent() {
  const searchParams  = useSearchParams()
  const containerRef  = useRef<HTMLDivElement>(null)

  const origin = (searchParams.get('origin') || 'GRU').toUpperCase()
  const dest   = (searchParams.get('dest')   || '').toUpperCase()
  const date   = searchParams.get('date') || ''

  const originCity = CITY_NAMES[origin] || origin
  const destCity   = CITY_NAMES[dest]   || dest

  // Deep link de fallback (tp.media com locale PT + BRL via marker)
  const fallbackUrl = (() => {
    let avUrl = 'https://www.aviasales.com/'
    if (dest && date && date.length === 10) {
      const parts = date.split('-')
      const ddmm  = `${parts[2]}${parts[1]}`
      avUrl = `https://www.aviasales.com/search/${origin}${ddmm}${dest}1`
    } else if (dest) {
      avUrl = `https://www.aviasales.com/?params=${origin}${dest}1`
    }
    return `https://tp.media/r?marker=${TP_MARKER}&p=4114&u=${encodeURIComponent(avUrl)}`
  })()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ''

    const params: Record<string, string> = {
      trs:          TP_MARKER,
      shmarker:     TP_MARKER,
      locale:       'pt',
      powered_by:   'true',
      currency:     'brl',
      host:         'golivoo.com.br',
      origin,
      one_way:      'false',
      nt:           'false',
      with_request: dest ? 'true' : 'false',
      trip_class:   '0',
      promo_id:     TP_PROMO,
    }
    if (dest)  params.destination  = dest
    if (date)  params.depart_date  = date

    const qs     = new URLSearchParams(params).toString()
    const script = document.createElement('script')
    script.src     = `https://tp.media/content?${qs}`
    script.charset = 'utf-8'
    script.async   = true
    el.appendChild(script)

    return () => { el.innerHTML = '' }
  }, [origin, dest, date])

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #2B9FEE 100%)',
        padding: '40px 24px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: -60, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Link href="/voos-baratos" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,.65)', fontSize: 12, fontFamily: 'Inter, sans-serif',
            textDecoration: 'none', marginBottom: 20,
            transition: 'color .15s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Voltar para Voos Baratos
          </Link>

          {/* Rota */}
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

          {/* Data + instrução */}
          <p style={{
            color: 'rgba(255,255,255,.72)', fontFamily: 'Inter, sans-serif',
            fontSize: 14, lineHeight: 1.6, margin: 0,
          }}>
            {date && `Partida: ${formatDate(date)} · `}
            Busca em Português · preços em Reais (R$)
          </p>
        </div>
      </section>

      {/* ── Área do widget ── */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Caixa que receberá o script do Travelpayouts */}
        <div ref={containerRef} style={{ minHeight: 200 }} />

        {/* Separator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '36px 0 24px',
        }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
            ou acesse diretamente
          </span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Fallback: botão para Aviasales via tp.media */}
        <div style={{ textAlign: 'center' }}>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
              color: '#fff', textDecoration: 'none', borderRadius: 12,
              padding: '13px 28px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 16px rgba(26,130,216,.3)',
              transition: 'opacity .15s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '.88' }}
            onMouseOut={e  => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
            </svg>
            Buscar no Aviasales
          </a>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94A3B8',
            marginTop: 10, lineHeight: 1.6,
          }}>
            Preços em Reais (R$) · sem custo adicional para você ·{' '}
            <span style={{ color: '#1A82D8' }}>Go Livoo recebe comissão de afiliado</span>
          </p>
        </div>
      </div>
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
