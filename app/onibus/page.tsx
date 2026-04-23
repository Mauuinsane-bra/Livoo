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
  id:           string
  name:         string
  description:  string
  color:        string
  initials:     string  // 2 letras como logotipo (substitui emoji)
  badge?:       string
  priceRange:   string  // faixa estimada para exibição antes do redirecionamento
  availability: 'domestic' | 'international' | 'both'
  buildUrl: (from: string, to: string, date: string, passengers: number, returnDate?: string) => string
}

const PROVIDERS: Provider[] = [
  {
    id:           'flixbus',
    name:         'FlixBus',
    description:  'Rede internacional com rotas para Europa e principais cidades sul-americanas.',
    color:        '#73D700',
    initials:     'FB',
    badge:        'Internacional',
    priceRange:   'a partir de €9 (≈ R$ 54)',
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
    id:           'clickbus',
    name:         'Clickbus',
    description:  'Maior plataforma de passagens rodoviárias do Brasil. Compara preços de diversas empresas em uma busca.',
    color:        '#E8003D',
    initials:     'CB',
    badge:        'Mais opções',
    priceRange:   'a partir de R$ 45 (trechos curtos)',
    availability: 'domestic',
    buildUrl:    (from, to, date, pax) =>
      `https://www.clickbus.com.br/passagens-de-onibus/${slugify(from)}/${slugify(to)}/${formatDateClickbus(date)}/${pax}/`,
  },
  {
    id:           'buser',
    name:         'Buser',
    description:  'Fretamento coletivo com preços até 50% mais baratos em rotas selecionadas como SP → RJ e SP → BH.',
    color:        '#6C2BD9',
    initials:     'BU',
    badge:        'Mais barato',
    priceRange:   'até 50% mais barato que o convencional',
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

// SVG monogram logo (substitui o emoji de cor)
function ProviderMonogram({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 14,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
      fontSize: 18, letterSpacing: '0.5px', flexShrink: 0,
      boxShadow: `0 4px 12px ${color}40`,
    }}>
      {initials}
    </div>
  )
}

// ── Provider Card ──────────────────────────────────────────

function ProviderCard({
  provider, from, to, date, passengers, returnDate, isInternationalRoute, onRedirect,
}: {
  provider:             Provider
  from:                 string
  to:                   string
  date:                 string
  passengers:           number
  returnDate?:          string
  isInternationalRoute: boolean
  onRedirect:           (name: string) => void
}) {
  if (isInternationalRoute && provider.availability === 'domestic') return null

  const url = provider.buildUrl(from, to, date, passengers, returnDate)

  return (
    <div className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Logo monograma */}
      <ProviderMonogram initials={provider.initials} color={provider.color} />

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem',
            color: '#0d0d0f', margin: 0,
          }}>
            {provider.name}
          </h3>
          {provider.badge && (
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
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
          fontFamily: 'Inter, sans-serif', fontSize: '0.83rem',
          color: '#6d6d74', margin: '0 0 4px',
        }}>
          {provider.description}
        </p>
        {/* Faixa de preço estimada */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
          color: provider.color, fontWeight: 600, margin: 0,
        }}>
          Estimativa: {provider.priceRange}
        </p>
      </div>

      {/* CTA */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onRedirect(provider.name)}
        style={{
          display: 'inline-block',
          background: provider.color,
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
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
    fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
    background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
    borderRadius: 10, color: '#fff', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.72rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
    letterSpacing: '0.8px', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0d0d0f 0%, #ff5722 60%, #2B9FEE 100%)', padding: '36px 0 48px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem',
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
                fontFamily: 'Inter, sans-serif',
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

  const [searched,     setSearched]     = useState(Boolean(initialFrom && initialTo && initialDate))
  const [current,      setCurrent]      = useState({
    from:       initialFrom,
    to:         initialTo,
    date:       initialDate,
    returnDate: initialReturnDate,
    passengers: initialPassengers,
    tripType:   initialTripType,
  })
  const [notification, setNotification] = useState<string | null>(null)

  const isInternationalRoute = isInternational(current.from) || isInternational(current.to)

  function handleSearch(from: string, to: string, date: string, returnDate: string, passengers: number, tripType: string) {
    const qs = new URLSearchParams({ from, to, date, tripType, passengers: String(passengers) })
    if (returnDate) qs.set('returnDate', returnDate)
    router.replace(`/onibus?${qs}`, { scroll: false })
    setCurrent({ from, to, date, returnDate, passengers, tripType })
    setSearched(true)
    setNotification(null)
  }

  function handleRedirect(providerName: string) {
    setNotification(providerName)
    setTimeout(() => setNotification(null), 5000)
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
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem',
                color: '#0d0d0f', marginBottom: 4,
              }}>
                {current.from} → {current.to}
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem', color: '#6d6d74',
              }}>
                {formatDateDisplay(current.date)} {current.returnDate && `→ ${formatDateDisplay(current.returnDate)}`} · {current.passengers} passageiro{current.passengers !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Notificação de redirecionamento */}
            {notification && (
              <div style={{
                background: '#ECFDF5', border: '1px solid #6EE7B7',
                borderRadius: 12, padding: '14px 20px', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem', color: '#065F46', margin: 0, fontWeight: 600,
                }}>
                  Abrindo {notification} com sua rota já preenchida — {current.from} → {current.to} na data selecionada.
                </p>
              </div>
            )}

            {/* Banner informativo */}
            <div style={{
              background: isInternationalRoute ? '#FEF3C7' : '#fafaf7',
              borderRadius: 12,
              padding: '14px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isInternationalRoute ? '#92400E' : '#ff5722'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                color: isInternationalRoute ? '#92400E' : '#ff5722',
                margin: 0,
              }}>
                {isInternationalRoute
                  ? 'Esta é uma rota internacional. FlixBus oferece as melhores conexões para Europa.'
                  : `Clique em cada plataforma — sua rota (${current.from} → ${current.to}) é enviada automaticamente.`}
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
                  onRedirect={handleRedirect}
                />
              ))}
            </div>

            {/* Dica */}
            <div style={{
              marginTop: 32, background: '#fffbe6', border: '1px solid #ffd60040',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.83rem', color: '#6d6d74', margin: 0,
              }}>
                <strong style={{ color: '#D48A0A' }}>Dica Go Livoo:</strong> {isInternationalRoute
                  ? 'FlixBus é a principal rede internacional de ônibus para Europa e América do Sul. Oferece ótimos preços e muitas rotas.'
                  : 'O Clickbus agrega várias empresas (Comfortbus, Itapemirim, Catarinense e outras) e costuma ter o maior número de horários. O Buser pode ser mais barato em rotas concorridas como SP → RJ e SP → BH.'}
              </p>
            </div>

            {/* CTA roteiro */}
            <div style={{
              marginTop: 16, background: '#fafaf7', borderRadius: 12,
              padding: '20px 24px', textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem', color: '#6d6d74', marginBottom: 10,
              }}>
                Quer combinar ônibus + hotel + ingresso em um único roteiro?
              </p>
              <a
                href="/roteiro"
                style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '0.88rem', color: '#ff5722', textDecoration: 'none',
                }}
              >
                Criar roteiro completo →
              </a>
            </div>
          </>
        )}

        {/* Estado inicial */}
        {!searched && (
          <div>
            {/* Plataformas disponíveis */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem',
                fontWeight: 700, color: '#0d0d0f', margin: '0 0 6px',
              }}>
                Plataformas disponíveis
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                color: '#6d6d74', margin: '0 0 20px',
              }}>
                Preencha origem, destino e data acima — seus dados são enviados automaticamente para cada plataforma.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PROVIDERS.map(provider => (
                  <div key={provider.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                    <ProviderMonogram initials={provider.initials} color={provider.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0d0d0f' }}>
                          {provider.name}
                        </span>
                        {provider.badge && (
                          <span style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 700,
                            color: provider.color, background: provider.color + '18',
                            padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}>
                            {provider.badge}
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6d6d74', margin: '0 0 3px' }}>
                        {provider.description}
                      </p>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: provider.color }}>
                        Estimativa: {provider.priceRange}
                      </span>
                    </div>
                    <a
                      href={provider.buildUrl('', '', '', 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block', flexShrink: 0,
                        background: '#f4f4f2', color: '#0d0d0f',
                        fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        fontSize: '0.82rem', padding: '9px 18px', borderRadius: 10,
                        textDecoration: 'none', whiteSpace: 'nowrap',
                        border: '1.5px solid #e7e6e0',
                      }}
                    >
                      Ver site →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Faixas de preço por rota */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e6e0', padding: '28px 28px', marginBottom: 28 }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem',
                fontWeight: 700, color: '#0d0d0f', margin: '0 0 18px',
              }}>
                Faixas de preço por rota
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {[
                  { rota: 'São Paulo → Rio', preco: 'R$ 45–120', tempo: '~6h' },
                  { rota: 'São Paulo → BH', preco: 'R$ 40–90', tempo: '~7h' },
                  { rota: 'São Paulo → Floripa', preco: 'R$ 60–130', tempo: '~8h' },
                  { rota: 'Rio → BH', preco: 'R$ 50–110', tempo: '~6h' },
                  { rota: 'Buenos Aires → Montevidéu', preco: 'US$ 9–25', tempo: '~3h' },
                  { rota: 'Europa (FlixBus)', preco: 'a partir de €4', tempo: 'Varia' },
                ].map(r => (
                  <div key={r.rota} style={{
                    background: '#fafaf7', borderRadius: 10,
                    padding: '14px 16px', border: '1px solid #f0efeb',
                  }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#0d0d0f', marginBottom: 4 }}>
                      {r.rota}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 700, color: '#ff5722', marginBottom: 2 }}>
                      {r.preco}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#6d6d74' }}>
                      Duração: {r.tempo}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#9a9aa0', margin: '14px 0 0' }}>
                Estimativas baseadas em pesquisas recentes. Preços reais variam por data e disponibilidade.
              </p>
            </div>

            {/* Como funciona */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e6e0', padding: '28px 28px' }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem',
                fontWeight: 700, color: '#0d0d0f', margin: '0 0 20px',
              }}>
                Como funciona
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  { n: '1', t: 'Informe a rota', d: 'Digite origem, destino, data e número de passageiros.' },
                  { n: '2', t: 'Escolha a plataforma', d: 'Veja as opções domésticas e internacionais disponíveis para sua rota.' },
                  { n: '3', t: 'Compre direto', d: 'Seus dados são enviados automaticamente. Finalize a compra no site da plataforma.' },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: 'linear-gradient(135deg, #ff5722, #e04010)',
                      color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 800, fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 10,
                    }}>
                      {s.n}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#0d0d0f', marginBottom: 5 }}>
                      {s.t}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6d6d74', lineHeight: 1.5 }}>
                      {s.d}
                    </div>
                  </div>
                ))}
              </div>
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
