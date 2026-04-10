'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CitySearch from '@/components/CitySearch'

// ── Helpers ────────────────────────────────────────────────

// European cities set for international route detection
const EUROPEAN_CITIES = new Set([
  'veneza', 'venezia', 'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes',
  'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'havre', 'grenoble',
  'montpellier', 'dijon', 'angers', 'nimes', 'clermont-ferrand', 'madrid', 'barcelona',
  'bilbao', 'sevilla', 'valencia', 'malaga', 'lisbon', 'porto', 'berlin', 'hamburg',
  'cologne', 'frankfurt', 'munich', 'vienna', 'budapest', 'prague', 'warsaw',
  'amsterdam', 'rotterdam', 'brussels', 'zurich', 'geneva', 'bern', 'london',
  'manchester', 'edinburgh', 'dublin', 'moscow', 'st petersburg', 'istanbul',
  'athens', 'rome', 'milan', 'genoa', 'naples', 'florence', 'venice', 'stockholm',
  'oslo', 'copenhagen', 'helsinki', 'krakow', 'bucharest', 'sofia', 'belgrade',
  'zagreb', 'split', 'dubrovnik', 'athens', 'corfu', 'mykonos', 'santorini',
  'crete', 'rhodes', 'malta', 'palermo', 'florence', 'pisa', 'venice', 'verona',
  'innsbruck', 'salzburg', 'graz', 'basel', 'lucerne', 'geneva', 'montreux',
  'interlaken', 'zermatt', 'chamonix', 'annecy', 'avignon', 'toulouse', 'nice',
  'cannes', 'antibes', 'monaco', 'menton'
])

function isInternational(city: string): boolean {
  const normalized = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
  return EUROPEAN_CITIES.has(normalized)
}

function slugify(city: string): string {
  return city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function formatDateClickbus(date: string): string {
  // YYYY-MM-DD → DD-MM-YYYY
  const [y, m, d] = date.split('-')
  return `${d}-${m}-${y}`
}

function formatDateDisplay(date: string): string {
  if (!date) return ''
  const d = new Date(date + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Links de cada plataforma ───────────────────────────────

interface Provider {
  id:          string
  name:        string
  description: string
  color:       string
  logo:        string
  badge?:      string
  availability: 'domestic' | 'international' | 'both'
  buildUrl: (from: string, to: string, date: string, passengers: number, returnDate?: string) => string
}

const PROVIDERS: Provider[] = [
  {
    id:          'flixbus',
    name:        'FlixBus',
    description: 'Rede internacional com rotas para Europa e principais cidades sul-americanas.',
    color:       '#73D700',
    logo:        '🟢',
    badge:       'Internacional',
    availability: 'international',
    buildUrl:    (from, to, _date, pax, _returnDate) => {
      const qs = new URLSearchParams({
        departureCity: from,
        arrivalCity:   to,
        adult:         String(pax),
        _locale:       'pt_BR',
      })
      return `https://global.flixbus.com/bus-routes?${qs}`
    },
  },
  {
    id:          'clickbus',
    name:        'Clickbus',
    description: 'Maior plataforma de passagens rodoviárias do Brasil. Compara preços de diversas empresas.',
    color:       '#E8003D',
    logo:        '🚌',
    badge:       'Mais opções',
    availability: 'domestic',
    buildUrl:    (from, to, date, pax) =>
      `https://www.clickbus.com.br/passagens-de-onibus/${slugify(from)}/${slugify(to)}/${formatDateClickbus(date)}/${pax}/`,
  },
  {
    id:          'buser',
    name:        'Buser',
    description: 'Fretamento coletivo com preços até 50% mais baratos em rotas selecionadas.',
    color:       '#6C2BD9',
    logo:        '🟣',
    badge:       'Mais barato',
    availability: 'domestic',
    buildUrl:    (from, to, date, pax) => {
      const qs = new URLSearchParams({
        from,
        to,
        outward_date: date,
        adults:       String(pax),
      })
      return `https://app.buser.com.br/busca?${qs}`
    },
  },
]

// ── Provider Card ──────────────────────────────────────────

function ProviderCard({
  provider, from, to, date, passengers, returnDate, isInternationalRoute,
}: {
  provider:   Provider
  from:       string
  to:         string
  date:       string
  passengers: number
  returnDate?: string
  isInternationalRoute: boolean
}) {
  // Filter providers based on route type
  if (isInternationalRoute && provider.availability === 'domestic') {
    return null // Hide domestic-only providers for international routes
  }

  const url = provider.buildUrl(from, to, date, passengers, returnDate)

  return (
    <div className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Logo / cor */}
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: provider.color + '18',
        border: `2px solid ${provider.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>
        {provider.logo}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{
            fontFamily: 'Fraunces, serif', fontSize: '1.05rem',
            color: '#0D1B3E', margin: 0,
          }}>
            {provider.name}
          </h3>
          {provider.badge && (
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.68rem',
              fontWeight: 700, color: provider.color,
              background: provider.color + '15',
              padding: '2px 8px', borderRadius: 20,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {provider.badge}
            </span>
          )}
        </div>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.83rem',
          color: '#5A6A80', margin: 0,
        }}>
          {provider.description}
        </p>
      </div>

      {/* CTA */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: provider.color,
          color: '#fff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700, fontSize: '0.85rem',
          padding: '10px 20px', borderRadius: 10,
          textDecoration: 'none', whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver passagens →
      </a>
    </div>
  )
}

// ── Formulário de busca ────────────────────────────────────

function SearchForm({
  defaultFrom, defaultTo, defaultDate, defaultReturnDate, defaultPassengers, defaultTripType, onSearch,
}: {
  defaultFrom:       string
  defaultTo:         string
  defaultDate:       string
  defaultReturnDate: string
  defaultPassengers: number
  defaultTripType:   string
  onSearch: (from: string, to: string, date: string, returnDate: string, passengers: number, tripType: string) => void
}) {
  const [from,       setFrom]       = useState(defaultFrom)
  const [to,         setTo]         = useState(defaultTo)
  const [date,       setDate]       = useState(defaultDate)
  const [returnDate, setReturnDate] = useState(defaultReturnDate)
  const [passengers, setPassengers] = useState(defaultPassengers)
  const [tripType,   setTripType]   = useState<'oneway' | 'roundtrip'>(defaultTripType === 'roundtrip' ? 'roundtrip' : 'oneway')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!from || !to || !date) return
    if (tripType === 'roundtrip' && !returnDate) return
    onSearch(from, to, date, returnDate, passengers, tripType)
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
          Buscar passagens de ônibus
        </h1>

        {/* Seletor tipo de viagem */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {([
            { id: 'oneway',   label: 'Só ida' },
            { id: 'roundtrip', label: 'Ida e volta' },
          ] as { id: 'oneway' | 'roundtrip'; label: string }[]).map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTripType(opt.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 50,
                border: `1.5px solid ${tripType === opt.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`,
                background: tripType === opt.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: '#fff',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.8rem',
                fontWeight: tripType === opt.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: tripType === 'roundtrip' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 80px', gap: 12, alignItems: 'end' }}>
            {/* Origem */}
            <div>
              <label style={labelStyle}>Origem</label>
              <CitySearch
                value={from}
                onChange={setFrom}
                placeholder="Ex: São Paulo"
                dark={true}
                required
              />
            </div>

            {/* Destino */}
            <div>
              <label style={labelStyle}>Destino</label>
              <CitySearch
                value={to}
                onChange={setTo}
                placeholder="Ex: Rio de Janeiro"
                dark={true}
                required
              />
            </div>

            {/* Data de ida */}
            <div>
              <label style={labelStyle}>Data de ida</label>
              <input
                type="date"
                style={inputStyle}
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            {/* Data de volta (apenas roundtrip) */}
            {tripType === 'roundtrip' && (
              <div>
                <label style={labelStyle}>Data de volta</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  min={date || undefined}
                  required
                />
              </div>
            )}

            {/* Passageiros */}
            {tripType === 'oneway' && (
              <div>
                <label style={labelStyle}>Pessoas</label>
                <input
                  type="number" min={1} max={10}
                  style={inputStyle}
                  value={passengers}
                  onChange={e => setPassengers(parseInt(e.target.value) || 1)}
                />
              </div>
            )}
          </div>

          {tripType === 'roundtrip' && (
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Passageiros</label>
              <input
                type="number" min={1} max={10}
                style={{ ...inputStyle, width: '100%' }}
                value={passengers}
                onChange={e => setPassengers(parseInt(e.target.value) || 1)}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: 14, padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
          >
            Buscar passagens
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────

function OnibusContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialFrom       = searchParams.get('from')       || ''
  const initialTo         = searchParams.get('to')         || ''
  const initialDate       = searchParams.get('date')       || ''
  const initialReturnDate = searchParams.get('returnDate') || ''
  const initialPassengers = parseInt(searchParams.get('passengers') ?? '1')
  const initialTripType   = searchParams.get('tripType')   || 'oneway'

  const [searched, setSearched] = useState(
    Boolean(initialFrom && initialTo && initialDate)
  )
  const [current, setCurrent] = useState({
    from:       initialFrom,
    to:         initialTo,
    date:       initialDate,
    returnDate: initialReturnDate,
    passengers: initialPassengers,
    tripType:   initialTripType,
  })

  const isInternationalRoute = isInternational(current.from) || isInternational(current.to)

  function handleSearch(from: string, to: string, date: string, returnDate: string, passengers: number, tripType: string) {
    const qs = new URLSearchParams({ from, to, date, tripType, passengers: String(passengers) })
    if (returnDate) {
      qs.set('returnDate', returnDate)
    }
    router.replace(`/onibus?${qs}`, { scroll: false })
    setCurrent({ from, to, date, returnDate, passengers, tripType })
    setSearched(true)
  }

  return (
    <>
      <SearchForm
        defaultFrom={initialFrom}
        defaultTo={initialTo}
        defaultDate={initialDate}
        defaultReturnDate={initialReturnDate}
        defaultPassengers={initialPassengers}
        defaultTripType={initialTripType}
        onSearch={handleSearch}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Resultados */}
        {searched && (
          <>
            {/* Cabeçalho da busca */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontSize: '1.2rem',
                color: '#0D1B3E', marginBottom: 4,
              }}>
                {current.from} → {current.to}
              </h2>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', color: '#5A6A80',
              }}>
                {formatDateDisplay(current.date)} {current.returnDate && `→ ${formatDateDisplay(current.returnDate)}`} · {current.passengers} passageiro{current.passengers !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Banner informativo */}
            <div style={{
              background: isInternationalRoute ? '#FEF3C7' : '#EEF4FF',
              borderRadius: 12,
              padding: '14px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.82rem',
                color: isInternationalRoute ? '#92400E' : '#1A56DB',
                margin: 0,
              }}>
                {isInternationalRoute
                  ? 'Esta é uma rota internacional. FlixBus oferece as melhores conexões para Europa.'
                  : 'Encontramos as principais plataformas para essa rota. Clique em cada uma para comparar preços e horários em tempo real.'}
              </p>
            </div>

            {/* Cards de plataformas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PROVIDERS.map(provider => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  from={current.from}
                  to={current.to}
                  date={current.date}
                  returnDate={current.returnDate}
                  passengers={current.passengers}
                  isInternationalRoute={isInternationalRoute}
                />
              ))}
            </div>

            {/* Dica */}
            <div style={{
              marginTop: 32, background: '#FFF8EC', border: '1px solid #F5A62340',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.83rem', color: '#5A6A80', margin: 0,
              }}>
                <strong style={{ color: '#D48A0A' }}>Dica Go Livoo:</strong> {isInternationalRoute
                  ? 'FlixBus é a principal rede internacional de ônibus para Europa e América do Sul. Oferece ótimos preços e muitas rotas.'
                  : 'O Clickbus agrega várias empresas (Comfortbus, Itapemirim, Catarinense e outras) e costuma ter o maior número de horários. O Buser pode ser mais barato em rotas concorridas como SP → RJ e SP → BH.'}
              </p>
            </div>

            {/* CTA roteiro */}
            <div style={{
              marginTop: 16, background: '#F4F7FF', borderRadius: 12,
              padding: '20px 24px', textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', color: '#5A6A80', marginBottom: 10,
              }}>
                Quer combinar ônibus + hotel + ingresso em um único roteiro?
              </p>
              <a
                href="/roteiro"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600,
                  fontSize: '0.88rem', color: '#1A56DB', textDecoration: 'none',
                }}
              >
                Criar roteiro completo →
              </a>
            </div>
          </>
        )}

        {/* Estado inicial — mostra provedores como preview */}
        {!searched && (
          <div>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.85rem', color: '#5A6A80',
              marginBottom: 20, textAlign: 'center',
            }}>
              Preencha origem, destino e data — os links abaixo serão ativados com seus dados.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5, pointerEvents: 'none' }}>
              {PROVIDERS.map(provider => (
                <div key={provider.id} className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: provider.color + '18', border: `2px solid ${provider.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                  }}>
                    {provider.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.05rem', color: '#0D1B3E', margin: 0 }}>
                        {provider.name}
                      </h3>
                      {provider.badge && (
                        <span style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.68rem',
                          fontWeight: 700, color: provider.color, background: provider.color + '15',
                          padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                          {provider.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.83rem', color: '#5A6A80', margin: 0 }}>
                      {provider.description}
                    </p>
                  </div>
                  <div style={{
                    background: '#D0DCF0', color: '#fff',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 700, fontSize: '0.85rem',
                    padding: '10px 20px', borderRadius: 10,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    Ver passagens →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }
        input::placeholder { color: rgba(255,255,255,0.45) !important; }
      `}</style>
    </>
  )
}

export default function OnibusPage() {
  return (
    <Suspense>
      <OnibusContent />
    </Suspense>
  )
}
