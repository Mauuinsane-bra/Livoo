'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// ── Helpers ────────────────────────────────────────────────

function formatDateDisplay(date: string): string {
  if (!date) return ''
  const d = new Date(date + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function calcDays(pickupDate: string, returnDate: string): number {
  if (!pickupDate || !returnDate) return 1
  const diff = (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86_400_000
  return Math.max(1, Math.round(diff))
}

// ── Provedores de aluguel ──────────────────────────────────

interface CarProvider {
  id:          string
  name:        string
  description: string
  color:       string
  logo:        string
  badge?:      string
  buildUrl: (location: string, pickup: string, ret: string) => string
}

const CAR_PROVIDERS: CarProvider[] = [
  {
    id:          'rentcars',
    name:        'Rentcars',
    description: 'Maior agregador de aluguel de carros do Brasil. Compara Localiza, Unidas, Movida, Hertz e mais.',
    color:       '#0050FF',
    logo:        '🔵',
    badge:       'Mais opções',
    buildUrl:    (location, pickup, ret) => {
      const qs = new URLSearchParams({
        pickUpLocation:   location,
        dropOffLocation:  location,
        pickUpDate:       pickup,
        dropOffDate:      ret,
        pickUpTime:       '10:00',
        dropOffTime:      '10:00',
      })
      return `https://www.rentcars.com/pt-br/carros?${qs}`
    },
  },
  {
    id:          'localiza',
    name:        'Localiza',
    description: 'Maior rede de aluguel de carros da América Latina, com mais de 600 agências no Brasil.',
    color:       '#009A44',
    logo:        '🟢',
    buildUrl:    (location, pickup, ret) => {
      const qs = new URLSearchParams({
        retirada:         location,
        devolucao:        location,
        dataRetirada:     pickup,
        dataDevolucao:    ret,
        horaRetirada:     '10:00',
        horaDevolucao:    '10:00',
      })
      return `https://www.localiza.com/brasil/pt-br/resultado?${qs}`
    },
  },
  {
    id:          'movida',
    name:        'Movida',
    description: 'Segunda maior locadora do Brasil, com boa cobertura em aeroportos e centros urbanos.',
    color:       '#E30613',
    logo:        '🔴',
    buildUrl:    (location, pickup, ret) => {
      const qs = new URLSearchParams({
        local:   location,
        entrada: pickup,
        saida:   ret,
      })
      return `https://www.movida.com.br/aluguel-de-carros?${qs}`
    },
  },
  {
    id:          'unidas',
    name:        'Unidas',
    description: 'Forte presença em aeroportos e opções de carros executivos para viagens corporativas.',
    color:       '#FF6600',
    logo:        '🟠',
    buildUrl:    (location, pickup, ret) => {
      const qs = new URLSearchParams({
        cidade:      location,
        dataEntrada: pickup,
        dataSaida:   ret,
      })
      return `https://www.unidas.com.br/aluguel-de-carros?${qs}`
    },
  },
]

// ── Provider Card ──────────────────────────────────────────

function CarProviderCard({
  provider, location, pickupDate, returnDate,
}: {
  provider:   CarProvider
  location:   string
  pickupDate: string
  returnDate: string
}) {
  const url  = provider.buildUrl(location, pickupDate, returnDate)
  const days = calcDays(pickupDate, returnDate)

  return (
    <div className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Logo */}
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: provider.color + '15',
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

      {/* Diárias + CTA */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem',
          color: '#5A6A80', marginBottom: 8,
        }}>
          {days} diária{days !== 1 ? 's' : ''}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: provider.color, color: '#fff',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700, fontSize: '0.85rem',
            padding: '10px 20px', borderRadius: 10,
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Ver preços →
        </a>
      </div>
    </div>
  )
}

// ── Formulário de busca ────────────────────────────────────

function SearchForm({
  defaultLocation, defaultPickup, defaultReturn, onSearch,
}: {
  defaultLocation: string
  defaultPickup:   string
  defaultReturn:   string
  onSearch: (location: string, pickup: string, ret: string) => void
}) {
  const [location, setLocation] = useState(defaultLocation)
  const [pickup,   setPickup]   = useState(defaultPickup)
  const [ret,      setRet]      = useState(defaultReturn)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location || !pickup || !ret) return
    onSearch(location, pickup, ret)
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
          color: '#fff', marginBottom: 8,
        }}>
          Alugar carro
        </h1>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.6)', marginBottom: 28,
        }}>
          Compare Localiza, Movida, Unidas e mais — tudo em um lugar.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
            {/* Local de retirada */}
            <div>
              <label style={labelStyle}>Local de retirada</label>
              <input
                style={inputStyle}
                placeholder="Cidade ou aeroporto"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Retirada */}
            <div>
              <label style={labelStyle}>Data de retirada</label>
              <input
                type="date"
                style={inputStyle}
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                required
              />
            </div>

            {/* Devolução */}
            <div>
              <label style={labelStyle}>Data de devolução</label>
              <input
                type="date"
                style={inputStyle}
                value={ret}
                onChange={e => setRet(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: 14, padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
          >
            Buscar carros
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────

function CarrosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialLocation = searchParams.get('location') || ''
  const initialPickup   = searchParams.get('pickup')   || ''
  const initialReturn   = searchParams.get('return')   || ''

  const [searched, setSearched] = useState(
    Boolean(initialLocation && initialPickup && initialReturn)
  )
  const [current, setCurrent] = useState({
    location: initialLocation,
    pickup:   initialPickup,
    return:   initialReturn,
  })

  function handleSearch(location: string, pickup: string, ret: string) {
    const qs = new URLSearchParams({ location, pickup, return: ret })
    router.replace(`/carros?${qs}`, { scroll: false })
    setCurrent({ location, pickup, return: ret })
    setSearched(true)
  }

  const days = calcDays(current.pickup, current.return)

  return (
    <>
      <SearchForm
        defaultLocation={initialLocation}
        defaultPickup={initialPickup}
        defaultReturn={initialReturn}
        onSearch={handleSearch}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {searched && (
          <>
            {/* Cabeçalho */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontSize: '1.2rem',
                color: '#0D1B3E', marginBottom: 4,
              }}>
                Carros em {current.location}
              </h2>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', color: '#5A6A80',
              }}>
                {formatDateDisplay(current.pickup)} → {formatDateDisplay(current.return)} · {days} diária{days !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Banner */}
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
                Clique em cada locadora para ver modelos disponíveis, categorias e preços em tempo real para {current.location}.
              </p>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CAR_PROVIDERS.map(provider => (
                <CarProviderCard
                  key={provider.id}
                  provider={provider}
                  location={current.location}
                  pickupDate={current.pickup}
                  returnDate={current.return}
                />
              ))}
            </div>

            {/* Dica */}
            <div style={{
              marginTop: 32, background: '#FFF8EC',
              border: '1px solid #F5A62340', borderRadius: 12,
              padding: '20px 24px',
            }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.83rem', color: '#5A6A80', margin: 0,
              }}>
                <strong style={{ color: '#D48A0A' }}>Dica Go Livoo:</strong> O Rentcars compara todas as locadoras ao mesmo tempo e costuma ter o melhor preço final.
                Para retiradas em aeroportos, verifique se o seguro básico já está incluso no valor exibido.
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
                Quer montar um roteiro completo com carro + voo + hotel?
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

        {!searched && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#5A6A80', fontSize: '0.95rem',
            }}>
              Digite o local de retirada e as datas para ver as opções de aluguel.
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

export default function CarrosPage() {
  return (
    <Suspense>
      <CarrosContent />
    </Suspense>
  )
}
