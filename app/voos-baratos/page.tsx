'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CheapFlight } from '@/app/api/cheap-flights/route'

const ORIGINS = [
  { iata: 'GRU', label: 'São Paulo',      short: 'GRU · SP' },
  { iata: 'GIG', label: 'Rio de Janeiro', short: 'GIG · RJ' },
  { iata: 'BSB', label: 'Brasília',       short: 'BSB · DF' },
  { iata: 'SSA', label: 'Salvador',       short: 'SSA · BA' },
  { iata: 'FOR', label: 'Fortaleza',      short: 'FOR · CE' },
  { iata: 'REC', label: 'Recife',         short: 'REC · PE' },
  { iata: 'CWB', label: 'Curitiba',       short: 'CWB · PR' },
  { iata: 'POA', label: 'Porto Alegre',   short: 'POA · RS' },
]

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR')
}

function StopsLabel({ stops }: { stops: number }) {
  if (stops === 0) return <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 11, fontFamily: 'Inter, sans-serif' }}>Direto</span>
  return <span style={{ color: '#64748B', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>{stops} {stops === 1 ? 'parada' : 'paradas'}</span>
}

function formatDepartDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
  const m = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} ${months[m] ?? ''} · ${year}`
}

function FlightCard({ flight }: { flight: CheapFlight }) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={flight.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15,35,64,.08)',
        textDecoration: 'none',
        border: '1px solid #E2E8F0',
        transition: 'transform .2s, box-shadow .2s',
      }}
      onMouseOver={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = '0 16px 40px rgba(26,130,216,.18)'
      }}
      onMouseOut={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = ''
        el.style.boxShadow = '0 2px 8px rgba(15,35,64,.08)'
      }}
    >
      {/* Foto do destino */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={flight.destinationPhoto}
            alt={flight.destinationCity}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #093468 0%, #1A82D8 100%)',
          }} />
        )}

        {/* Overlay escuro no bottom para texto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.55) 100%)',
        }} />

        {/* Badge rota top-right */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,.45)',
          backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '3px 9px', borderRadius: 100,
          fontFamily: 'Inter, sans-serif', letterSpacing: .5,
        }}>
          {flight.origin} → {flight.destination}
        </div>

        {/* Flag + cidade sobre a foto */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{flight.destinationFlag}</span>
            <span style={{
              color: '#fff', fontFamily: 'Nunito, sans-serif',
              fontWeight: 900, fontSize: 18, lineHeight: 1,
              textShadow: '0 1px 4px rgba(0,0,0,.4)',
            }}>
              {flight.destinationCity}
            </span>
          </div>
          <div style={{
            color: 'rgba(255,255,255,.8)',
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500,
          }}>
            {flight.destinationCountry}
          </div>
        </div>
      </div>

      {/* Corpo do card */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Preço + paradas/companhia */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#94A3B8',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: .6,
              marginBottom: 1,
            }}>
              a partir de
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: 28, color: '#1A82D8', lineHeight: 1,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, verticalAlign: 'super', lineHeight: 0 }}>R$</span>
              {' '}{formatPrice(flight.price)}
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            <StopsLabel stops={flight.stops} />
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94A3B8',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
              </svg>
              {flight.airline}
            </div>
          </div>
        </div>

        {/* Data de partida */}
        {flight.departDate && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748B',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Saída: {formatDepartDate(flight.departDate)}
          </div>
        )}

        {/* Botão CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          background: 'linear-gradient(135deg, #1A82D8 0%, #1260A8 100%)',
          color: '#fff', borderRadius: 10, padding: '10px 0',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13,
          boxShadow: '0 2px 8px rgba(26,130,216,.3)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
          </svg>
          Ver passagem no Trip.com
        </div>
      </div>
    </a>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
      <div style={{
        height: 160,
        background: 'linear-gradient(90deg, #E2E8F0 25%, #F4F6F9 50%, #E2E8F0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 10, background: '#F4F6F9', borderRadius: 6, width: '50%' }} />
        <div style={{ height: 28, background: '#F4F6F9', borderRadius: 6, width: '55%' }} />
        <div style={{ height: 40, background: '#E6F3FF', borderRadius: 10 }} />
      </div>
    </div>
  )
}

export default function VoosBaratosPage() {
  const [origin, setOrigin] = useState('GRU')
  const [flights, setFlights] = useState<CheapFlight[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const fetchFlights = useCallback(async (orig: string) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/cheap-flights?origin=${orig}`)
      const data = await res.json()
      if (data.flights) {
        setFlights(data.flights)
        setUpdatedAt(data.updatedAt)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFlights(origin) }, [origin, fetchFlights])

  const originObj = ORIGINS.find(o => o.iata === origin)

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #2B9FEE 100%)',
        padding: '56px 24px 52px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: -80, right: -100, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,168,0,.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,168,0,.15)', color: '#F5A800',
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100,
            fontFamily: 'Inter, sans-serif', border: '1px solid rgba(245,168,0,.3)',
            marginBottom: 16,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Monitor de preços · Atualizado a cada 6 horas
          </span>

          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff',
            fontSize: 'clamp(26px, 3.5vw, 46px)', lineHeight: 1.05,
            marginBottom: 12, letterSpacing: '-.5px',
          }}>
            Voos baratos saindo de<br />
            <span style={{ color: '#F5A800' }}>{originObj?.label || origin}</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,.7)', fontSize: 15, marginBottom: 36,
            lineHeight: 1.65, maxWidth: 520,
          }}>
            Preços reais em Reais (R$) — comparamos centenas de opções para você. Clique num destino e compre direto no Trip.com em Português.
          </p>

          {/* Chips de origem */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ORIGINS.map(o => (
              <button
                key={o.iata}
                onClick={() => setOrigin(o.iata)}
                style={{
                  background: origin === o.iata ? '#F5A800' : 'rgba(255,255,255,.1)',
                  color: origin === o.iata ? '#0F2340' : 'rgba(255,255,255,.9)',
                  border: origin === o.iata ? 'none' : '1px solid rgba(255,255,255,.2)',
                  borderRadius: 100,
                  padding: '8px 18px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                  transition: 'all .15s',
                  boxShadow: origin === o.iata ? '0 2px 10px rgba(245,168,0,.35)' : 'none',
                }}
              >
                {o.short}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 72px' }}>

        {/* Barra de status */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28, flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
            fontSize: 20, color: '#0F2340',
          }}>
            {loading
              ? 'Buscando os melhores preços...'
              : error
              ? 'Erro ao carregar preços'
              : `${flights.length} destinos encontrados`}
          </div>
          {updatedAt && !loading && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94A3B8',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Atualizado às {new Date(updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              <button
                onClick={() => fetchFlights(origin)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#1A82D8', fontWeight: 700, fontSize: 12,
                  fontFamily: 'Inter, sans-serif', padding: '0 0 0 4px',
                }}
              >
                · Atualizar
              </button>
            </div>
          )}
        </div>

        {/* Grid de cards */}
        {error ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748B' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" style={{ marginBottom: 16 }}>
              <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
            </svg>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8, color: '#0F2340' }}>
              Não conseguimos carregar os preços agora
            </p>
            <p style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
              Nosso parceiro de dados pode estar com instabilidade. Tente novamente em instantes.
            </p>
            <button
              onClick={() => fetchFlights(origin)}
              style={{
                background: '#1A82D8', color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontWeight: 700, fontSize: 14,
                boxShadow: '0 2px 8px rgba(26,130,216,.3)',
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : flights.map(f => <FlightCard key={`${f.origin}-${f.destination}`} flight={f} />)
            }
          </div>
        )}

        {/* Disclaimer */}
        {!loading && !error && flights.length > 0 && (
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94A3B8',
            textAlign: 'center', marginTop: 48, lineHeight: 1.7, maxWidth: 600, margin: '48px auto 0',
          }}>
            Preços baseados no menor valor disponível para os próximos 2 meses.
            Valores finais podem variar no momento da compra.
            Você é redirecionado para o Trip.com em Português com preços em Reais · sem custo adicional para você.
          </p>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 500px) {
          div[style*="minmax(260px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
