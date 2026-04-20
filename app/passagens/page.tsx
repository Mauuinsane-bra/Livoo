'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Script from 'next/script'
import FlightCard from '@/components/FlightCard'
import FlightDrawer from '@/components/FlightDrawer'
import AirportSearch, { type Airport } from '@/components/AirportSearch'
import DatePicker from '@/components/DatePicker'

interface FlightOffer {
  id: string
  airline: string
  airlineCode: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  currency: string
  link?: string
}

type SortKey = 'price' | 'duration' | 'stops'

// ── Seção de resultados (ida ou volta) ─────────────────────
function FlightSection({
  title, flights, sortBy, onlyDirect, onSelect,
}: {
  title: string
  flights: FlightOffer[]
  sortBy: SortKey
  onlyDirect: boolean
  onSelect: (f: FlightOffer) => void
}) {
  const filtered = flights
    .filter(f => !onlyDirect || f.stops === 0)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'stops') return a.stops - b.stops
      return a.duration.localeCompare(b.duration)
    })

  if (filtered.length === 0) return null

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        {title.includes('Ida') ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        )}
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f',
          fontSize: '1.05rem', margin: 0,
        }}>
          {title}
        </h3>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
          color: '#6d6d74', marginLeft: 4,
        }}>
          {filtered.length} opção{filtered.length !== 1 ? 'ões' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(flight => (
          <FlightCard key={flight.id} flight={flight} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

// ── Leg info parsed from URL ──────────────────────────────
interface LegParam { o: string; d: string; date: string }

// ── Resultados de múltiplos trechos ──────────────────────
interface LegResult {
  leg: LegParam
  flights: FlightOffer[]
  legIndex: number
}

// ── Toggle entre White Label e busca clássica ───────────
type SearchMode = 'whitelabel' | 'classic'

function PassagensContent() {
  const params = useSearchParams()
  const router = useRouter()

  // Detecta modo múltiplos destinos (sempre usa clássico)
  const legsRaw = params.get('legs')
  const parsedLegs: LegParam[] = (() => {
    try { return legsRaw ? JSON.parse(decodeURIComponent(legsRaw)) : [] } catch { return [] }
  })()
  const isMultiDestination = parsedLegs.length >= 2

  // Se veio da URL com parâmetros de busca, usa modo clássico
  const hasUrlParams = !!(params.get('origin') && params.get('destination') && params.get('date'))
  const defaultMode: SearchMode = (isMultiDestination || hasUrlParams) ? 'classic' : 'whitelabel'

  const [searchMode, setSearchMode] = useState<SearchMode>(defaultMode)

  const [origin,      setOrigin]      = useState<Airport | null>(null)
  const [destination, setDestination] = useState<Airport | null>(null)
  const [dateFrom,    setDateFrom]    = useState(params.get('date') ?? '')
  const [dateTo,      setDateTo]      = useState(params.get('returnDate') ?? '')
  const [passengers,  setPassengers]  = useState(params.get('passengers') ?? '1')

  // Resultados — modo simples/ida+volta
  const [outbound,    setOutbound]    = useState<FlightOffer[]>([])
  const [returning,   setReturning]   = useState<FlightOffer[]>([])
  const [isRoundTrip, setIsRoundTrip] = useState(false)

  // Resultados — modo múltiplos destinos
  const [legResults, setLegResults] = useState<LegResult[]>([])

  const [status,     setStatus]     = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg,   setErrorMsg]   = useState('')
  const [sortBy,     setSortBy]     = useState<SortKey>('price')
  const [onlyDirect, setOnlyDirect] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null)

  const AIRPORTS_MAP: Record<string, Airport> = {
    GRU: { iata: 'GRU', city: 'São Paulo',      name: 'Guarulhos',           country: 'Brasil' },
    CGH: { iata: 'CGH', city: 'São Paulo',      name: 'Congonhas',           country: 'Brasil' },
    GIG: { iata: 'GIG', city: 'Rio de Janeiro', name: 'Galeão',              country: 'Brasil' },
    BSB: { iata: 'BSB', city: 'Brasília',       name: 'JK',                  country: 'Brasil' },
    SSA: { iata: 'SSA', city: 'Salvador',       name: 'L.E. Magalhães',      country: 'Brasil' },
    REC: { iata: 'REC', city: 'Recife',         name: 'Guararapes',          country: 'Brasil' },
    FOR: { iata: 'FOR', city: 'Fortaleza',      name: 'Pinto Martins',       country: 'Brasil' },
    POA: { iata: 'POA', city: 'Porto Alegre',   name: 'Salgado Filho',       country: 'Brasil' },
    CWB: { iata: 'CWB', city: 'Curitiba',       name: 'Afonso Pena',         country: 'Brasil' },
    CNF: { iata: 'CNF', city: 'Belo Horizonte', name: 'Confins',             country: 'Brasil' },
    LIS: { iata: 'LIS', city: 'Lisboa',         name: 'Humberto Delgado',    country: 'Portugal' },
    OPO: { iata: 'OPO', city: 'Porto',          name: 'Sá Carneiro',         country: 'Portugal' },
    CDG: { iata: 'CDG', city: 'Paris',          name: 'Charles de Gaulle',   country: 'França' },
    LHR: { iata: 'LHR', city: 'Londres',        name: 'Heathrow',            country: 'Reino Unido' },
    MAD: { iata: 'MAD', city: 'Madrid',         name: 'Barajas',             country: 'Espanha' },
    BCN: { iata: 'BCN', city: 'Barcelona',      name: 'El Prat',             country: 'Espanha' },
    FCO: { iata: 'FCO', city: 'Roma',           name: 'Fiumicino',           country: 'Itália' },
    FRA: { iata: 'FRA', city: 'Frankfurt',      name: 'Frankfurt',           country: 'Alemanha' },
    AMS: { iata: 'AMS', city: 'Amsterdã',       name: 'Schiphol',            country: 'Países Baixos' },
    IST: { iata: 'IST', city: 'Istambul',       name: 'Istanbul',            country: 'Turquia' },
    TBS: { iata: 'TBS', city: 'Tbilisi',        name: 'Shota Rustaveli',     country: 'Geórgia' },
    MIA: { iata: 'MIA', city: 'Miami',          name: 'Miami International', country: 'EUA' },
    JFK: { iata: 'JFK', city: 'Nova York',      name: 'JFK',                 country: 'EUA' },
    LAX: { iata: 'LAX', city: 'Los Angeles',    name: 'LAX',                 country: 'EUA' },
    EZE: { iata: 'EZE', city: 'Buenos Aires',   name: 'Ezeiza',              country: 'Argentina' },
    SCL: { iata: 'SCL', city: 'Santiago',       name: 'Arturo Merino',       country: 'Chile' },
    NRT: { iata: 'NRT', city: 'Tóquio',         name: 'Narita',              country: 'Japão' },
    DXB: { iata: 'DXB', city: 'Dubai',          name: 'Dubai International', country: 'Emirados' },
  }

  // Pré-popula aeroportos da URL
  useEffect(() => {
    const o = params.get('origin')
    const d = params.get('destination')
    if (o && AIRPORTS_MAP[o]) setOrigin(AIRPORTS_MAP[o])
    if (d && AIRPORTS_MAP[d]) setDestination(AIRPORTS_MAP[d])
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  // Busca automática ao carregar (modo clássico)
  useEffect(() => {
    if (searchMode !== 'classic') return
    if (isMultiDestination) {
      searchMultiLegs(parsedLegs)
    } else if (params.get('origin') && params.get('destination') && params.get('date')) {
      search(
        params.get('origin')!,
        params.get('destination')!,
        params.get('date')!,
        params.get('returnDate') ?? undefined,
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Busca simples / ida+volta ─────────────────────────
  async function search(orig: string, dest: string, date: string, retDate?: string) {
    setStatus('loading')
    setErrorMsg('')
    setOutbound([])
    setReturning([])

    try {
      const qs = new URLSearchParams({
        origin: orig, destination: dest, date, passengers,
        ...(retDate && { returnDate: retDate }),
      })
      const res  = await fetch(`/api/flights?${qs}`)
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Erro ao buscar voos.')
        setStatus('error')
        return
      }

      setOutbound(data.outbound   ?? [])
      setReturning(data.returning ?? [])
      setIsRoundTrip(data.isRoundTrip ?? false)
      setStatus('done')
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet.')
      setStatus('error')
    }
  }

  // ── Busca múltiplos trechos em paralelo ──────────────
  async function searchMultiLegs(legs: LegParam[]) {
    setStatus('loading')
    setErrorMsg('')
    setLegResults([])

    try {
      const promises = legs.map((leg, idx) => {
        const qs = new URLSearchParams({ origin: leg.o, destination: leg.d, date: leg.date, passengers })
        return fetch(`/api/flights?${qs}`)
          .then(r => r.json())
          .then(data => ({ leg, flights: data.outbound ?? [], legIndex: idx }))
          .catch(() => ({ leg, flights: [] as FlightOffer[], legIndex: idx }))
      })

      const results: LegResult[] = await Promise.all(promises)
      setLegResults(results)
      setStatus('done')
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet.')
      setStatus('error')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination || !dateFrom) return
    const qs = new URLSearchParams({
      origin: origin.iata, destination: destination.iata,
      date: dateFrom, passengers,
      ...(dateTo && { returnDate: dateTo }),
    })
    router.push(`/passagens?${qs}`)
    search(origin.iata, destination.iata, dateFrom, dateTo || undefined)
  }

  const totalFound = isMultiDestination
    ? legResults.reduce((sum, lr) => sum + lr.flights.length, 0)
    : outbound.length + returning.length

  const hasParams = isMultiDestination || (params.get('origin') && params.get('destination'))

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* ── Header com título + toggle de modo ──────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d0f 0%, #ff5722 60%, #2B9FEE 100%)', padding: '32px 24px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', fontSize: '1.6rem', margin: 0 }}>
              {isMultiDestination ? 'Voos — múltiplos destinos' : 'Buscar passagens'}
            </h1>

            {/* Toggle White Label / Clássico (só quando não é multi-destino) */}
            {!isMultiDestination && (
              <div style={{
                display: 'flex', gap: 4, background: 'rgba(255,255,255,0.12)',
                borderRadius: 100, padding: 3,
              }}>
                <button
                  onClick={() => setSearchMode('whitelabel')}
                  style={{
                    padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                    background: searchMode === 'whitelabel' ? '#fff' : 'transparent',
                    color: searchMode === 'whitelabel' ? '#0d0d0f' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.2s',
                  }}
                >
                  Busca completa
                </button>
                <button
                  onClick={() => setSearchMode('classic')}
                  style={{
                    padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                    background: searchMode === 'classic' ? '#fff' : 'transparent',
                    color: searchMode === 'classic' ? '#0d0d0f' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.2s',
                  }}
                >
                  Busca rápida
                </button>
              </div>
            )}
          </div>

          {/* ── Formulário clássico (só no modo classic ou multi-destino) */}
          {(searchMode === 'classic' || isMultiDestination) && (
            <>
              {isMultiDestination ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {parsedLegs.map((leg, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        background: 'rgba(255,255,255,0.15)', color: '#fff',
                        borderRadius: '50%', width: 24, height: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                        {leg.o} → {leg.d}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                        {leg.date}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => router.push('/')}
                    style={{
                      marginTop: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600,
                      color: '#fff', width: 'fit-content',
                    }}
                  >
                    ← Editar trechos
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <AirportSearch label="Origem" placeholder="Digite e selecione — ex: São Paulo" value={origin} onChange={setOrigin} dark />
                    <AirportSearch label="Destino" placeholder="Digite e selecione — ex: Lisboa" value={destination} onChange={setDestination} dark />
                    <DatePicker label="Ida" value={dateFrom} onChange={setDateFrom} dark />
                    <DatePicker label="Volta (opcional)" value={dateTo} onChange={setDateTo} min={dateFrom} placeholder="Só ida" dark />
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <div style={{ flex: '0 0 120px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
                        Passageiros
                      </label>
                      <input
                        type="number" min={1} max={9}
                        value={passengers} onChange={e => setPassengers(e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', background: 'rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!origin || !destination || !dateFrom}
                      className="btn-gold"
                      style={{ flex: 1, justifyContent: 'center', padding: '11px 24px', opacity: (!origin || !destination || !dateFrom) ? 0.5 : 1 }}
                    >
                      Buscar voos
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/* ── MODO WHITE LABEL ─────────────────────────────── */}
      {/* ════════════════════════════════════════════════════ */}
      {searchMode === 'whitelabel' && !isMultiDestination && (
        <div style={{ maxWidth: 1100, margin: '-8px auto 0', padding: '0 16px 60px' }}>
          {/* Script do Travelpayouts White Label */}
          <Script
            id="tpwl-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  var script = document.createElement("script");
                  script.async = 1;
                  script.type = "module";
                  script.src = "https://tpwdgt.com/wl_web/main.js?wl_id=16516";
                  document.head.appendChild(script);
                })();
              `,
            }}
          />

          {/* Container do formulário de busca */}
          <div id="tpwl-search" style={{ marginBottom: 24 }} />

          {/* Container dos resultados de voos */}
          <div id="tpwl-tickets" />

          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9BA8B8',
            textAlign: 'center', marginTop: 24, lineHeight: 1.6,
          }}>
            Preços em R$ (BRL) · Busca e comparação via Travelpayouts · Sem markup · Sujeito a disponibilidade
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* ── MODO CLÁSSICO (resultados da API) ────────────── */}
      {/* ════════════════════════════════════════════════════ */}
      {(searchMode === 'classic' || isMultiDestination) && (
        <div style={{ maxWidth: 900, margin: '-20px auto 0', padding: '0 24px 60px' }}>

          {/* ── Filtros ──────────────────────────────────── */}
          {status === 'done' && (
            <div style={{
              background: '#fff', borderRadius: 12, padding: '14px 20px',
              boxShadow: '0 4px 20px rgba(13,27,62,0.07)',
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              marginBottom: 20,
            }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#6d6d74' }}>
                {totalFound} voo{totalFound !== 1 ? 's' : ''} encontrado{totalFound !== 1 ? 's' : ''}
                {isRoundTrip && !isMultiDestination && ' (ida + volta)'}
                {isMultiDestination && ` em ${parsedLegs.length} trechos`}
              </span>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6d6d74', alignSelf: 'center' }}>Ordenar:</span>
                {(['price', 'stops', 'duration'] as SortKey[]).map(key => (
                  <button key={key} onClick={() => setSortBy(key)} style={{
                    padding: '5px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 500,
                    background: sortBy === key ? '#ff5722' : '#fafaf7',
                    color: sortBy === key ? '#fff' : '#6d6d74', transition: 'all 0.2s',
                  }}>
                    {key === 'price' ? 'Menor preço' : key === 'stops' ? 'Menos escalas' : 'Menor duração'}
                  </button>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6d6d74', cursor: 'pointer' }}>
                  <input type="checkbox" checked={onlyDirect} onChange={e => setOnlyDirect(e.target.checked)} style={{ accentColor: '#ff5722' }} />
                  Só direto
                </label>
              </div>
            </div>
          )}

          {/* ── Loading ──────────────────────────────────── */}
          {status === 'loading' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)' }}>
              <div style={{ width: 48, height: 48, border: '4px solid #fafaf7', borderTop: '4px solid #ff5722', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74' }}>
                {isMultiDestination
                  ? `Buscando voos para ${parsedLegs.length} trechos...`
                  : dateTo ? 'Buscando voos de ida e volta...' : 'Buscando os melhores voos...'}
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* ── Erro ─────────────────────────────────────── */}
          {status === 'error' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f', marginBottom: 10 }}>Não foi possível buscar os voos</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74', marginBottom: 20, fontSize: '0.9rem' }}>{errorMsg}</p>
              <button onClick={() => origin && destination && dateFrom && search(origin.iata, destination.iata, dateFrom, dateTo || undefined)} className="btn-primary">
                Tentar novamente
              </button>
            </div>
          )}

          {/* ── Sem resultados ───────────────────────────── */}
          {status === 'done' && totalFound === 0 && (() => {
            const orig = params.get('origin') ?? origin?.iata ?? ''
            const dest = params.get('destination') ?? destination?.iata ?? ''
            const date = params.get('date') ?? dateFrom
            const tripUrl = orig && dest
              ? `https://br.trip.com/flights/showfarefirst?dcity=${orig.toLowerCase()}&acity=${dest.toLowerCase()}${date ? `&ddate=${date}` : ''}&triptype=ow&class=y&quantity=1&locale=pt-BR&curr=BRL`
              : 'https://br.trip.com/flights'

            return (
              <div style={{ background: '#fff', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f', marginBottom: 8 }}>
                  Não encontramos voos em nossa base para essa rota
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74', fontSize: '0.9rem', marginBottom: 28, maxWidth: 460, margin: '0 auto 28px' }}>
                  Nossa base de preços é atualizada periodicamente e pode não ter dados para rotas menos frequentes.
                  Continue sua busca no Trip.com com preços em tempo real, em Português e Reais.
                </p>
                <a
                  href={tripUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #ff5722 0%, #e64e1e 100%)',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '14px 32px',
                    borderRadius: 100,
                    textDecoration: 'none',
                    marginBottom: 16,
                  }}
                >
                  Ver voos {orig} → {dest} no Trip.com
                </a>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9BA8B8', margin: '12px 0 0' }}>
                  Você será redirecionado para o Trip.com com a sua busca já preenchida
                </p>
              </div>
            )
          })()}

          {/* ── Resultados: modo simples / ida+volta ─────── */}
          {status === 'done' && !isMultiDestination && totalFound > 0 && (
            <>
              <FlightSection
                title={isRoundTrip ? `Voos de Ida — ${params.get('origin')} → ${params.get('destination')}` : `Voos disponíveis — ${params.get('origin')} → ${params.get('destination')}`}
                flights={outbound}
                sortBy={sortBy}
                onlyDirect={onlyDirect}
                onSelect={setSelectedFlight}
              />

              {isRoundTrip && returning.length > 0 && (
                <FlightSection
                  title={`Voos de Volta — ${params.get('destination')} → ${params.get('origin')}`}
                  flights={returning}
                  sortBy={sortBy}
                  onlyDirect={onlyDirect}
                  onSelect={setSelectedFlight}
                />
              )}

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6d6d74', textAlign: 'center', marginTop: 8 }}>
                Preços em R$ (BRL) · Via Travelpayouts/Trip.com · Sem markup · Sujeito a disponibilidade
              </p>
            </>
          )}

          {/* ── Resultados: múltiplos destinos ───────────── */}
          {status === 'done' && isMultiDestination && totalFound > 0 && (
            <>
              {legResults.map((lr, idx) => (
                lr.flights.length > 0 && (
                  <FlightSection
                    key={idx}
                    title={`Trecho ${lr.legIndex + 1} — ${lr.leg.o} → ${lr.leg.d}`}
                    flights={lr.flights}
                    sortBy={sortBy}
                    onlyDirect={onlyDirect}
                    onSelect={setSelectedFlight}
                  />
                )
              ))}
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6d6d74', textAlign: 'center', marginTop: 8 }}>
                Preços em R$ (BRL) · Via Travelpayouts/Trip.com · Sem markup · Sujeito a disponibilidade
              </p>
            </>
          )}

          {/* ── Estado inicial ───────────────────────────── */}
          {status === 'idle' && !hasParams && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 3L3 10.5l7.5 3L14 21l7-18z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f', marginBottom: 8 }}>Busque sua passagem</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74', fontSize: '0.9rem' }}>
                Preencha origem, destino e data acima para buscar os melhores voos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Drawer de checkout ───────────────────────── */}
      <FlightDrawer
        flight={selectedFlight}
        passengers={parseInt(passengers)}
        onClose={() => setSelectedFlight(null)}
      />
    </div>
  )
}

export default function PassagensPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74' }}>Carregando...</p>
      </div>
    }>
      <PassagensContent />
    </Suspense>
  )
}
