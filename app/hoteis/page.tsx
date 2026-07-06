'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { HotelDeal } from '@/app/api/hotel-deals/route'

// Resultado de /api/hotels (Hotellook via Travelpayouts)
interface CityHotel {
  id: string
  name: string
  location: string
  country: string
  stars: number
  pricePerNight: number
  currency: string
  imageUrl: string
  link: string
}

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
      border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
  // Per CLAUDE.md regra 4: imagens Unsplash podem falhar (ID inválido ou foto deletada).
  // Se a img falhar, renderizamos só o container com gradiente diagonal navy→azul
  // — visualmente coerente com a marca, sem card "vazio".
  const [imgError, setImgError] = useState(false)
  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
        {/* Foto — com fallback gradiente se a img Unsplash falhar */}
        <div style={{
          position: 'relative', height: 160, overflow: 'hidden',
          background: imgError || !deal.photo
            ? 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)'
            : '#0F2340',
        }}>
          {!imgError && deal.photo && (
            <img
              src={deal.photo}
              alt={deal.city}
              onError={() => setImgError(true)}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
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
            fontWeight: 600, color: '#64748B', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 4,
          }}>
            {deal.country}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
            fontWeight: 700, color: '#0F2340', marginBottom: 10,
          }}>
            {deal.city}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '1.2rem',
            fontWeight: 800, color: '#1A82D8',
          }}>
            {deal.priceLabel}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', marginTop: 4,
          }}>
            {deal.priceUSD ? 'A partir de · 7 noites · sujeito a disponibilidade' : 'Clique para ver preços disponíveis'}
          </div>
        </div>
      </div>
    </a>
  )
}

// ── Hotéis do destino do roteiro (?destino=Cidade) ─────────────────────────
// Quando o usuário chega do roteiro pago, mostramos os hotéis reais da cidade
// dele no topo — em vez de uma grade genérica de destinos.

function DestinationHotels({ destino, checkIn, checkOut }: { destino: string; checkIn: string; checkOut: string }) {
  const [hotels, setHotels]         = useState<CityHotel[]>([])
  const [fallbackUrl, setFallback]  = useState('')
  const [loading, setLoading]       = useState(true)
  const [imgErrors, setImgErrors]   = useState<Record<string, boolean>>({})

  // Sem datas (roteiro com datas flexíveis): estima uma janela de 7 noites
  // daqui a ~60 dias só para consultar preços.
  const hasDates = /^\d{4}-\d{2}-\d{2}$/.test(checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(checkOut)
  const inDate  = hasDates ? checkIn  : new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10)
  const outDate = hasDates ? checkOut : new Date(Date.now() + 67 * 86400000).toISOString().slice(0, 10)

  useEffect(() => {
    let alive = true
    async function fetchCityHotels() {
      setLoading(true)
      try {
        const res  = await fetch(`/api/hotels?location=${encodeURIComponent(destino)}&checkIn=${inDate}&checkOut=${outDate}`)
        const data = await res.json()
        if (!alive) return
        setHotels(Array.isArray(data.hotels) ? data.hotels.slice(0, 6) : [])
        setFallback(typeof data.fallbackUrl === 'string' ? data.fallbackUrl : '')
      } catch {
        if (alive) setHotels([])
      } finally {
        if (alive) setLoading(false)
      }
    }
    fetchCityHotels()
    return () => { alive = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destino])

  if (!loading && hotels.length === 0 && !fallbackUrl) return null

  return (
    <section style={{ padding: '48px 0 0' }}>
      <div className="container">
        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #1A82D8', padding: '28px 28px 32px', boxShadow: '0 8px 32px rgba(26,130,216,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            <div>
              <span style={{
                display: 'inline-block', background: '#E6F3FF', color: '#1260A8',
                fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '1.2px', textTransform: 'uppercase',
                padding: '4px 12px', borderRadius: 50, marginBottom: 10,
              }}>
                Do seu roteiro
              </span>
              <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#0F2340', margin: 0 }}>
                Hotéis em {destino}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>
                {hasDates
                  ? `Preços para ${inDate.split('-').reverse().join('/')} – ${outDate.split('-').reverse().join('/')}`
                  : 'Preços estimados por noite — ajuste as datas ao reservar'}
              </p>
            </div>
            {fallbackUrl && (
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600,
                color: '#1A82D8', textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                Ver todos em {destino} →
              </a>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : hotels.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {hotels.map(h => (
                <a key={h.id} href={h.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{
                      position: 'relative', height: 130, overflow: 'hidden',
                      background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 100%)',
                    }}>
                      {!imgErrors[h.id] && h.imageUrl && (
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          loading="lazy"
                          onError={() => setImgErrors(prev => ({ ...prev, [h.id]: true }))}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#0F2340', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.name}
                      </div>
                      {h.stars > 0 && (
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#F5A800', marginBottom: 6 }}>
                          {'★'.repeat(Math.min(h.stars, 5))}
                        </div>
                      )}
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.05rem', fontWeight: 800, color: '#1A82D8' }}>
                        US$ {h.pricePerNight}
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 400, color: '#9a9aa0' }}> / noite</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Não encontramos preços em cache para {destino} agora.{' '}
              {fallbackUrl && (
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1A82D8', fontWeight: 600 }}>
                  Ver disponibilidade em {destino} →
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

function HoteisContent() {
  const searchParams = useSearchParams()
  const destino  = (searchParams.get('destino') ?? '').trim().slice(0, 80)
  const qCheckIn  = searchParams.get('checkIn') ?? ''
  const qCheckOut = searchParams.get('checkOut') ?? ''
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
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
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
            fontFamily: 'Nunito, sans-serif',
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
            Compare preços de hotéis nos principais destinos do mundo. Clique para ver disponibilidade e reservar.
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
                  borderColor: selectedRegion === r.id ? '#1A82D8' : 'rgba(255,255,255,0.3)',
                  background: selectedRegion === r.id ? '#1A82D8' : 'transparent',
                  color: selectedRegion === r.id ? '#0F2340' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOTÉIS DO DESTINO DO ROTEIRO (?destino=) ──────────── */}
      {destino && <DestinationHotels destino={destino} checkIn={qCheckIn} checkOut={qCheckOut} />}

      {/* ── DEALS GRID ────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{
                fontFamily: 'Nunito, sans-serif', fontSize: '1.35rem',
                fontWeight: 700, color: '#0F2340', margin: '0 0 4px',
              }}>
                Hotéis em {regionLabel}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Preços estimados por noite — clique para ver disponibilidade e reservar
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              color: '#9a9aa0', flexShrink: 0,
            }}>
              Preços sujeitos a disponibilidade
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
              border: '1px solid #E2E8F0',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 16 }}>
                <path d="M3 21V7l9-4 9 4v14H3z"/><path d="M9 21v-6h6v6"/>
              </svg>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.1rem', color: '#0F2340', margin: '0 0 8px' }}>
                Hotéis não disponíveis agora
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#64748B', margin: '0 0 20px' }}>
                Tente outra região ou selecione um destino no roteiro completo.
              </p>
              <Link
                href="/roteiro"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}
              >
                Montar roteiro com hotel →
              </Link>
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
              border: '1px solid #E2E8F0', padding: '32px',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem',
                fontWeight: 700, color: '#0F2340', margin: '0 0 10px',
              }}>
                Quer montar o roteiro completo?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                color: '#64748B', margin: '0 0 20px', maxWidth: 420,
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

// useSearchParams exige um limite de Suspense no App Router
export default function HoteisPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}>Carregando...</p>
      </div>
    }>
      <HoteisContent />
    </Suspense>
  )
}
