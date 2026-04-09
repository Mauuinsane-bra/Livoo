'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AirportSearch, { type Airport } from './AirportSearch'
import DatePicker from './DatePicker'
import CitySearch from './CitySearch'

type Tab = 'roteiro' | 'passagens' | 'hoteis' | 'carros' | 'onibus' | 'guias'
type TripType = 'oneway' | 'roundtrip' | 'multidestination'

const tabs: { id: Tab; label: string }[] = [
  { id: 'roteiro',   label: 'Roteiro Completo' },
  { id: 'passagens', label: 'Passagens' },
  { id: 'hoteis',    label: 'Hotéis' },
  { id: 'carros',    label: 'Carros' },
  { id: 'onibus',    label: 'Ônibus' },
  { id: 'guias',     label: 'Guias' },
]

const experienceChips = [
  'Esportes', 'Shows & Festivais', 'Gastronomia', 'Aventura',
  'Automobilismo', 'Cultura', 'Ecoturismo', 'Artes',
]

type Includes = { voo: boolean; hotel: boolean; guia: boolean; transfer: boolean; ingressos: boolean; seguro: boolean }

interface FlightLeg {
  id: number
  origin: Airport | null
  destination: Airport | null
  date: string
}

export default function SearchWidget() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('roteiro')

  // Roteiro
  const [roteiroText, setRoteiroText]     = useState('')
  const [roteiroOrigin, setRoteiroOrigin] = useState<Airport | null>(null)
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [includes, setIncludes] = useState<Includes>({
    voo: true, hotel: true, guia: false, transfer: false, ingressos: false, seguro: false,
  })
  const [duration, setDuration]   = useState('')
  const [budget, setBudget]       = useState('')
  const [people, setPeople]       = useState('1')

  // Passagens — tipo de viagem
  const [tripType, setTripType] = useState<TripType>('roundtrip')

  // Passagens — ida simples / ida+volta
  const [flightOrigin, setFlightOrigin]   = useState<Airport | null>(null)
  const [flightDest, setFlightDest]       = useState<Airport | null>(null)
  const [dateFrom, setDateFrom]           = useState('')
  const [dateTo, setDateTo]               = useState('')
  const [passengers, setPassengers]       = useState('1')

  // Passagens — múltiplos destinos
  const [legs, setLegs] = useState<FlightLeg[]>([
    { id: 1, origin: null, destination: null, date: '' },
    { id: 2, origin: null, destination: null, date: '' },
  ])
  let nextLegId = legs.length + 1

  function addLeg() {
    const lastLeg = legs[legs.length - 1]
    setLegs(prev => [...prev, {
      id: nextLegId++,
      origin: lastLeg.destination ?? null,  // pre-fill origin from previous destination
      destination: null,
      date: '',
    }])
  }

  function removeLeg(id: number) {
    setLegs(prev => prev.filter(l => l.id !== id))
  }

  function updateLeg(id: number, field: keyof FlightLeg, value: Airport | null | string) {
    setLegs(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  // Hotéis
  const [hotelCity, setHotelCity]         = useState('')
  const [hotelCheckin, setHotelCheckin]   = useState('')
  const [hotelCheckout, setHotelCheckout] = useState('')
  const [hotelGuests, setHotelGuests]     = useState('2')

  // Carros
  const [carsLocation, setCarsLocation] = useState('')
  const [carsPickup,   setCarsPickup]   = useState('')
  const [carsDropoff,  setCarsDropoff]  = useState('')

  // Ônibus
  const [busFrom,       setBusFrom]       = useState('')
  const [busTo,         setBusTo]         = useState('')
  const [busDate,       setBusDate]       = useState('')
  const [busPassengers, setBusPassengers] = useState('1')

  // Guias
  const [guiasDestination, setGuiasDestination] = useState('')

  function toggleChip(chip: string) {
    setSelectedChips(p => p.includes(chip) ? p.filter(c => c !== chip) : [...p, chip])
  }

  function handleRoteiroSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!roteiroText.trim()) return
    const params = new URLSearchParams({
      q:        roteiroText,
      chips:    selectedChips.join(','),
      includes: Object.entries(includes).filter(([, v]) => v).map(([k]) => k).join(','),
      ...(roteiroOrigin && { origin: roteiroOrigin.iata }),
      ...(duration       && { duration }),
      ...(budget         && { budget }),
      ...(people         && { people }),
    })
    router.push(`/roteiro?${params}`)
  }

  function handleFlightSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (tripType === 'multidestination') {
      const validLegs = legs.filter(l => l.origin && l.destination && l.date)
      if (validLegs.length < 2) return
      const encoded = encodeURIComponent(JSON.stringify(
        validLegs.map(l => ({ o: l.origin!.iata, d: l.destination!.iata, date: l.date }))
      ))
      router.push(`/passagens?legs=${encoded}&passengers=${passengers}`)
      return
    }

    if (!flightOrigin || !flightDest || !dateFrom) return
    const params = new URLSearchParams({
      origin:      flightOrigin.iata,
      destination: flightDest.iata,
      date:        dateFrom,
      ...(tripType === 'roundtrip' && dateTo ? { returnDate: dateTo } : {}),
      passengers,
    })
    router.push(`/passagens?${params}`)
  }

  function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hotelCity || !hotelCheckin) return
    const params = new URLSearchParams({ city: hotelCity, checkin: hotelCheckin, checkout: hotelCheckout, guests: hotelGuests })
    router.push(`/hoteis?${params}`)
  }

  function handleCarrosSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!carsLocation) return
    const params = new URLSearchParams({ location: carsLocation })
    if (carsPickup)  params.set('pickup',  carsPickup)
    if (carsDropoff) params.set('dropoff', carsDropoff)
    router.push(`/carros?${params}`)
  }

  function handleOnibusSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!busFrom || !busTo || !busDate) return
    const params = new URLSearchParams({ from: busFrom, to: busTo, date: busDate, passengers: busPassengers })
    router.push(`/onibus?${params}`)
  }

  function handleGuiasSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!guiasDestination) return
    const params = new URLSearchParams({ destination: guiasDestination })
    router.push(`/guias?${params}`)
  }

  // ── Estilos compartilhados ──────────────────────────
  const tabStyle = (id: Tab) => ({
    flex: id === 'roteiro' ? '0 0 auto' : '1',
    padding: '13px 14px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.82rem',
    fontWeight: activeTab === id ? 700 : 500,
    color: activeTab === id ? (id === 'roteiro' ? '#1A56DB' : '#0D1B3E') : '#5A6A80',
    background: activeTab === id ? (id === 'roteiro' ? '#EEF4FF' : '#F4F7FF') : 'transparent',
    border: 'none',
    borderBottom: activeTab === id ? `2px solid ${id === 'roteiro' ? '#1A56DB' : '#1A56DB'}` : '2px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s',
  })

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(13,27,62,0.18)', overflow: 'hidden' }}>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #D0DCF0', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24 }}>

        {/* ══ ROTEIRO COMPLETO ══ */}
        {activeTab === 'roteiro' && (
          <form onSubmit={handleRoteiroSubmit}>

            <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#5A6A80', marginBottom: 8 }}>
              O que você quer viver?
            </label>
            <textarea
              value={roteiroText}
              onChange={e => setRoteiroText(e.target.value)}
              placeholder='Ex: "Quero assistir ao campeonato de rally cross na Geórgia em outubro. Preciso de voo, hotel e guia local..."'
              rows={3}
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #D0DCF0', borderRadius: 10,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem',
                color: '#0D1B3E', resize: 'vertical', outline: 'none', marginBottom: 16,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#1A56DB')}
              onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
            />

            {/* Chips de experiência */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {experienceChips.map(chip => (
                <button key={chip} type="button" onClick={() => toggleChip(chip)} style={{
                  padding: '5px 12px', borderRadius: 50, cursor: 'pointer', transition: 'all 0.2s',
                  border: `1.5px solid ${selectedChips.includes(chip) ? '#1A56DB' : '#D0DCF0'}`,
                  background: selectedChips.includes(chip) ? '#EEF4FF' : '#fff',
                  color: selectedChips.includes(chip) ? '#1A56DB' : '#5A6A80',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500,
                }}>
                  {chip}
                </button>
              ))}
            </div>

            {/* Campos de apoio — 2 colunas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <AirportSearch
                  label="De onde você sai?"
                  placeholder="Cidade ou aeroporto de origem"
                  value={roteiroOrigin}
                  onChange={setRoteiroOrigin}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Duração (dias)
                </label>
                <input
                  type="number" min={1} max={60} placeholder="Ex: 7"
                  value={duration} onChange={e => setDuration(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Orçamento total (R$)
                </label>
                <input
                  type="text" placeholder="Ex: R$ 15.000"
                  value={budget} onChange={e => setBudget(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Pessoas
                </label>
                <input
                  type="number" min={1} max={20}
                  value={people} onChange={e => setPeople(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
            </div>

            {/* Checkboxes de inclusão */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#5A6A80' }}>
                Incluir:
              </span>
              {(Object.keys(includes) as Array<keyof Includes>).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#0D1B3E', fontWeight: 500 }}>
                  <input
                    type="checkbox" checked={includes[key]}
                    onChange={() => setIncludes(p => ({ ...p, [key]: !p[key] }))}
                    style={{ accentColor: '#1A56DB', width: 15, height: 15 }}
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}>
              Montar meu roteiro completo →
            </button>
          </form>
        )}

        {/* ══ PASSAGENS ══ */}
        {activeTab === 'passagens' && (
          <form onSubmit={handleFlightSubmit}>

            {/* Seletor tipo de viagem */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {([
                { id: 'oneway',           label: 'Só ida' },
                { id: 'roundtrip',        label: 'Ida e volta' },
                { id: 'multidestination', label: 'Múltiplos destinos' },
              ] as { id: TripType; label: string }[]).map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTripType(opt.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 50,
                    border: `1.5px solid ${tripType === opt.id ? '#1A56DB' : '#D0DCF0'}`,
                    background: tripType === opt.id ? '#EEF4FF' : '#fff',
                    color: tripType === opt.id ? '#1A56DB' : '#5A6A80',
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

            {/* ── Ida simples / Ida e volta ── */}
            {(tripType === 'oneway' || tripType === 'roundtrip') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <AirportSearch label="Origem" placeholder="De onde você sai?" value={flightOrigin} onChange={setFlightOrigin} />
                <AirportSearch label="Destino" placeholder="Para onde vai?" value={flightDest} onChange={setFlightDest} />
                <DatePicker label="Data de ida" value={dateFrom} onChange={setDateFrom} />
                {tripType === 'roundtrip'
                  ? <DatePicker label="Data de volta" value={dateTo} onChange={setDateTo} min={dateFrom || undefined} placeholder="Selecione" />
                  : <div />
                }
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Passageiros
                  </label>
                  <input
                    type="number" min={1} max={9}
                    value={passengers} onChange={e => setPassengers(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                    onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                  />
                </div>
              </div>
            )}

            {/* ── Múltiplos destinos ── */}
            {tripType === 'multidestination' && (
              <div style={{ marginBottom: 16 }}>
                {legs.map((leg, idx) => (
                  <div key={leg.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr auto',
                    gap: 10, marginBottom: 12, alignItems: 'end',
                  }}>
                    {/* Número do trecho */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{
                        background: '#0D1B3E', color: '#fff', borderRadius: '50%',
                        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80' }}>
                        Trecho {idx + 1}
                      </span>
                      {legs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeLeg(leg.id)}
                          style={{
                            marginLeft: 'auto', background: 'none', border: 'none',
                            color: '#D48A0A', cursor: 'pointer',
                            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                          }}
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    <AirportSearch
                      label="Origem"
                      placeholder="De onde?"
                      value={leg.origin}
                      onChange={val => updateLeg(leg.id, 'origin', val)}
                    />
                    <AirportSearch
                      label="Destino"
                      placeholder="Para onde?"
                      value={leg.destination}
                      onChange={val => {
                        updateLeg(leg.id, 'destination', val)
                        // Pre-fill next leg origin automatically
                        if (idx + 1 < legs.length) {
                          updateLeg(legs[idx + 1].id, 'origin', val)
                        }
                      }}
                    />
                    <DatePicker
                      label="Data"
                      value={leg.date}
                      onChange={val => updateLeg(leg.id, 'date', val)}
                      min={idx > 0 ? legs[idx - 1].date || undefined : undefined}
                    />
                  </div>
                ))}

                {legs.length < 6 && (
                  <button
                    type="button"
                    onClick={addLeg}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: '1.5px dashed #D0DCF0',
                      borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem',
                      fontWeight: 600, color: '#1A56DB', width: '100%',
                      justifyContent: 'center', marginTop: 4, transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#1A56DB')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#D0DCF0')}
                  >
                    + Adicionar trecho
                  </button>
                )}

                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Passageiros
                  </label>
                  <input
                    type="number" min={1} max={9}
                    value={passengers} onChange={e => setPassengers(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                    onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                tripType === 'multidestination'
                  ? legs.filter(l => l.origin && l.destination && l.date).length < 2
                  : !flightOrigin || !flightDest || !dateFrom
              }
              className="btn-primary"
              style={{
                width: '100%', justifyContent: 'center', padding: 14,
                opacity: (
                  tripType === 'multidestination'
                    ? legs.filter(l => l.origin && l.destination && l.date).length < 2
                    : !flightOrigin || !flightDest || !dateFrom
                ) ? 0.5 : 1,
              }}
            >
              {tripType === 'multidestination' ? 'Buscar voos por trecho' : 'Buscar passagens'}
            </button>
          </form>
        )}

        {/* ══ HOTÉIS ══ */}
        {activeTab === 'hoteis' && (
          <form onSubmit={handleHotelSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Destino
                </label>
                <input
                  type="text" placeholder="Cidade, hotel ou região"
                  value={hotelCity} onChange={e => setHotelCity(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
              <DatePicker label="Check-in" value={hotelCheckin} onChange={setHotelCheckin} />
              <DatePicker label="Check-out" value={hotelCheckout} onChange={setHotelCheckout} min={hotelCheckin || undefined} />
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Hóspedes
                </label>
                <input
                  type="number" min={1} max={10}
                  value={hotelGuests} onChange={e => setHotelGuests(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!hotelCity || !hotelCheckin}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: (!hotelCity || !hotelCheckin) ? 0.5 : 1 }}
            >
              Buscar hotéis
            </button>
          </form>
        )}

        {/* ══ CARROS ══ */}
        {activeTab === 'carros' && (
          <form onSubmit={handleCarrosSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Cidade de retirada
                </label>
                <CitySearch
                  value={carsLocation}
                  onChange={setCarsLocation}
                  placeholder="Ex: São Paulo, Rio de Janeiro"
                  required
                />
              </div>
              <DatePicker label="Data de retirada" value={carsPickup} onChange={setCarsPickup} />
              <DatePicker label="Data de devolução" value={carsDropoff} onChange={setCarsDropoff} min={carsPickup || undefined} />
            </div>
            <button
              type="submit"
              disabled={!carsLocation}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: !carsLocation ? 0.5 : 1 }}
            >
              Buscar carros →
            </button>
          </form>
        )}

        {/* ══ ÔNIBUS ══ */}
        {activeTab === 'onibus' && (
          <form onSubmit={handleOnibusSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Origem
                </label>
                <CitySearch value={busFrom} onChange={setBusFrom} placeholder="Ex: São Paulo" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Destino
                </label>
                <CitySearch value={busTo} onChange={setBusTo} placeholder="Ex: Rio de Janeiro" required />
              </div>
              <DatePicker label="Data de ida" value={busDate} onChange={setBusDate} />
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Passageiros
                </label>
                <input
                  type="number" min={1} max={10}
                  value={busPassengers} onChange={e => setBusPassengers(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D0DCF0', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#1A56DB')}
                  onBlur={e => (e.target.style.borderColor = '#D0DCF0')}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!busFrom || !busTo || !busDate}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: (!busFrom || !busTo || !busDate) ? 0.5 : 1 }}
            >
              Buscar passagens de ônibus →
            </button>
          </form>
        )}

        {/* ══ GUIAS ══ */}
        {activeTab === 'guias' && (
          <form onSubmit={handleGuiasSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#5A6A80', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Destino
              </label>
              <CitySearch
                value={guiasDestination}
                onChange={setGuiasDestination}
                placeholder="Onde você vai? Ex: Rio de Janeiro, Barcelona..."
                required
              />
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#8A9AB5', marginBottom: 16 }}>
              Encontramos guias locais, passeios e experiências via GetYourGuide — mais de 300 mil atividades no mundo.
            </p>
            <button
              type="submit"
              disabled={!guiasDestination}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: !guiasDestination ? 0.5 : 1 }}
            >
              Ver guias e experiências →
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
