'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

// ── Types ──────────────────────────────────────────────────

interface HotelResult {
  id:            string
  name:          string
  location:      string
  country:       string
  stars:         number
  pricePerNight: number
  currency:      string
  imageUrl:      string
  link:          string
}

// ── Star Rating ────────────────────────────────────────────

function StarRating({ stars }: { stars: number }) {
  if (!stars) return null
  return (
    <span style={{ color: '#F5A623', fontSize: '0.85rem', letterSpacing: 1 }}>
      {'★'.repeat(Math.min(stars, 5))}
      {'☆'.repeat(Math.max(0, 5 - stars))}
    </span>
  )
}

// ── Hotel Card ─────────────────────────────────────────────

function HotelCard({ hotel, nights }: { hotel: HotelResult; nights: number }) {
  const [imgError, setImgError] = useState(false)
  const total = hotel.pricePerNight * nights

  function fmt(v: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: hotel.currency, minimumFractionDigits: 0,
    }).format(v)
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', gap: 0 }}>
      {/* Imagem */}
      <div style={{ position: 'relative', width: 200, flexShrink: 0, background: '#EEF4FF' }}>
        {!imgError ? (
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="200px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#1A56DB',
          }}>
            🏨
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <StarRating stars={hotel.stars} />
          <h3 style={{
            fontFamily: 'Fraunces, serif', fontSize: '1.05rem',
            color: '#0D1B3E', margin: '6px 0 4px',
          }}>
            {hotel.name}
          </h3>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.82rem', color: '#5A6A80', margin: 0,
          }}>
            {hotel.location}{hotel.country ? `, ${hotel.country}` : ''}
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginTop: 20,
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: '1.3rem',
              fontWeight: 700, color: '#0D1B3E', margin: 0,
            }}>
              {fmt(hotel.pricePerNight)}
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.72rem', fontWeight: 400,
                color: '#5A6A80', marginLeft: 4,
              }}>
                / noite
              </span>
            </p>
            {nights > 1 && (
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.78rem', color: '#5A6A80', margin: '2px 0 0',
              }}>
                {fmt(total)} total ({nights} noite{nights !== 1 ? 's' : ''})
              </p>
            )}
          </div>
          <a
            href={hotel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '10px 20px', whiteSpace: 'nowrap' }}
          >
            Ver hotel
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Formulário de busca ────────────────────────────────────

function SearchForm({
  defaultLocation, defaultCheckIn, defaultCheckOut, defaultAdults, onSearch,
}: {
  defaultLocation: string
  defaultCheckIn:  string
  defaultCheckOut: string
  defaultAdults:   number
  onSearch: (l: string, ci: string, co: string, a: number) => void
}) {
  const [location,  setLocation]  = useState(defaultLocation)
  const [checkIn,   setCheckIn]   = useState(defaultCheckIn)
  const [checkOut,  setCheckOut]  = useState(defaultCheckOut)
  const [adults,    setAdults]    = useState(defaultAdults)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location || !checkIn || !checkOut) return
    onSearch(location, checkIn, checkOut, adults)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem',
    background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
    borderRadius: 10, color: '#fff', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.72rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
    letterSpacing: '0.8px', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)', padding: '36px 0 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: '1.8rem',
          color: '#fff', marginBottom: 28,
        }}>
          Buscar hotéis
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px', gap: 12, alignItems: 'end' }}>
            {/* Destino */}
            <div>
              <label style={labelStyle}>Destino</label>
              <input
                style={inputStyle}
                placeholder="Cidade, região ou hotel"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Check-in */}
            <div>
              <label style={labelStyle}>Check-in</label>
              <input
                type="date"
                style={inputStyle}
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                required
              />
            </div>

            {/* Check-out */}
            <div>
              <label style={labelStyle}>Check-out</label>
              <input
                type="date"
                style={inputStyle}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                required
              />
            </div>

            {/* Hóspedes */}
            <div>
              <label style={labelStyle}>Hóspedes</label>
              <input
                type="number"
                min={1}
                max={10}
                style={inputStyle}
                value={adults}
                onChange={e => setAdults(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%', marginTop: 14, padding: '14px',
              fontSize: '0.95rem', fontWeight: 700,
            }}
          >
            Buscar hotéis
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────

function HoteisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialLocation  = searchParams.get('location')  || ''
  const initialCheckIn   = searchParams.get('checkIn')   || ''
  const initialCheckOut  = searchParams.get('checkOut')  || ''
  const initialAdults    = parseInt(searchParams.get('adults') ?? '1')

  const [hotels,      setHotels]      = useState<HotelResult[]>([])
  const [fallbackUrl, setFallbackUrl] = useState('')
  const [status,      setStatus]      = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error,       setError]       = useState('')

  // Parâmetros da busca atual (para calcular noites)
  const [currentParams, setCurrentParams] = useState({
    location: initialLocation,
    checkIn:  initialCheckIn,
    checkOut: initialCheckOut,
    adults:   initialAdults,
  })

  // Dispara busca automática se vier com parâmetros na URL
  useEffect(() => {
    if (initialLocation && initialCheckIn && initialCheckOut) {
      fetchHotels(initialLocation, initialCheckIn, initialCheckOut, initialAdults)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function calcNights(ci: string, co: string): number {
    if (!ci || !co) return 1
    const diff = (new Date(co).getTime() - new Date(ci).getTime()) / 86_400_000
    return Math.max(1, Math.round(diff))
  }

  async function fetchHotels(location: string, checkIn: string, checkOut: string, adults: number) {
    setStatus('loading')
    setError('')
    setHotels([])
    setCurrentParams({ location, checkIn, checkOut, adults })

    // Atualiza URL
    const qs = new URLSearchParams({ location, checkIn, checkOut, adults: String(adults) })
    router.replace(`/hoteis?${qs}`, { scroll: false })

    try {
      const res = await fetch(`/api/hotels?${qs}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      setHotels(data.hotels ?? [])
      setFallbackUrl(data.fallbackUrl ?? '')
      setStatus('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar hotéis.')
      setStatus('error')
    }
  }

  const nights = calcNights(currentParams.checkIn, currentParams.checkOut)

  return (
    <>
      <SearchForm
        defaultLocation={initialLocation}
        defaultCheckIn={initialCheckIn}
        defaultCheckOut={initialCheckOut}
        defaultAdults={initialAdults}
        onSearch={fetchHotels}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{
              width: 40, height: 40, border: '3px solid #EEF4FF',
              borderTop: '3px solid #1A56DB', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80' }}>
              Buscando hotéis em {currentParams.location}...
            </p>
          </div>
        )}

        {/* Erro de API (token não configurado) */}
        {status === 'error' && (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 48,
            textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)',
          }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🏨</span>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0D1B3E', marginBottom: 8 }}>
              Busca em configuração
            </h3>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80',
              fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 28px',
            }}>
              {error.includes('não configurada')
                ? 'A API de hotéis está sendo configurada. Enquanto isso, você pode buscar diretamente no Booking.com.'
                : error}
            </p>
            {currentParams.location && currentParams.checkIn && currentParams.checkOut && (
              <a
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(currentParams.location)}&checkin=${currentParams.checkIn}&checkout=${currentParams.checkOut}&group_adults=${currentParams.adults}&no_rooms=1&aid=304142`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', fontSize: '0.9rem', padding: '12px 28px' }}
              >
                Ver hotéis em {currentParams.location} no Booking.com
              </a>
            )}
          </div>
        )}

        {/* Resultados */}
        {status === 'done' && hotels.length > 0 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 20,
            }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: '#5A6A80', fontSize: '0.88rem',
              }}>
                <strong style={{ color: '#0D1B3E' }}>{hotels.length} hotéis</strong> encontrados
                em {currentParams.location} · {nights} noite{nights !== 1 ? 's' : ''}
              </p>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem',
                color: '#5A6A80', background: '#F4F7FF',
                padding: '4px 10px', borderRadius: 20,
              }}>
                Preços em USD · via Hotellook
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} nights={nights} />
              ))}
            </div>

            {/* Fallback Booking.com no rodapé dos resultados */}
            {fallbackUrl && (
              <div style={{
                marginTop: 28, background: '#F4F7FF', borderRadius: 12,
                padding: '20px 24px', textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem',
                  color: '#5A6A80', marginBottom: 12,
                }}>
                  Quer ver mais opções ou filtrar por avaliações?
                </p>
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600,
                    fontSize: '0.88rem', color: '#1A56DB', textDecoration: 'none',
                  }}
                >
                  Ver todos os hotéis no Booking.com →
                </a>
              </div>
            )}
          </>
        )}

        {/* Sem resultados */}
        {status === 'done' && hotels.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 48,
            textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)',
          }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🏨</span>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0D1B3E', marginBottom: 8 }}>
              Não encontramos hotéis em nossa base para esse destino
            </h3>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80',
              fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 28px',
            }}>
              Nossa base pode não ter dados para esse destino ainda. Encontramos opções diretamente no Booking.com.
            </p>
            {fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', fontSize: '0.9rem', padding: '12px 28px' }}
              >
                Ver hotéis em {currentParams.location} no Booking.com
              </a>
            )}
          </div>
        )}

        {/* Estado inicial */}
        {status === 'idle' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#5A6A80', fontSize: '0.95rem',
            }}>
              Digite um destino e as datas para buscar hotéis.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }
        input::placeholder { color: rgba(255,255,255,0.45) !important; }
      `}</style>
    </>
  )
}

export default function HoteisPage() {
  return (
    <Suspense>
      <HoteisContent />
    </Suspense>
  )
}
