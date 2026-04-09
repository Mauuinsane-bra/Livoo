'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { EntryRequirements } from '@/lib/sherpa'

// ── Dados de países com código ISO ────────────────────────

const COUNTRIES = [
  { code: 'AF', name: 'Afeganistão', flag: '🇦🇫' },
  { code: 'ZA', name: 'África do Sul', flag: '🇿🇦' },
  { code: 'AL', name: 'Albânia', flag: '🇦🇱' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
  { code: 'AT', name: 'Áustria', flag: '🇦🇹' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'BO', name: 'Bolívia', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colômbia', flag: '🇨🇴' },
  { code: 'KR', name: 'Coreia do Sul', flag: '🇰🇷' },
  { code: 'HR', name: 'Croácia', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'EC', name: 'Equador', flag: '🇪🇨' },
  { code: 'AE', name: 'Emirados Árabes', flag: '🇦🇪' },
  { code: 'SK', name: 'Eslováquia', flag: '🇸🇰' },
  { code: 'SI', name: 'Eslovênia', flag: '🇸🇮' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'FI', name: 'Finlândia', flag: '🇫🇮' },
  { code: 'FR', name: 'França', flag: '🇫🇷' },
  { code: 'GE', name: 'Geórgia', flag: '🇬🇪' },
  { code: 'GR', name: 'Grécia', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungria', flag: '🇭🇺' },
  { code: 'IN', name: 'Índia', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonésia', flag: '🇮🇩' },
  { code: 'GB', name: 'Inglaterra / UK', flag: '🇬🇧' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵' },
  { code: 'MA', name: 'Marrocos', flag: '🇲🇦' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'MC', name: 'Mônaco', flag: '🇲🇨' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'NZ', name: 'Nova Zelândia', flag: '🇳🇿' },
  { code: 'NL', name: 'Países Baixos', flag: '🇳🇱' },
  { code: 'PY', name: 'Paraguai', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PL', name: 'Polônia', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CZ', name: 'República Tcheca', flag: '🇨🇿' },
  { code: 'RO', name: 'Romênia', flag: '🇷🇴' },
  { code: 'RU', name: 'Rússia', flag: '🇷🇺' },
  { code: 'CH', name: 'Suíça', flag: '🇨🇭' },
  { code: 'SE', name: 'Suécia', flag: '🇸🇪' },
  { code: 'TH', name: 'Tailândia', flag: '🇹🇭' },
  { code: 'TN', name: 'Tunísia', flag: '🇹🇳' },
  { code: 'TR', name: 'Turquia', flag: '🇹🇷' },
  { code: 'UA', name: 'Ucrânia', flag: '🇺🇦' },
  { code: 'UY', name: 'Uruguai', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnã', flag: '🇻🇳' },
]

function getCountry(code: string) {
  return COUNTRIES.find(c => c.code === code)
}

// ── Helpers de UI ──────────────────────────────────────────

const VISA_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  not_required: { label: 'Visto não necessário', color: '#16a34a', bg: '#dcfce7' },
  on_arrival:   { label: 'Visto na chegada',     color: '#ca8a04', bg: '#fef9c3' },
  e_visa:       { label: 'E-Visa (online)',       color: '#2563eb', bg: '#dbeafe' },
  embassy:      { label: 'Visto na embaixada',    color: '#dc2626', bg: '#fee2e2' },
  unknown:      { label: 'Verificar com consulado', color: '#5A6A80', bg: '#F4F7FF' },
}

// ── Componente principal ───────────────────────────────────

function PrepContent() {
  const searchParams = useSearchParams()

  const [destination, setDestination]   = useState(searchParams.get('destination') ?? '')
  const [nationality, setNationality]   = useState(searchParams.get('nationality') ?? 'BR')
  const [result, setResult]             = useState<EntryRequirements | null>(null)
  const [status, setStatus]             = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [isDemoMode, setIsDemoMode]     = useState(false)
  const [isPaid, setIsPaid]             = useState(searchParams.get('paid') === 'true')
  const [checkoutLoading, setCheckout]  = useState(false)
  const [checkoutError, setCheckoutErr] = useState('')

  // Se veio da URL com destination + paid, busca automaticamente
  useEffect(() => {
    const dest = searchParams.get('destination')
    const nat  = searchParams.get('nationality') ?? 'BR'
    const paid = searchParams.get('paid') === 'true'

    if (dest) {
      setDestination(dest)
      setNationality(nat)
      setIsPaid(paid)
      handleCheck(dest, nat)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCheck(dest?: string, nat?: string) {
    const d = dest ?? destination
    const n = nat  ?? nationality
    if (!d) return

    setStatus('loading')
    setResult(null)

    try {
      const res  = await fetch(`/api/prep?destination=${d}&nationality=${n}&destinationName=${getCountry(d)?.name ?? d}`)
      const data = await res.json()

      if (!res.ok || data.error) throw new Error(data.error ?? 'Erro desconhecido')

      setResult(data.requirements)
      setIsDemoMode(data.requirements.isDemoMode ?? false)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  async function handleCheckout() {
    setCheckout(true)
    setCheckoutErr('')

    try {
      const res  = await fetch('/api/prep/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ destination, nationality }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setCheckoutErr(data.error ?? 'Erro ao redirecionar para pagamento.')
        setCheckout(false)
      }
    } catch {
      setCheckoutErr('Erro de conexão. Tente novamente.')
      setCheckout(false)
    }
  }

  const destCountry = getCountry(destination)
  const natCountry  = getCountry(nationality)

  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)',
        padding: '64px 0 48px',
        textAlign: 'center',
      }}>
        <div className="container">
          <span style={{
            display: 'inline-block',
            background: 'rgba(245,166,35,0.15)',
            color: '#F5A623',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: 50,
            marginBottom: 20,
            border: '1px solid rgba(245,166,35,0.3)',
          }}>
            Livoo Prep
          </span>
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            color: '#fff',
            margin: '0 0 14px',
          }}>
            Documentação para sua viagem
          </h1>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Visto, passaporte, vacinas e restrições de entrada — tudo em um lugar, atualizado em tempo real.
          </p>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.3rem',
              color: '#0D1B3E',
              margin: '0 0 24px',
            }}>
              Verificar documentação
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* Nacionalidade */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#5A6A80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 8,
                }}>
                  Sua nacionalidade
                </label>
                <select
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.92rem',
                    background: '#fff',
                    border: '1.5px solid #D0DCF0',
                    borderRadius: 10,
                    color: '#0D1B3E',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destino */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#5A6A80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 8,
                }}>
                  País de destino
                </label>
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.92rem',
                    background: '#fff',
                    border: '1.5px solid #D0DCF0',
                    borderRadius: 10,
                    color: destination ? '#0D1B3E' : '#8A9AB5',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Selecione o destino</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleCheck()}
              disabled={!destination || status === 'loading'}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {status === 'loading' ? 'Verificando...' : 'Verificar documentação gratuita'}
            </button>
          </div>
        </div>
      </section>

      {/* ── RESULTADO ── */}
      {status === 'done' && result && (
        <section style={{ padding: '0 0 64px' }}>
          <div className="container" style={{ maxWidth: 720 }}>

            {/* Banner modo demo */}
            {isDemoMode && (
              <div style={{
                background: '#FFF8EC',
                border: '1px solid rgba(245,166,35,0.3)',
                borderRadius: 12,
                padding: '14px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.82rem',
                  color: '#D48A0A',
                  margin: 0,
                }}>
                  Modo demonstração — dados ilustrativos. Adicione{' '}
                  <code style={{ fontSize: '0.78rem' }}>SHERPA_API_KEY</code> para dados reais em tempo real.
                </p>
              </div>
            )}

            {/* Cabeçalho do resultado */}
            <div className="card" style={{ padding: '24px 28px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 40 }}>
                  {natCountry?.flag ?? '🌍'} → {destCountry?.flag ?? '🌍'}
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: '1.25rem',
                    color: '#0D1B3E',
                    margin: '0 0 4px',
                  }}>
                    {natCountry?.name ?? nationality} → {destCountry?.name ?? destination}
                  </h2>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.8rem',
                    color: '#8A9AB5',
                    margin: 0,
                  }}>
                    Atualizado em {new Date(result.lastUpdated).toLocaleDateString('pt-BR')} · Fonte: {result.source}
                  </p>
                </div>
              </div>

              {/* Visto */}
              {(() => {
                const visa = VISA_LABELS[result.visaType] ?? VISA_LABELS.unknown
                return (
                  <div style={{
                    background: visa.bg,
                    border: `1.5px solid ${visa.color}30`,
                    borderRadius: 12,
                    padding: '16px 20px',
                    marginBottom: 16,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 20 }}>
                        {result.visaType === 'not_required' ? '✅' :
                         result.visaType === 'on_arrival'   ? '🛬' :
                         result.visaType === 'e_visa'       ? '💻' :
                         result.visaType === 'embassy'      ? '🏛️' : 'ℹ️'}
                      </span>
                      <strong style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '1rem',
                        color: visa.color,
                      }}>
                        {visa.label}
                      </strong>
                    </div>
                    <p style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.85rem',
                      color: '#3D4B5C',
                      margin: 0,
                      lineHeight: 1.6,
                    }}>
                      {result.visaInfo}
                    </p>
                  </div>
                )
              })()}

              {/* Passaporte */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 0',
                borderTop: '1px solid #EEF4FF',
              }}>
                <span style={{ fontSize: 20, marginTop: 2 }}>🛂</span>
                <div>
                  <strong style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 4,
                  }}>
                    Validade do passaporte
                  </strong>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.85rem',
                    color: '#5A6A80',
                    margin: 0,
                  }}>
                    {result.passportValidity}
                  </p>
                </div>
              </div>
            </div>

            {/* Vacinas */}
            {(result.vaccinesRequired.length > 0 || result.vaccinesRecommended.length > 0) && (
              <div className="card" style={{ padding: '24px 28px', marginBottom: 16 }}>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.05rem',
                  color: '#0D1B3E',
                  margin: '0 0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  💉 Vacinas
                </h3>

                {result.vaccinesRequired.map((v, i) => (
                  <div key={i} style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a530',
                    borderRadius: 10,
                    padding: '12px 16px',
                    marginBottom: 10,
                    display: 'flex',
                    gap: 12,
                  }}>
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', marginTop: 2 }}>
                      OBRIGATÓRIA
                    </span>
                    <div>
                      <strong style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#0D1B3E' }}>
                        {v.name}
                      </strong>
                      {v.details && (
                        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#5A6A80', margin: '4px 0 0' }}>
                          {v.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {result.vaccinesRecommended.map((v, i) => (
                  <div key={i} style={{
                    background: '#fef9c3',
                    border: '1px solid #fde04730',
                    borderRadius: 10,
                    padding: '12px 16px',
                    marginBottom: 10,
                    display: 'flex',
                    gap: 12,
                  }}>
                    <span style={{ color: '#ca8a04', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', marginTop: 2 }}>
                      RECOMENDADA
                    </span>
                    <div>
                      <strong style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#0D1B3E' }}>
                        {v.name}
                      </strong>
                      {v.details && (
                        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#5A6A80', margin: '4px 0 0' }}>
                          {v.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Restrições de entrada */}
            {result.entryRestrictions.length > 0 && (
              <div className="card" style={{ padding: '24px 28px', marginBottom: 16 }}>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.05rem',
                  color: '#0D1B3E',
                  margin: '0 0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  ⚠️ Restrições de entrada
                </h3>
                {result.entryRestrictions.map((r, i) => (
                  <div key={i} style={{
                    padding: '10px 16px',
                    background: '#FFF8EC',
                    borderRadius: 8,
                    marginBottom: 8,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.85rem',
                    color: '#5A6A80',
                    borderLeft: '3px solid #F5A623',
                  }}>
                    {r}
                  </div>
                ))}
              </div>
            )}

            {/* Upgrade Livoo Prep */}
            <div style={{
              background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)',
              borderRadius: 16,
              padding: '28px 32px',
              marginBottom: 16,
            }}>
              {isPaid ? (
                // Estado pago — checklist completo
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 20,
                  }}>
                    <span style={{ fontSize: 28 }}>✅</span>
                    <div>
                      <strong style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '1rem',
                        color: '#F5A623',
                        display: 'block',
                        marginBottom: 2,
                      }}>
                        Livoo Prep ativo
                      </strong>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                      }}>
                        Acesso completo ao checklist e PDF personalizado
                      </p>
                    </div>
                  </div>

                  {/* Checklist completo */}
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '16px 20px',
                    marginBottom: 16,
                  }}>
                    <p style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: '#fff',
                      margin: '0 0 12px',
                    }}>
                      Checklist para {destCountry?.name ?? destination}
                    </p>
                    {[
                      { done: result.visaType === 'not_required', text: `Visto — ${VISA_LABELS[result.visaType]?.label ?? 'Verificar'}` },
                      { done: false, text: 'Passaporte com validade suficiente' },
                      { done: false, text: 'Seguro viagem contratado' },
                      ...result.vaccinesRequired.map(v => ({ done: false, text: `Vacina obrigatória: ${v.name}` })),
                      ...result.vaccinesRecommended.map(v => ({ done: false, text: `Vacina recomendada: ${v.name}` })),
                      { done: false, text: 'Câmbio / cartão internacional' },
                      { done: false, text: 'Adaptador de tomada (se necessário)' },
                      { done: false, text: 'Cópia digital dos documentos no celular' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.85rem',
                        color: item.done ? '#6ee7b7' : 'rgba(255,255,255,0.8)',
                      }}>
                        <span style={{ fontSize: 16 }}>{item.done ? '✅' : '☐'}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => window.print()}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      background: '#F5A623',
                      color: '#0D1B3E',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    Imprimir / Salvar PDF
                  </button>
                </div>
              ) : (
                // Estado free — upsell Livoo Prep
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
                    <div>
                      <strong style={{
                        fontFamily: 'Fraunces, serif',
                        fontSize: '1.2rem',
                        color: '#fff',
                        display: 'block',
                        marginBottom: 8,
                      }}>
                        Livoo Prep — Checklist Completo
                      </strong>
                      <p style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                        lineHeight: 1.6,
                      }}>
                        Checklist interativo personalizado + PDF para download + alertas de documentos próximos ao vencimento.
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        display: 'block',
                        fontFamily: 'Fraunces, serif',
                        fontSize: '1.6rem',
                        color: '#F5A623',
                        lineHeight: 1,
                      }}>
                        R$39
                      </span>
                      <span style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                        por viagem
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    marginBottom: 20,
                  }}>
                    {[
                      '✅ Checklist interativo completo',
                      '📄 PDF para download',
                      '🔔 Alertas de vencimento',
                      '🔒 Dados protegidos (LGPD)',
                    ].map((item, i) => (
                      <div key={i} style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.8)',
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>

                  {checkoutError && (
                    <p style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.82rem',
                      color: '#fca5a5',
                      marginBottom: 12,
                    }}>
                      {checkoutError}
                    </p>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px',
                      background: '#F5A623',
                      color: '#0D1B3E',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      border: 'none',
                      borderRadius: 10,
                      cursor: checkoutLoading ? 'wait' : 'pointer',
                      opacity: checkoutLoading ? 0.7 : 1,
                    }}
                  >
                    {checkoutLoading ? 'Redirecionando...' : 'Ativar Livoo Prep — R$ 39'}
                  </button>

                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.4)',
                    margin: '10px 0 0',
                    textAlign: 'center',
                  }}>
                    Pagamento seguro via Stripe · Acesso imediato após confirmação
                  </p>
                </div>
              )}
            </div>

            {/* CTA roteiro */}
            <div style={{
              background: '#fff',
              border: '1px solid #D0DCF0',
              borderRadius: 12,
              padding: '20px 24px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem',
                color: '#5A6A80',
                marginBottom: 12,
              }}>
                Quer montar o roteiro completo para {destCountry?.name ?? destination}?
              </p>
              <Link
                href={`/?destino=${encodeURIComponent(destCountry?.name ?? destination)}`}
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#1A56DB',
                  textDecoration: 'none',
                }}
              >
                Criar roteiro com voo + hotel + experiências →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Estado de erro */}
      {status === 'error' && (
        <section style={{ padding: '0 0 64px' }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0D1B3E', margin: '0 0 8px' }}>
                Erro ao verificar documentação
              </h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5A6A80' }}>
                Não foi possível buscar os dados. Verifique sua conexão e tente novamente.
              </p>
              <button
                onClick={() => handleCheck()}
                className="btn-primary"
                style={{ marginTop: 16, padding: '10px 24px', fontSize: '0.88rem' }}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Estado idle — cards informativos */}
      {status === 'idle' && (
        <section style={{ padding: '0 0 80px' }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {[
                { icon: '🛂', title: 'Visto', desc: 'Saiba se você precisa de visto e como obtê-lo.' },
                { icon: '🛡️', title: 'Passaporte', desc: 'Validade mínima exigida e outros requisitos.' },
                { icon: '💉', title: 'Vacinas', desc: 'Obrigatórias e recomendadas para o destino.' },
                { icon: '⚠️', title: 'Restrições', desc: 'Restrições de entrada vigentes e documentos extras.' },
              ].map((item, i) => (
                <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                  <strong style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    {item.title}
                  </strong>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.78rem',
                    color: '#5A6A80',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function PrepPage() {
  return (
    <Suspense>
      <PrepContent />
    </Suspense>
  )
}
