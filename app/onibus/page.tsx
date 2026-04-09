'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// ── Helpers ────────────────────────────────────────────────

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
  logo:        string   // emoji como placeholder — substituir por <Image> futuramente
  badge?:      string
  buildUrl: (from: string, to: string, date: string, passengers: number) => string
}

const PROVIDERS: Provider[] = [
  {
    id:          'clickbus',
    name:        'Clickbus',
    description: 'Maior plataforma de passagens rodoviárias do Brasil. Compara preços de diversas empresas.',
    color:       '#E8003D',
    logo:        '🚌',
    badge:       'Mais opções',
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
  {
    id:          'flixbus',
    name:        'FlixBus',
    description: 'Rede internacional com rotas entre grandes cidades brasileiras e destinos sul-americanos.',
    color:       '#73D700',
    logo:        '🟢',
    buildUrl:    (from, to, _date, pax) => {
      const qs = new URLSearchParams({
        departureCity: from,
        arrivalCity:   to,
        adult:         String(pax),
        _locale:       'pt_BR',
      })
      return `https://global.flixbus.com/bus-routes?${qs}`
    },
  },
]

// ── Provider Card ──────────────────────────────────────────

function ProviderCard({
  provider, from, to, date, passengers,
}: {
  provider:   Provider
  from:       string
  to:         string
  date:       string
  passengers: number
}) {
  const url = provider.buildUrl(from, to, date, passengers)

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
  defaultFrom, defaultTo, defaultDate, defaultPassengers, onSearch,
}: {
  defaultFrom:       string
  defaultTo:         string
  defaultDate:       string
  defaultPassengers: number
  onSearch: (from: string, to: string, date: string, passengers: number) => void
}) {
  const [from,       setFrom]       = useState(defaultFrom)
  const [to,         setTo]         = useState(defaultTo)
  const [date,       setDate]       = useState(defaultDate)
  const [passengers, setPassengers] = useState(defaultPassengers)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!from || !to || !date) return
    onSearch(from, to, date, passengers)
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
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: 12, alignItems: 'end' }}>
            {/* Origem */}
            <div>
              <label style={labelStyle}>Origem</label>
              <input
                style={inputStyle}
                placeholder="Ex: São Paulo"
                value={from}
                onChange={e => setFrom(e.target.value)}
                required
              />
            </div>

            {/* Destino */}
            <div>
              <label style={labelStyle}>Destino</label>
              <input
                style={inputStyle}
                placeholder="Ex: Rio de Janeiro"
                value={to}
                onChange={e => setTo(e.target.value)}
                required
              />
            </div>

            {/* Data */}
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

            {/* Passageiros */}
            <div>
              <label style={labelStyle}>Pessoas</label>
              <input
                type="number" min={1} max={10}
                style={inputStyle}
                value={passengers}
                onChange={e => setPassengers(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

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
  const initialPassengers = parseInt(searchParams.get('passengers') ?? '1')

  const [searched, setSearched] = useState(
    Boolean(initialFrom && initialTo && initialDate)
  )
  const [current, setCurrent] = useState({
    from:       initialFrom,
    to:         initialTo,
    date:       initialDate,
    passengers: initialPassengers,
  })

  function handleSearch(from: string, to: string, date: string, passengers: number) {
    const qs = new URLSearchParams({ from, to, date, passengers: String(passengers) })
    router.replace(`/onibus?${qs}`, { scroll: false })
    setCurrent({ from, to, date, passengers })
    setSearched(true)
  }

  return (
    <>
      <SearchForm
        defaultFrom={initialFrom}
        defaultTo={initialTo}
        defaultDate={initialDate}
        defaultPassengers={initialPassengers}
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
                {formatDateDisplay(current.date)} · {current.passengers} passageiro{current.passengers !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Banner informativo */}
            <div style={{
              background: '#EEF4FF', borderRadius: 12,
              padding: '14px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.82rem', color: '#1A56DB', margin: 0,
              }}>
                Encontramos as principais plataformas para essa rota. Clique em cada uma para comparar preços e horários em tempo real.
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
                  passengers={current.passengers}
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
                <strong style={{ color: '#D48A0A' }}>Dica Go Livoo:</strong> O Clickbus agrega várias
                empresas (Comfortbus, Itapemirim, Catarinense e outras) e costuma ter o maior número
                de horários. O Buser pode ser mais barato em rotas concorridas como SP → RJ e SP → BH.
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

        {/* Estado inicial */}
        {!searched && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#5A6A80', fontSize: '0.95rem',
            }}>
              Digite a origem, o destino e a data para ver as opções de ônibus disponíveis.
            </p>
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
