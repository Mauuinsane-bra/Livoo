'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { HotelDeal } from '@/app/api/hotel-deals/route'

// ── Regiões ────────────────────────────────────────────────────────────────

const REGIONS = [
  { id: 'europa',   label: 'Europa' },
  { id: 'americas', label: 'Américas' },
  { id: 'asia',     label: 'Ásia & Oriente Médio' },
]

// ── Skeleton ───────────────────────────────────────────────────────────────

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
        <div style={{ height: 28, background: '#fde8e0', borderRadius: 6, width: '70%' }} />
      </div>
    </div>
  )
}

// ── Hotel Deal Card ────────────────────────────────────────────────────────

function HotelDealCard({ deal }: { deal: HotelDeal }) {
  return (
    <a
      href={deal.link}
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
            alt={deal.city}
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
            {deal.flag} {deal.city}
          </span>
          {/* Hotel icon badge */}
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
            fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21V7l9-4 9 4v14H3zm2-2h14V8.3l-7-3.1L5 8.3V19zm4-4h6v-4H9v4z"/>
            </svg>
            Hotel
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            fontWeight: 600, color: '#6d6d74', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 4,
          }}>
            {deal.country}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem',
            fontWeight: 700, color: '#0d0d0f', marginBottom: 10,
          }}>
            {deal.city}
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem',
            fontWeight: 800, color: '#ff5722',
          }}>
            {deal.priceLabel}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', marginTop: 4,
          }}>
            {deal.priceUSD ? 'Preço real · 7 noites · via Booking.com' : 'Clique para ver preços disponíveis'}
          </div>
        </div>
      </div>
    </a>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

export default function HoteisPage() {
  const [selectedRegion, setSelectedRegion] = useState('europa')
  const [deals, setDeals]                   = useState<HotelDeal[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(false)

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true)
      setError(false)
      try {
        const res  = await fetch(`/api/hotel-deals?region=${selectedRegion}`)
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
  }, [selectedRegion])

  const regionLabel = REGIONS.find(r => r.id === selectedRegion)?.label ?? selectedRegion

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0d0f 0%, #1A82D8 60%, #00b4d8 100%)',
        padding: '64px 0 52px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,180,216,0.15)', color: '#7ee8fa',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 20, border: '1px solid rgba(0,180,216,0.3)',
          }}>
            Hotéis ao redor do mundo
          </span>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            color: '#fff', margin: '0 0 16px',
          }}>
            Onde ficar no seu destino
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)', maxWidth: 500,
            margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Preços reais atualizados via Hotellook — agrega Booking.com, Hotels.com, Agoda e mais numa única busca.
          </p>

          {/* Seletor de região */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {REGIONS.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                  fontWeight: 600, padding: '9px 18px', borderRadius: 100,
                  border: '1.5px solid',
                  borderColor: selectedRegion === r.id ? '#00b4d8' : 'rgba(255,255,255,0.3)',
                  background: selectedRegion === r.id ? '#00b4d8' : 'transparent',
                  color: selectedRegion === r.id ? '#0d0d0f' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {r.label}
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
                Hotéis em {regionLabel}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6d6d74', margin: 0 }}>
                Preços por noite — clique para ver disponibilidade e reservar no Booking.com
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              color: '#9a9aa0', flexShrink: 0,
            }}>
              Via Hotellook
            </span>
          </div>

          {/* Skeletons ou grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error || deals.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e7e6e0',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e7e6e0" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 16 }}>
                <path d="M3 21V7l9-4 9 4v14H3z"/><path d="M9 21v-6h6v6"/>
              </svg>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', color: '#0d0d0f', margin: '0 0 8px' }}>
                Hotéis não disponíveis agora
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6d6d74', margin: '0 0 20px' }}>
                Tente outra região ou busque diretamente no Booking.com.
              </p>
              <a
                href="https://www.booking.com/?aid=356980"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}
              >
                Buscar no Booking.com →
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {deals.map((deal, i) => (
                <HotelDealCard key={`${deal.city}-${i}`} deal={deal} />
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
                Quer montar o pacote completo?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                color: '#6d6d74', margin: '0 0 20px', maxWidth: 420,
                marginLeft: 'auto', marginRight: 'auto',
              }}>
                Voo + hotel + experiências — a Go Livoo monta tudo por você.
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
