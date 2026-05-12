'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { CheapFlight } from '@/app/api/cheap-flights/route'

// ── Origens ────────────────────────────────────────────────────────────────

const ORIGINS = [
  { iata: 'GRU', city: 'São Paulo' },
  { iata: 'GIG', city: 'Rio de Janeiro' },
  { iata: 'BSB', city: 'Brasília' },
  { iata: 'FOR', city: 'Fortaleza' },
  { iata: 'SSA', city: 'Salvador' },
  { iata: 'REC', city: 'Recife' },
  { iata: 'CWB', city: 'Curitiba' },
  { iata: 'POA', city: 'Porto Alegre' },
]

// ── Meses ──────────────────────────────────────────────────────────────────

const MONTHS = [
  { value: '', label: 'Qualquer mês' },
  { value: '2026-05', label: 'Maio 2026' },
  { value: '2026-06', label: 'Junho 2026' },
  { value: '2026-07', label: 'Julho 2026' },
  { value: '2026-08', label: 'Agosto 2026' },
  { value: '2026-09', label: 'Setembro 2026' },
  { value: '2026-10', label: 'Outubro 2026' },
  { value: '2026-11', label: 'Novembro 2026' },
  { value: '2026-12', label: 'Dezembro 2026' },
]

// ── Regiões ────────────────────────────────────────────────────────────────

interface Region {
  id:       string
  label:    string
  subtitle: string
  photo:    string
}

const REGIONS: Region[] = [
  {
    id: 'brasil',
    label: 'Brasil',
    subtitle: 'Passagens aéreas para os melhores destinos nacionais!',
    photo: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=120&h=80&fit=crop',
  },
  {
    id: 'europa',
    label: 'Europa',
    subtitle: 'Portugal, Itália, França, Espanha, Alemanha e mais',
    photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=120&h=80&fit=crop',
  },
  {
    id: 'eua',
    label: 'Estados Unidos',
    subtitle: 'Miami, Orlando, Nova York, Los Angeles e mais',
    photo: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=120&h=80&fit=crop',
  },
  {
    id: 'america-sul',
    label: 'América do Sul',
    subtitle: 'Argentina, Chile, Uruguai, Peru, Colômbia e mais',
    photo: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=120&h=80&fit=crop',
  },
  {
    id: 'caribe',
    label: 'Caribe, México e Região',
    subtitle: 'Cancún, Punta Cana, Aruba, San Andres e mais',
    photo: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=120&h=80&fit=crop',
  },
  {
    id: 'oriente-medio',
    label: 'Oriente Médio',
    subtitle: 'Dubai, Israel, Jordânia, Líbano, Catar e mais',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&h=80&fit=crop',
  },
  {
    id: 'asia',
    label: 'Ásia',
    subtitle: 'Tailândia, Japão, Maldivas, China, Índia e mais',
    photo: 'https://images.unsplash.com/photo-1540959733332-eab44bc62f3c?w=120&h=80&fit=crop',
  },
  {
    id: 'canada',
    label: 'Canadá',
    subtitle: 'Toronto, Vancouver, Montreal, Ottawa e mais',
    photo: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=120&h=80&fit=crop',
  },
  {
    id: 'africa',
    label: 'África',
    subtitle: 'África do Sul, Egito, Marrocos e mais',
    photo: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=120&h=80&fit=crop',
  },
  {
    id: 'oceania',
    label: 'Austrália e N. Zelândia',
    subtitle: 'Sydney, Melbourne, Auckland e mais',
    photo: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=120&h=80&fit=crop',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `R$ ${Math.round(price).toLocaleString('pt-BR')}`
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
      background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
    }}>
      <div style={{ width: 80, height: 56, background: '#f0efeb', borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, background: '#f0efeb', borderRadius: 4, marginBottom: 8, width: '40%' }} />
        <div style={{ height: 12, background: '#f0efeb', borderRadius: 4, width: '70%' }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ height: 10, background: '#f0efeb', borderRadius: 4, marginBottom: 6, width: 80 }} />
        <div style={{ height: 20, background: '#fde8e0', borderRadius: 4, width: 80 }} />
      </div>
    </div>
  )
}

// ── Region Row ─────────────────────────────────────────────────────────────

function RegionRow({
  region,
  minFlight,
  origin,
}: {
  region:    Region
  minFlight: CheapFlight | null
  origin:    string
}) {
  const link = minFlight
    ? minFlight.link
    : 'https://kiwi.tpk.lu/oHyzWHop'

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px', background: '#fff',
        borderRadius: 12, border: '1px solid #E2E8F0',
        transition: 'border-color 0.15s, box-shadow 0.15s', cursor: 'pointer',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#1A82D8'
          el.style.boxShadow = '0 2px 12px rgba(26,130,216,0.1)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#E2E8F0'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Foto */}
        <div style={{
          width: 88, height: 60, borderRadius: 8,
          overflow: 'hidden', flexShrink: 0, background: '#f0efeb',
        }}>
          <img
            src={region.photo}
            alt={region.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1rem', fontWeight: 700,
            color: '#0F2340', marginBottom: 3,
          }}>
            {region.label}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.78rem', color: '#64748B',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {region.subtitle}
          </div>
        </div>

        {/* Preço */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {minFlight ? (
            <>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
                color: '#64748B', marginBottom: 2,
              }}>
                {minFlight.isRoundTrip ? 'Ida + volta' : 'Só ida'}<br />A partir de
              </div>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.15rem', fontWeight: 800, color: '#1A82D8',
              }}>
                {formatPrice(minFlight.price)}
              </div>
            </>
          ) : (
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
              color: '#9a9aa0',
            }}>
              Ver preços →
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

export default function MelhoresDestinosPage() {
  const [origin, setOrigin]         = useState('GRU')
  const [destRegion, setDestRegion] = useState('')
  const [month, setMonth]           = useState('')
  const [flights, setFlights]       = useState<CheapFlight[]>([])
  const [loading, setLoading]       = useState(true)
  const [originInput, setOriginInput] = useState('São Paulo')

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true)
      try {
        const monthParam = month ? `&month=${month}` : ''
        const res  = await fetch(`/api/cheap-flights?origin=${origin}${monthParam}`)
        const data = await res.json()
        setFlights(data.flights ?? [])
      } catch {
        setFlights([])
      } finally {
        setLoading(false)
      }
    }
    fetchFlights()
  }, [origin, month])

  // Filtrar por mês (client-side)
  const filteredFlights = month
    ? flights.filter(f => f.departDate?.startsWith(month))
    : flights

  // Mínimo por região
  function getMinForRegion(regionId: string): CheapFlight | null {
    const regionFlights = filteredFlights.filter(f => f.region === regionId)
    if (regionFlights.length === 0) return null
    return regionFlights.reduce((min, f) => f.price < min.price ? f : min)
  }

  const originCity = ORIGINS.find(o => o.iata === origin)?.city ?? origin

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #f5a800 100%)',
        padding: '52px 0 44px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(26,130,216,0.15)', color: '#93C5FD',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 16, border: '1px solid rgba(26,130,216,0.3)',
          }}>
            Explorar destinos
          </span>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700,
            color: '#fff', margin: '0 0 10px',
          }}>
            Explorar Destinos
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)',
            fontSize: '0.95rem', margin: '0 0 32px',
          }}>
            Veja as passagens que encontramos nas últimas 24h
          </p>

          {/* Filtros */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: '#fff', borderRadius: 12, padding: '14px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {/* Origem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.62rem',
                fontWeight: 700, color: '#64748B', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: 3,
              }}>
                Origem
              </label>
              <select
                value={origin}
                onChange={e => {
                  setOrigin(e.target.value)
                  setOriginInput(ORIGINS.find(o => o.iata === e.target.value)?.city ?? '')
                }}
                style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
                  fontWeight: 700, color: '#0F2340', border: 'none',
                  outline: 'none', background: 'transparent', cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                {ORIGINS.map(o => (
                  <option key={o.iata} value={o.iata}>{o.city}</option>
                ))}
              </select>
            </div>

            <div style={{ width: 1, height: 36, background: '#E2E8F0' }} />

            {/* Destino (região) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.62rem',
                fontWeight: 700, color: '#64748B', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: 3,
              }}>
                Destino
              </label>
              <select
                value={destRegion}
                onChange={e => setDestRegion(e.target.value)}
                style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
                  fontWeight: 700, color: '#0F2340', border: 'none',
                  outline: 'none', background: 'transparent', cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                <option value="">Todas as regiões</option>
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>


            {/* Mês */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.62rem',
                fontWeight: 700, color: '#64748B', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: 3,
              }}>
                Mês
              </label>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
                  fontWeight: 700, color: '#0F2340', border: 'none',
                  outline: 'none', background: 'transparent', cursor: 'pointer',
                  minWidth: 140,
                }}
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── LISTA DE REGIÕES ──────────────────────────────────── */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 900 }}>

          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '1.2rem',
              fontWeight: 700, color: '#0F2340', margin: '0 0 4px',
            }}>
              Partindo de {originCity}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
              Menor preço encontrado por região · clique para ver datas e reservar
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {REGIONS.filter(r => !destRegion || r.id === destRegion).map(region => (
                <RegionRow
                  key={region.id}
                  region={region}
                  minFlight={getMinForRegion(region.id)}
                  origin={origin}
                />
              ))}
            </div>
          )}


          {/* Disclaimer */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', textAlign: 'center', marginTop: 24,
          }}>
            Preços encontrados nas últimas 48h via Travelpayouts · podem variar conforme disponibilidade · via Kiwi.com
          </p>

          {/* CTA roteiro */}
          <div style={{
            marginTop: 40, background: '#fff', borderRadius: 16,
            border: '1px solid #E2E8F0', padding: '28px 32px',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '1.1rem',
              fontWeight: 700, color: '#0F2340', margin: '0 0 8px',
            }}>
              Encontrou um destino?
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
              color: '#64748B', margin: '0 0 18px',
            }}>
              Monte o roteiro completo — voo, hotel e experiências — com a Go Livoo.
            </p>
            <Link
              href="/roteiro"
              className="btn-primary"
              style={{ display: 'inline-block', padding: '12px 28px', textDecoration: 'none' }}
            >
              Montar meu roteiro completo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
