'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CheapFlight } from '@/app/api/cheap-flights/route'

const ORIGINS = [
  { iata: 'GRU', label: 'São Paulo (GRU)' },
  { iata: 'GIG', label: 'Rio de Janeiro (GIG)' },
  { iata: 'BSB', label: 'Brasília (BSB)' },
  { iata: 'SSA', label: 'Salvador (SSA)' },
  { iata: 'FOR', label: 'Fortaleza (FOR)' },
  { iata: 'REC', label: 'Recife (REC)' },
  { iata: 'CWB', label: 'Curitiba (CWB)' },
  { iata: 'POA', label: 'Porto Alegre (POA)' },
]

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR')
}

function StopsLabel({ stops }: { stops: number }) {
  if (stops === 0) return <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 11 }}>Direto</span>
  return <span style={{ color: '#64748B', fontSize: 11 }}>{stops} {stops === 1 ? 'parada' : 'paradas'}</span>
}

function FlightCard({ flight }: { flight: CheapFlight }) {
  return (
    <a
      href={flight.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,.07)',
        textDecoration: 'none',
        transition: 'transform .2s, box-shadow .2s',
        border: '1px solid #E2E8F0',
      }}
      onMouseOver={e => {
        ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(26,130,216,.15)'
      }}
      onMouseOut={e => {
        ;(e.currentTarget as HTMLAnchorElement).style.transform = ''
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 4px rgba(0,0,0,.07)'
      }}
    >
      {/* Header colorido */}
      <div style={{
        background: 'linear-gradient(135deg, #093468 0%, #1A82D8 100%)',
        padding: '20px 20px 14px',
        position: 'relative',
      }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>{flight.destinationFlag}</div>
        <div style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
          {flight.destinationCity}
        </div>
        <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, marginTop: 2 }}>
          {flight.destinationCountry}
        </div>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,.15)',
          color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '3px 8px', borderRadius: 100,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: .3,
        }}>
          {flight.origin} → {flight.destination}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4 }}>
              a partir de
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 26, color: '#1A82D8', lineHeight: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>R$</span> {formatPrice(flight.price)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StopsLabel stops={flight.stops} />
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
              {flight.airline}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1A82D8', color: '#fff',
          borderRadius: 8, padding: '9px 0',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13,
          gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          Ver passagem
        </div>
      </div>
    </a>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
      <div style={{ height: 90, background: 'linear-gradient(90deg, #E2E8F0 25%, #F4F6F9 50%, #E2E8F0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 12, background: '#F4F6F9', borderRadius: 6, width: '60%' }} />
        <div style={{ height: 28, background: '#F4F6F9', borderRadius: 6, width: '45%' }} />
        <div style={{ height: 36, background: '#E6F3FF', borderRadius: 8 }} />
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

  const originLabel = ORIGINS.find(o => o.iata === origin)?.label || origin

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #093468 0%, #1A82D8 55%, #2B9FEE 100%)',
        padding: '52px 24px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -100, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              background: 'rgba(245,168,0,.2)', color: '#F5A800',
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100,
              fontFamily: 'Inter, sans-serif', border: '1px solid rgba(245,168,0,.35)',
            }}>
              Monitor de preços · Atualizado em tempo real
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff',
            fontSize: 'clamp(26px, 3.5vw, 44px)', lineHeight: 1.1,
            marginBottom: 10, letterSpacing: '-.3px',
          }}>
            Voos baratos saindo de<br />
            <span style={{ color: '#F5A800' }}>{originLabel}</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            Preços reais do Travelpayouts/Aviasales — sem markup. Atualizado a cada 6 horas.
          </p>

          {/* Seletor de origem */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ORIGINS.map(o => (
              <button
                key={o.iata}
                onClick={() => setOrigin(o.iata)}
                style={{
                  background: origin === o.iata ? '#F5A800' : 'rgba(255,255,255,.12)',
                  color: origin === o.iata ? '#0F2340' : '#fff',
                  border: 'none', borderRadius: 100,
                  padding: '8px 18px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                  transition: '.15s',
                }}
              >
                {o.iata} · {o.label.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 64px' }}>

        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18, color: '#0F2340' }}>
            {loading ? 'Buscando preços...' : error ? 'Erro ao carregar' : `${flights.length} destinos encontrados`}
          </div>
          {updatedAt && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#94A3B8' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Atualizado {new Date(updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              <button
                onClick={() => fetchFlights(origin)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A82D8', fontWeight: 700, fontSize: 12, fontFamily: 'Inter, sans-serif', padding: 0 }}
              >
                · Atualizar
              </button>
            </div>
          )}
        </div>

        {/* Grid de cards */}
        {error ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748B' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✈️</div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8, color: '#0F2340' }}>
              Não conseguimos carregar os preços agora
            </p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Tente novamente em instantes.</p>
            <button
              onClick={() => fetchFlights(origin)}
              style={{
                background: '#1A82D8', color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontWeight: 700, fontSize: 14,
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
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
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            color: '#94A3B8', textAlign: 'center', marginTop: 40, lineHeight: 1.6,
          }}>
            Preços estimados com base no menor valor encontrado para os próximos 2 meses. Valores finais podem variar no momento da compra.
            A Go Livoo recebe comissão de afiliado do Aviasales — sem custo adicional para você.
          </p>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 600px) {
          .voos-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
