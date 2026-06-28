'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CitySearch from '@/components/CitySearch'
import type { PreviewData, FullItinerary, BudgetCategory, DayPlan, ChecklistSection } from '@/app/api/roteiro/route'
// ── Constantes ─────────────────────────────────────────────────────────────

const ORIGIN_CITIES = [
  { label: 'São Paulo (GRU)',      city: 'São Paulo',      iata: 'GRU' },
  { label: 'Rio de Janeiro (GIG)', city: 'Rio de Janeiro', iata: 'GIG' },
  { label: 'Brasília (BSB)',       city: 'Brasília',       iata: 'BSB' },
  { label: 'Curitiba (CWB)',      city: 'Curitiba',       iata: 'CWB' },
  { label: 'Belo Horizonte (CNF)',city: 'Belo Horizonte', iata: 'CNF' },
  { label: 'Fortaleza (FOR)',     city: 'Fortaleza',      iata: 'FOR' },
  { label: 'Porto Alegre (POA)',  city: 'Porto Alegre',   iata: 'POA' },
  { label: 'Recife (REC)',        city: 'Recife',         iata: 'REC' },
  { label: 'Salvador (SSA)',      city: 'Salvador',       iata: 'SSA' },
  { label: 'Campinas (VCP)',      city: 'Campinas',       iata: 'VCP' },
]

const BUDGET_OPTIONS = [
  { label: 'Até R$ 3.000',     value: 3000 },
  { label: 'R$ 3.000 – 6.000', value: 6000 },
  { label: 'R$ 6.000 – 10.000',value: 10000 },
  { label: 'R$ 10.000 – 20.000',value: 20000 },
  { label: 'Acima de R$ 20.000',value: 25000 },
]

const PRIORITY_OPTIONS = [
  { id: 'conforto',    label: 'Conforto' },
  { id: 'gastronomia', label: 'Gastronomia' },
  { id: 'aventura',    label: 'Aventura' },
  { id: 'economia',    label: 'Economia' },
  { id: 'cultura',     label: 'Cultura' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Voos':             '#1A82D8',
  'Hospedagem':       '#0F2340',
  'Alimentação':      '#F5A800',
  'Transporte local': '#16a34a',
  'Experiências':     '#7c3aed',
  'Reserva':          '#64748B',
}


const MOBILITY_OPTIONS = [
  { id: 'a-pe',              label: 'Adoro andar a pé',        icon: '🚶' },
  { id: 'transporte-publico', label: 'Transporte público',     icon: '🚇' },
  { id: 'carro',             label: 'Prefiro carro',           icon: '🚗' },
]

const RADIUS_OPTIONS = [
  { label: 'Só o destino',     value: 0 },
  { label: '50 km',            value: 50 },
  { label: '100 km',           value: 100 },
  { label: '200 km',           value: 200 },
  { label: '500 km',           value: 500 },
]

const EXPERIENCE_TYPES = [
  { id: 'cultura',      label: 'Cultura e historia' },
  { id: 'aventura',     label: 'Aventura e natureza' },
  { id: 'gastronomia',  label: 'Gastronomia' },
  { id: 'esportes',     label: 'Esportes e eventos' },
  { id: 'relaxar',      label: 'Relaxar e descansar' },
  { id: 'nightlife',    label: 'Vida noturna' },
]

const DURATION_OPTIONS = [
  { label: '3-5 dias',   value: '3-5' },
  { label: '6-8 dias',   value: '6-8' },
  { label: '9-14 dias',  value: '9-14' },
  { label: '15+ dias',   value: '15+' },
]

const SEASON_OPTIONS = [
  { label: 'Qualquer',    value: 'qualquer' },
  { label: 'Jan-Mar',     value: 'jan-mar' },
  { label: 'Abr-Jun',     value: 'abr-jun' },
  { label: 'Jul-Set',     value: 'jul-set' },
  { label: 'Out-Dez',     value: 'out-dez' },
]

// ── Ícones SVG ─────────────────────────────────────────────────────────────

const PlaneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 6.2c-.5-.2-1.1 0-1.4.5l-.8 1.4c-.3.5-.1 1.2.4 1.5L10 12l-2 3H5l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.5c.3.5 1 .7 1.5.4l1.4-.8c.5-.3.7-.9.4-1.4z"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A800" stroke="#F5A800" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// ── Componente: Formulário ─────────────────────────────────────────────────

function FormStep({
  onSubmit,
  initialValues,
}: {
  onSubmit: (v: { origin: string; originIATA: string; destinations: string[]; checkIn: string; checkOut: string; flexDates: boolean; budgetBRL: number; priorities: string[]; mobility: string; surprise: boolean; radius: number; suggestMode: boolean; expTypes: string[]; prefDuration: string; prefSeason: string }) => void
  initialValues?: { origin?: string; originIATA?: string; destinations?: string[]; destination?: string; checkIn?: string; checkOut?: string; flexDates?: boolean; budgetBRL?: number; priorities?: string[]; mobility?: string; surprise?: boolean; radius?: number; suggestMode?: boolean; expTypes?: string[]; prefDuration?: string; prefSeason?: string }
}) {
  const [origin,       setOrigin]       = useState(initialValues?.origin ?? '')
  const [originIATA,   setOriginIATA]   = useState(initialValues?.originIATA ?? '')
  const [destinations, setDestinations] = useState<string[]>(
    initialValues?.destinations?.length ? initialValues.destinations : [initialValues?.destination ?? '']
  )
  const [checkIn,     setCheckIn]     = useState(initialValues?.checkIn ?? '')
  const [checkOut,    setCheckOut]    = useState(initialValues?.checkOut ?? '')
  const [budgetBRL,   setBudgetBRL]   = useState(initialValues?.budgetBRL ?? 0)
  const [priorities,  setPriorities]  = useState<string[]>(initialValues?.priorities ?? [])
  const [suggestMode, setSuggestMode] = useState(false)
  const [expTypes,     setExpTypes]    = useState<string[]>([])
  const [prefDuration, setPrefDuration] = useState('')
  const [prefSeason,   setPrefSeason]   = useState('')
  const [flexDates,   setFlexDates]   = useState(initialValues?.flexDates ?? false)
  const [mobility,    setMobility]    = useState(initialValues?.mobility ?? '')
  const [surprise,    setSurprise]    = useState(initialValues?.surprise ?? false)
  const [radius,      setRadius]      = useState(initialValues?.radius ?? 0)
  const [error,       setError]       = useState('')

  function togglePriority(id: string) {
    setPriorities(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function handleOriginChange(iata: string) {
    const city = ORIGIN_CITIES.find(c => c.iata === iata)
    if (city) {
      setOrigin(city.city)
      setOriginIATA(city.iata)
    }
  }

  function updateDestination(index: number, value: string) {
    setDestinations(prev => prev.map((d, i) => i === index ? value : d))
  }

  function addDestination() {
    if (destinations.length < 5) setDestinations(prev => [...prev, ''])
  }

  function removeDestination(index: number) {
    if (destinations.length > 1) setDestinations(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!originIATA)         return setError('Selecione de onde você sai.')
    const cleanDests = suggestMode ? [] : destinations.map(d => d.trim()).filter(Boolean)
    if (!suggestMode && cleanDests.length === 0) return setError('Informe pelo menos um destino.')
    if (!flexDates) {
      if (!checkIn)            return setError('Informe a data de ida.')
      if (!checkOut)           return setError('Informe a data de volta.')
      if (checkOut <= checkIn) return setError('A volta deve ser depois da ida.')
    }
    if (!budgetBRL)          return setError('Selecione o orçamento.')
    const submitData = suggestMode
      ? { origin, originIATA, destinations: ['ME_SUGIRA'], checkIn, checkOut, flexDates: true, budgetBRL, priorities, mobility, surprise, radius, suggestMode: true, expTypes, prefDuration, prefSeason }
      : { origin, originIATA, destinations: cleanDests, checkIn, checkOut, flexDates, budgetBRL, priorities, mobility, surprise, radius, suggestMode: false, expTypes: [], prefDuration: '', prefSeason: '' }
    onSubmit(submitData)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 100%)', padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(245,168,0,0.2)', color: '#F5A800', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 20, border: '1px solid rgba(245,168,0,0.3)' }}>
            Roteiro Completo · R$ 19,90
          </span>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
            Planeje sua viagem do zero.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
            Informe o destino e orçamento. A Go Livoo monta o roteiro completo — do voo ao hotel, do ingresso ao checklist.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ maxWidth: 640, margin: '-48px auto 0', padding: '0 24px 80px' }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 8px 40px rgba(15,35,64,0.12)' }}>

          {/* Origem */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              De onde você sai?
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                <PlaneIcon />
              </span>
              <select
                value={originIATA}
                onChange={e => handleOriginChange(e.target.value)}
                style={{
                  width: '100%', padding: '14px 14px 14px 40px', fontSize: '0.95rem',
                  border: `1.5px solid ${originIATA ? '#1A82D8' : '#E2E8F0'}`, borderRadius: 12, fontFamily: 'Inter, sans-serif',
                  color: originIATA ? '#0F2340' : '#9BA8BC', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s', background: '#fff',
                  appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
                }}
              >
                <option value="" disabled>Selecione sua cidade de partida</option>
                {ORIGIN_CITIES.map(c => (
                  <option key={c.iata} value={c.iata}>{c.label}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Destinos */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {suggestMode ? 'Me sugira onde ir' : destinations.length > 1 ? 'Destinos da viagem' : 'Para onde você quer ir?'}
              </label>
              <button
                type="button"
                onClick={() => { setSuggestMode(!suggestMode); if (!suggestMode) { setDestinations(['']); setFlexDates(true); setCheckIn(''); setCheckOut('') } }}
                style={{
                  background: suggestMode ? '#FFF8EC' : 'transparent',
                  border: `1.5px solid ${suggestMode ? '#F5A800' : '#CBD5E1'}`,
                  borderRadius: 999, padding: '4px 12px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                  color: suggestMode ? '#92400e' : '#64748B', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={suggestMode ? '#F5A800' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Me sugira
              </button>
            </div>

            {suggestMode ? (
              <div style={{ background: '#FFFBF0', border: '1.5px solid #FDE68A', borderRadius: 14, padding: 20 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#92400e', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Conte o que voce quer viver e a Go Livoo sugere 3 destinos perfeitos pra voce.
                </p>

                {/* Tipo de experiencia */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                    Que tipo de experiencia?
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {EXPERIENCE_TYPES.map(et => {
                      const active = expTypes.includes(et.id)
                      return (
                        <button key={et.id} type="button" onClick={() => setExpTypes(prev => active ? prev.filter(x => x !== et.id) : [...prev, et.id])}
                          style={{
                            padding: '7px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
                            fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                            border: `1.5px solid ${active ? '#F5A800' : '#E2E8F0'}`,
                            background: active ? '#FFF8EC' : '#fff', color: active ? '#92400e' : '#0F2340',
                          }}
                        >{et.label}</button>
                      )
                    })}
                  </div>
                </div>

                {/* Duracao + Epoca */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                      Duracao
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {DURATION_OPTIONS.map(d => (
                        <button key={d.value} type="button" onClick={() => setPrefDuration(prefDuration === d.value ? '' : d.value)}
                          style={{
                            padding: '6px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                            border: `1.5px solid ${prefDuration === d.value ? '#F5A800' : '#E2E8F0'}`,
                            background: prefDuration === d.value ? '#FFF8EC' : '#fff',
                            color: prefDuration === d.value ? '#92400e' : '#0F2340',
                          }}
                        >{d.label}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                      Epoca do ano
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {SEASON_OPTIONS.map(s => (
                        <button key={s.value} type="button" onClick={() => setPrefSeason(prefSeason === s.value ? '' : s.value)}
                          style={{
                            padding: '6px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                            border: `1.5px solid ${prefSeason === s.value ? '#F5A800' : '#E2E8F0'}`,
                            background: prefSeason === s.value ? '#FFF8EC' : '#fff',
                            color: prefSeason === s.value ? '#92400e' : '#0F2340',
                          }}
                        >{s.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {destinations.map((dest, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {destinations.length > 1 && (
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#1A82D8', background: '#EBF5FF', borderRadius: 8, padding: '4px 8px', minWidth: 20, textAlign: 'center', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                  )}
                  <div style={{ flex: 1 }}>
                    <CitySearch
                      value={dest}
                      onChange={(v) => updateDestination(i, v)}
                      placeholder={i === 0 ? 'Ex: Lisboa, Paris, Tokyo...' : 'Próximo destino...'}
                      dark={false}
                      inputStyle={{
                        padding: '14px', fontSize: '0.95rem',
                        borderRadius: 12, border: '1.5px solid #E2E8F0',
                      }}
                    />
                  </div>
                  {destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(i)}
                      style={{
                        background: 'none', border: '1.5px solid #E2E8F0', borderRadius: 10,
                        width: 38, height: 38, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        color: '#94a3b8', transition: 'all 0.15s',
                      }}
                      title="Remover destino"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              ))}
            {destinations.length < 5 && (
              <button
                type="button"
                onClick={addDestination}
                style={{
                  marginTop: 10, background: 'none', border: '1.5px dashed #CBD5E1',
                  borderRadius: 12, padding: '10px 16px', width: '100%',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                  color: '#64748B', cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Adicionar destino
              </button>
            )}
            </div>
            )}
          </div>

          {/* Datas */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quando?
              </label>
              <button
                type="button"
                onClick={() => { setFlexDates(!flexDates); if (!flexDates) { setCheckIn(''); setCheckOut('') } }}
                style={{
                  background: flexDates ? '#EBF5FF' : 'transparent',
                  border: `1.5px solid ${flexDates ? '#1A82D8' : '#CBD5E1'}`,
                  borderRadius: 999, padding: '4px 12px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                  color: flexDates ? '#1A82D8' : '#64748B', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <CalendarIcon />
                Ainda não decidi
              </button>
            </div>
            {flexDates ? (
              <div style={{
                background: '#F0F9FF', border: '1.5px solid #BAE6FD', borderRadius: 12,
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#0369A1', lineHeight: 1.5 }}>
                  Sem problema! A Go Livoo vai sugerir a melhor época para o seu destino, considerando clima, eventos e preços.
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Ida', value: checkIn, onChange: setCheckIn },
                  { label: 'Volta', value: checkOut, onChange: setCheckOut },
                ].map(({ label, value, onChange }) => (
                  <div key={label}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      {label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                        <CalendarIcon />
                      </span>
                      <input
                        type="date"
                        value={value}
                        min={today}
                        onChange={e => onChange(e.target.value)}
                        style={{
                          width: '100%', padding: '13px 12px 13px 36px', fontSize: '0.9rem',
                          border: '1.5px solid #E2E8F0', borderRadius: 12, fontFamily: 'Inter, sans-serif',
                          color: '#0F2340', outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#1A82D8' }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orçamento */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              Orçamento total (por pessoa, incluindo voos)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBudgetBRL(opt.value)}
                  style={{
                    padding: '10px 8px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600,
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                    border: `1.5px solid ${budgetBRL === opt.value ? '#1A82D8' : '#E2E8F0'}`,
                    background: budgetBRL === opt.value ? '#EBF5FF' : '#fff',
                    color: budgetBRL === opt.value ? '#1A82D8' : '#0F2340',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobilidade */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              Como você se locomove? (opcional)
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MOBILITY_OPTIONS.map(opt => {
                const active = mobility === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMobility(active ? '' : opt.id)}
                    style={{
                      padding: '10px 16px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${active ? '#1A82D8' : '#E2E8F0'}`,
                      background: active ? '#EBF5FF' : '#fff',
                      color: active ? '#1A82D8' : '#0F2340',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Raio de exploração + Me surpreenda */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 24, alignItems: 'end' }}>
            <div>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
                Raio de exploração (opcional)
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {RADIUS_OPTIONS.map(opt => {
                  const active = radius === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRadius(active ? 0 : opt.value)}
                      style={{
                        padding: '8px 14px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600,
                        fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                        border: `1.5px solid ${active ? '#1A82D8' : '#E2E8F0'}`,
                        background: active ? '#EBF5FF' : '#fff',
                        color: active ? '#1A82D8' : '#0F2340',
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSurprise(!surprise)}
              title="Quando ativado, o roteiro inclui cidades menos conhecidas próximas ao destino"
              style={{
                padding: '10px 16px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 700,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                border: `1.5px solid ${surprise ? '#F5A800' : '#E2E8F0'}`,
                background: surprise ? '#FFF8EC' : '#fff',
                color: surprise ? '#92400e' : '#64748B',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={surprise ? '#F5A800' : 'none'} />
              </svg>
              Me surpreenda
            </button>
          </div>

          {/* Prioridades */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>
              Prioridades (opcional — selecione até 3)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PRIORITY_OPTIONS.map(opt => {
                const active = priorities.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePriority(opt.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 600,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${active ? '#0F2340' : '#E2E8F0'}`,
                      background: active ? '#0F2340' : '#fff',
                      color: active ? '#fff' : '#64748B',
                    }}
                  >
                    {active && <span style={{ marginRight: 6 }}>✓</span>}{opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div style={{ background: '#FFF1F0', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            style={{
              width: '100%', padding: '16px', background: '#1A82D8', color: '#fff',
              border: 'none', borderRadius: 14, fontFamily: 'Nunito, sans-serif',
              fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <PlaneIcon /> Ver preview gratuito
          </button>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', margin: '12px 0 0' }}>
            Preview gratuito · Roteiro completo por R$19,90
          </p>
        </form>

        {/* Prova de valor */}
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '⚡', title: 'Gerado em segundos', desc: 'IA que entende o contexto da sua viagem' },
            { icon: '🔗', title: 'Links reais', desc: 'Voos, hotéis e experiências com clique direto' },
            { icon: '📋', title: 'Checklist incluído', desc: 'Documentos, vacinas e o que não esquecer' },
          ].map(item => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#0F2340', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Componente: Nudge de conta pós-preview ────────────────────────────────

function AccountNudge() {
  const { isSignedIn, isLoaded } = useUser()
  if (!isLoaded || isSignedIn) return null

  return (
    <div style={{
      background: '#EFF6FF', border: '1.5px solid #BFDBFE',
      borderRadius: 14, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      marginBottom: 8,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6v2m0-8v4" stroke="#1A82D8" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#1E40AF' }}>
          Seu roteiro foi gerado. Crie uma conta para salvá-lo.
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#3B82F6' }}>
          Acesse seus roteiros a qualquer momento em <strong>Meus Roteiros</strong>.
        </p>
      </div>
      <a
        href="/cadastro"
        style={{
          background: '#1A82D8', color: '#fff',
          padding: '8px 16px', borderRadius: 8,
          fontWeight: 700, fontSize: 12.5, textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}
      >
        Criar conta grátis
      </a>
    </div>
  )
}

// ── Componente: Preview gratuito ───────────────────────────────────────────

function PreviewStep({
  preview,
  params,
  onPay,
  isPaying,
}: {
  preview: PreviewData
  params: { destinations: string[]; checkIn: string; checkOut: string; flexDates: boolean; budgetBRL: number; priorities: string[]; mobility: string; surprise: boolean; radius: number }
  onPay: () => void
  isPaying: boolean
}) {
  const hasExactDates = params.checkIn && params.checkOut && !params.flexDates
  const nights = hasExactDates
    ? Math.round((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const formatDate = (d: string) => d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 100%)', padding: '48px 24px 72px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(245,168,0,0.2)', color: '#F5A800', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 20, border: '1px solid rgba(245,168,0,0.3)' }}>
            Preview gratuito
          </span>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#fff', margin: '0 0 10px', lineHeight: 1.15 }}>
            {preview.destination}
          </h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              ...(hasExactDates
                ? [`${formatDate(params.checkIn)} → ${formatDate(params.checkOut)}`, `${nights} noite${nights !== 1 ? 's' : ''}`]
                : ['Datas flexíveis']),
              `R$ ${params.budgetBRL.toLocaleString('pt-BR')}`,
            ].map(chip => (
              <span key={chip} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', padding: '5px 12px', borderRadius: 999, fontFamily: 'Inter, sans-serif' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '-40px auto 0', padding: '0 24px' }}>

        {/* Distribuição de orçamento */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(15,35,64,0.08)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem', color: '#0F2340', margin: '0 0 20px', fontWeight: 700 }}>
            Distribuição de orçamento
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {preview.budgetBreakdown.map((cat: BudgetCategory) => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[cat.category] ?? '#64748B', flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600, color: '#0F2340' }}>{cat.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#64748B' }}>{cat.percentage}%</span>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#0F2340' }}>
                      R$ {cat.estimated.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.percentage}%`, background: CATEGORY_COLORS[cat.category] ?? '#64748B', borderRadius: 999, transition: 'width 0.6s ease' }} />
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94a3b8', margin: '5px 0 0', lineHeight: 1.4 }}>{cat.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Destaques */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(15,35,64,0.08)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem', color: '#0F2340', margin: '0 0 20px', fontWeight: 700 }}>
            3 momentos que vão marcar a viagem
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {preview.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < preview.highlights.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0F2340', color: '#F5A800', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textAlign: 'center', lineHeight: 1.2 }}>
                  {h.day.replace('Dia ', 'D')}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#0F2340', margin: '0 0 4px' }}>{h.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.83rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infos rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Documentação', value: preview.visaInfo },
            { label: 'Melhor época', value: preview.bestTime },
          ].map(item => (
            <div key={item.label} style={{ background: '#FFF8EC', border: '1px solid rgba(245,168,0,0.25)', borderRadius: 14, padding: 20 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#D48A0A', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>{item.label}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#0F2340', margin: 0, lineHeight: 1.5 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Account nudge — visible only when logged out */}
        <AccountNudge />

        {/* Paywall */}
        <div style={{ background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)', borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,168,0,0.15), transparent 70%)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ color: '#F5A800' }}><LockIcon /></span>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', color: '#fff', fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>
              Roteiro completo · R$ 19,90
            </h3>
          </div>

          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.6 }}>
            Desbloqueie o plano dia a dia completo com horários, atividades recomendadas, links diretos para reservar voo e hotel, e o checklist de documentação personalizado para {preview.destination}.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
            {[
              'Plano dia a dia completo',
              `${Math.round((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / 86400000) + 1} dias detalhados`,
              'Link direto para voos',
              'Link direto para hotéis',
              'Checklist de documentos',
              'Dicas de gastronomia local',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#F5A800', flexShrink: 0 }}><CheckIcon /></span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onPay}
            disabled={isPaying}
            style={{
              width: '100%', padding: '16px', background: '#F5A800', color: '#0F2340',
              border: 'none', borderRadius: 14, fontFamily: 'Nunito, sans-serif',
              fontWeight: 700, fontSize: '1.1rem', cursor: isPaying ? 'not-allowed' : 'pointer',
              opacity: isPaying ? 0.7 : 1, transition: 'opacity 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            {isPaying ? 'Redirecionando...' : '🔓 Desbloquear roteiro completo — R$ 19,90'}
          </button>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: '12px 0 0' }}>
            Pagamento seguro via Stripe · Acesso imediato após confirmação
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/roteiro" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'none' }}>
            ← Gerar novo roteiro
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Componente: Roteiro completo ───────────────────────────────────────────

function DayNote({ label, color, text }: { label: string; color: string; text: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.6px', textTransform: 'uppercase', color, marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>{text}</div>
    </div>
  )
}

function FullItineraryStep({ itinerary }: { itinerary: FullItinerary }) {
  const [openDay, setOpenDay] = useState(1)

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 100%)', padding: '48px 24px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.2)', color: '#34d399', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 20, border: '1px solid rgba(16,185,129,0.3)' }}>
            <CheckIcon /> Roteiro desbloqueado
          </div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
            Seu roteiro em {itinerary.destination}
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Duração', value: itinerary.duration },
              { label: 'Orçamento', value: `R$ ${itinerary.totalBudget.toLocaleString('pt-BR')}` },
            ].map(chip => (
              <div key={chip.label} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{chip.label}</div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{chip.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '-40px auto 0', padding: '0 24px' }}>

        {/* Links rápidos — voo e hotel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <a href={itinerary.flightLink} target="_blank" rel="noopener noreferrer" style={{
            background: '#1A82D8', color: '#fff', borderRadius: 14, padding: '18px 20px',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: '1.4rem' }}>✈️</span>
            <div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>Buscar voos</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', opacity: 0.8 }}>Melhores preços via Kiwi.com</div>
            </div>
          </a>
          <a href={itinerary.hotelLink} target="_blank" rel="noopener noreferrer" style={{
            background: '#0F2340', color: '#fff', borderRadius: 14, padding: '18px 20px',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: '1.4rem' }}>🏨</span>
            <div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>Buscar hotéis</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', opacity: 0.8 }}>Compare preços via Hotellook</div>
            </div>
          </a>
        </div>

        {/* Roteiro dia a dia */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(15,35,64,0.08)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem', color: '#0F2340', margin: '0 0 20px', fontWeight: 700 }}>
            Plano dia a dia
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {itinerary.dayByDay.map((day: DayPlan) => (
              <div key={day.day} style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenDay(openDay === day.day ? 0 : day.day)}
                  style={{
                    width: '100%', padding: '14px 18px', background: openDay === day.day ? '#0F2340' : '#fff',
                    border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: openDay === day.day ? '#F5A800' : '#64748B', minWidth: 32 }}>
                      DIA {day.day}
                    </span>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: openDay === day.day ? '#fff' : '#0F2340' }}>
                      {day.title}
                    </span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={openDay === day.day ? '#fff' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openDay === day.day ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openDay === day.day && (
                  <div style={{ padding: '4px 0 8px' }}>
                    {day.activities.map((act, i) => (
                      <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 18px', borderTop: i > 0 ? '1px solid #F8FAFC' : 'none' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#94a3b8', minWidth: 32, paddingTop: 2 }}>{act.time}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#0F2340', marginBottom: 3 }}>{act.title}</div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5 }}>{act.desc}</div>
                          {act.link && (
                            <a href={act.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#1A82D8', textDecoration: 'none', marginTop: 4, display: 'inline-block' }}>
                              Ver no mapa →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}

                    {(day.curiosity || day.hiddenGem || day.travelerTip || (day.restaurants && day.restaurants.length > 0)) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 18px 4px', borderTop: '1px solid #F1F5F9', marginTop: 4 }}>
                        {day.curiosity && <DayNote label="Curiosidade" color="#1A82D8" text={day.curiosity} />}
                        {day.hiddenGem && <DayNote label="Por perto" color="#16a34a" text={day.hiddenGem} />}
                        {day.travelerTip && <DayNote label="Dica de viajante" color="#F5A800" text={day.travelerTip} />}
                        {day.restaurants && day.restaurants.length > 0 && (
                          <div>
                            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#9333ea', marginBottom: 6 }}>Onde comer</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {day.restaurants.map((r, ri) => (
                                <div key={ri} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
                                  <span style={{ fontWeight: 700, color: '#0F2340' }}>{r.name}</span>{r.desc ? ` — ${r.desc}` : ''}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(15,35,64,0.08)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem', color: '#0F2340', margin: '0 0 20px', fontWeight: 700 }}>
            Checklist de preparação
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {itinerary.checklist.map((section: ChecklistSection) => (
              <div key={section.category}>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#0F2340', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {section.category}
                </h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#1A82D8', flexShrink: 0, marginTop: 2 }}><CheckIcon /></span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.83rem', color: '#374151', lineHeight: 1.4 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Avaliação + novo roteiro */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, background: '#FFF8EC', border: '1px solid rgba(245,168,0,0.3)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(i => <StarIcon key={i} />)}</div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
              Como foi o roteiro? Nos conte no Instagram @livoo_travel
            </span>
          </div>
          <Link href="/roteiro" style={{
            background: '#0F2340', color: '#fff', borderRadius: 14, padding: '20px 24px',
            textDecoration: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
          }}>
            + Novo roteiro
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────

type PageState = 'form' | 'loading-preview' | 'preview' | 'loading-full' | 'full' | 'error'

function RoteiroContent() {
  const params = useSearchParams()
  const router = useRouter()

  // Detectar retorno do Stripe
  const paid         = params.get('paid') === 'true'
  const origin       = params.get('origin') ?? ''
  const originIATA   = params.get('originIATA') ?? 'GRU'
  const destination  = params.get('destination') ?? ''
  const checkIn      = params.get('checkIn') ?? ''
  const checkOut     = params.get('checkOut') ?? ''
  const budgetBRL    = Number(params.get('budgetBRL') ?? 0)
  const priorities   = params.get('priorities') ? params.get('priorities')!.split(',').filter(Boolean) : []

  const [pageState,    setPageState]    = useState<PageState>('form')
  const [preview,      setPreview]      = useState<PreviewData | null>(null)
  const [itinerary,    setItinerary]    = useState<FullItinerary | null>(null)
  const [errorMsg,     setErrorMsg]     = useState('')
  const [isPaying,     setIsPaying]     = useState(false)
  const destinations   = destination ? destination.split(' → ').filter(Boolean) : []
  const [formValues,   setFormValues]   = useState({ origin, originIATA, destinations, checkIn, checkOut, flexDates: false, budgetBRL, priorities, mobility: '', surprise: false, radius: 0, suggestMode: false, expTypes: [] as string[], prefDuration: '', prefSeason: '' })

  // Se veio do Stripe com ?paid=true, gerar roteiro completo automaticamente
  useEffect(() => {
    if (paid && destination && checkIn && checkOut && budgetBRL) {
      const dests = destination.split(' → ').filter(Boolean)
      setFormValues({ origin, originIATA, destinations: dests, checkIn, checkOut, flexDates: false, budgetBRL, priorities, mobility: '', surprise: false, radius: 0, suggestMode: false, expTypes: [], prefDuration: '', prefSeason: '' })
      setPageState('loading-full')
      fetch('/api/roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, originIATA, destination, checkIn, checkOut, budgetBRL, priorities, mode: 'full' }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.itinerary) {
            setItinerary(data.itinerary)
            setPageState('full')
          } else {
            setErrorMsg(data.error ?? 'Erro ao gerar roteiro.')
            setPageState('error')
          }
        })
        .catch(() => { setErrorMsg('Erro de conexão.'); setPageState('error') })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFormSubmit(values: typeof formValues) {
    setFormValues(values)
    setPageState('loading-preview')
    const destinationStr = values.suggestMode ? 'ME_SUGIRA' : values.destinations.join(' \u2192 ')
    try {
      const res = await fetch('/api/roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, destination: destinationStr, mode: 'preview', flexDates: values.flexDates, mobility: values.mobility, surprise: values.surprise, radius: values.radius, suggestMode: values.suggestMode, expTypes: values.expTypes, prefDuration: values.prefDuration, prefSeason: values.prefSeason }),
      })
      const data = await res.json()
      if (data.success && data.preview) {
        setPreview(data.preview)
        setPageState('preview')
      } else {
        setErrorMsg(data.error ?? 'Não foi possível gerar o preview.')
        setPageState('error')
      }
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.')
      setPageState('error')
    }
  }

  async function handlePay() {
    setIsPaying(true)
    const destinationStr = formValues.destinations.join(' → ')
    try {
      const res = await fetch('/api/roteiro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, destination: destinationStr, previewData: preview, flexDates: formValues.flexDates, mobility: formValues.mobility, surprise: formValues.surprise, radius: formValues.radius }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setErrorMsg(data.error ?? 'Erro ao processar pagamento.')
        setIsPaying(false)
      }
    } catch {
      setErrorMsg('Erro de conexão com o pagamento.')
      setIsPaying(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (pageState === 'loading-preview' || pageState === 'loading-full') {
    const msg = pageState === 'loading-preview'
      ? 'Analisando seu destino e montando o preview...'
      : 'Gerando seu roteiro completo dia a dia...'
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: '#fafaf7' }}>
        <div style={{ width: 56, height: 56, border: '4px solid #E2E8F0', borderTop: '4px solid #1A82D8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: '0.95rem', maxWidth: 300, textAlign: 'center', lineHeight: 1.6 }}>{msg}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Erro ─────────────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 24, background: '#fafaf7' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F5A800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', color: '#0F2340' }}>Algo deu errado</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', maxWidth: 320 }}>{errorMsg}</p>
        <button onClick={() => { setPageState('form'); setErrorMsg('') }} className="btn-primary">
          Tentar novamente
        </button>
      </div>
    )
  }

  // ── States ────────────────────────────────────────────────────────────────
  if (pageState === 'full' && itinerary)   return <FullItineraryStep itinerary={itinerary} />
  if (pageState === 'preview' && preview)  return <PreviewStep preview={preview} params={formValues} onPay={handlePay} isPaying={isPaying} />
  return <FormStep onSubmit={handleFormSubmit} initialValues={formValues} />
}

export default function RoteiroPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}>Carregando...</p>
      </div>
    }>
      <RoteiroContent />
    </Suspense>
  )
}
