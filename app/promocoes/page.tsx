'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Tipos ──────────────────────────────────────────────────────────────────

interface FlightDeal {
  origin:      string
  destination: string
  price:       number
  currency:    string
  airline:     string
  departs:     string
  link:        string
  destCity:    string
  destCountry: string
  destFlag:    string
  photo:       string
}

// ── Helpers ────────────────────────────────────────────────────────────────

const ORIGINS = [
  { iata: 'GRU', city: 'São Paulo' },
  { iata: 'GIG', city: 'Rio de Janeiro' },
  { iata: 'BSB', city: 'Brasília' },
  { iata: 'FOR', city: 'Fortaleza' },
  { iata: 'SSA', city: 'Salvador' },
  { iata: 'REC', city: 'Recife' },
]

function buildTripLink(origin: string, dest: string): string {
  const today = new Date()
  today.setDate(today.getDate() + 30)
  const d = today.toISOString().split('T')[0]
  return `https://br.trip.com/flights/showfarefirst?dcity=${origin.toLowerCase()}&acity=${dest.toLowerCase()}&ddate=${d}&triptype=ow&class=y&quantity=1&locale=pt-BR&curr=BRL`
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'BRL') return `R$ ${Math.round(price).toLocaleString('pt-BR')}`
  if (currency === 'USD') return `US$ ${Math.round(price)} (~R$ ${Math.round(price * 5.8).toLocaleString('pt-BR')})`
  if (currency === 'EUR') return `€${Math.round(price)} (~R$ ${Math.round(price * 6.2).toLocaleString('pt-BR')})`
  return `${currency} ${Math.round(price)}`
}

// ── Componentes ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: '1px solid #e7e6e0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ height: 160, background: '#f0efeb' }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ height: 12, background: '#f0efeb', borderRadius: 6, marginBottom: 8, width: '50%' }} />
        <div style={{ height: 22, background: '#f0efeb', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 28, background: '#fde8e0', borderRadius: 6, width: '60%' }} />
      </div>
    </div>
  )
}

function FlightDealCard({ deal, origin }: { deal: FlightDeal; origin: string }) {
  const link = buildTripLink(origin, deal.destination)
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #e7e6e0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* Foto */}
        <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#0d0d0f' }}>
          <img
            src={deal.photo}
            alt={deal.destCity}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
          }} />
          <span style={{
            position: 'absolute', bottom: 10, left: 12,
            color: '#fff', fontFamily: 'Inter, sans-serif',
            fontSize: '0.82rem', fontWeight: 600,
          }}>
            {deal.destFlag} {deal.destCity}
          </span>
          {deal.airline && (
            <span style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
              fontWeight: 700, padding: '3px 8px', borderRadius: 20,
              letterSpacing: '0.5px',
            }}>
              {deal.airline}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            fontWeight: 600, color: '#6d6d74', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 4,
          }}>
            {deal.destCountry}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem',
            fontWeight: 700, color: '#0d0d0f', marginBottom: 10,
          }}>
            {deal.destCity}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.45rem',
              fontWeight: 800, color: '#ff5722',
            }}>
              {formatPrice(deal.price, deal.currency)}
            </span>
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', marginTop: 4,
          }}>
            Ida · preço estimado · via Trip.com
          </div>
        </div>
      </div>
    </a>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

export default function PromocoesPage() {
  const [selectedOrigin, setSelectedOrigin] = useState('GRU')
  const [deals, setDeals]                   = useState<FlightDeal[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(false)

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true)
      setError(false)
      try {
        const res  = await fetch(`/api/cheap-flights?origin=${selectedOrigin}`)
        const data = await res.json()
        setDeals(data.deals ?? [])
      } catch {
        setError(true)
        setDeals([])
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [selectedOrigin])

  const originCity = ORIGINS.find(o => o.iata === selectedOrigin)?.city ?? selectedOrigin

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0d0f 0%, #1A82D8 60%, #F5A800 100%)',
        padding: '64px 0 52px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(245,168,0,0.15)', color: '#ffd600',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 20, border: '1px solid rgba(245,168,0,0.3)',
          }}>
            Voos em promoção
          </span>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            color: '#fff', margin: '0 0 16px',
          }}>
            Promoções de Passagens
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)', maxWidth: 500,
            margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Os melhores preços partindo de cidades brasileiras, atualizados com dados do Travelpayouts.
          </p>

          {/* Seletor de origem */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {ORIGINS.map(o => (
              <button
                key={o.iata}
                onClick={() => setSelectedOrigin(o.iata)}
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                  fontWeight: 600, padding: '9px 18px', borderRadius: 100,
                  border: '1.5px solid',
                  borderColor: selectedOrigin === o.iata ? '#F5A800' : 'rgba(255,255,255,0.3)',
                  background: selectedOrigin === o.iata ? '#F5A800' : 'transparent',
                  color: selectedOrigin === o.iata ? '#0d0d0f' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {o.city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALS GRID ────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.35rem',
                fontWeight: 700, color: '#0d0d0f', margin: '0 0 4px',
              }}>
                Partindo de {originCity}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6d6d74', margin: 0 }}>
                Preços estimados de ida — clique para ver datas disponíveis no Trip.com
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              color: '#9a9aa0', flexShrink: 0,
            }}>
              Via Travelpayouts
            </span>
          </div>

          {/* Skeletons ou grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error || deals.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e7e6e0',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e7e6e0" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 16 }}>
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', color: '#0d0d0f', margin: '0 0 8px' }}>
                Promoções não disponíveis agora
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6d6d74', margin: '0 0 20px' }}>
                Tente outra cidade de origem ou configure o TRAVELPAYOUTS_TOKEN para preços ao vivo.
              </p>
              <a
                href={`https://br.trip.com/flights/?locale=pt-BR&curr=BRL`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}
              >
                Buscar no Trip.com →
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {deals.map((deal, i) => (
                <FlightDealCard key={`${deal.destination}-${i}`} deal={deal} origin={selectedOrigin} />
              ))}
            </div>
          )}

          {/* CTA roteiro */}
          {!loading && deals.length > 0 && (
            <div style={{
              marginTop: 48, background: '#fff', borderRadius: 16,
              border: '1px solid #e7e6e0', padding: '32px',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.15rem',
                fontWeight: 700, color: '#0d0d0f', margin: '0 0 10px',
              }}>
                Encontrou um destino interessante?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                color: '#6d6d74', margin: '0 0 20px', maxWidth: 420,
                marginLeft: 'auto', marginRight: 'auto',
              }}>
                Monte o roteiro completo — voo, hotel e experiências — com a Go Livoo.
              </p>
              <Link
                href="/roteiro"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '14px 32px', textDecoration: 'none', fontSize: '0.95rem' }}
              >
                Montar roteiro completo →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
