'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import CitySearch from '@/components/CitySearch'

// ── Types ──────────────────────────────────────────────────

interface Experience {
  id:           string
  title:        string
  location:     string
  duration:     string
  rating:       number
  reviewCount:  number
  price:        number
  currency:     string
  imageUrl:     string
  link:         string
  category:     string
}

// ── Helpers ────────────────────────────────────────────────

function formatDateDisplay(date: string): string {
  if (!date) return ''
  const d = new Date(date + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Experience Card ────────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex' }}>
        {/* Imagem */}
        <div style={{
          width: 180, flexShrink: 0,
          background: '#EEF4FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, minHeight: 140,
        }}>
          {!imgError && exp.imageUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 140 }}>
              <Image
                src={exp.imageUrl}
                alt={exp.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="180px"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <span>🗺️</span>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Categoria */}
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.7rem',
            fontWeight: 700, color: '#1A56DB', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 6, display: 'block',
          }}>
            {exp.category}
          </span>

          <h3 style={{
            fontFamily: 'Fraunces, serif', fontSize: '1rem',
            color: '#0D1B3E', margin: '0 0 6px',
          }}>
            {exp.title}
          </h3>

          <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#5A6A80',
            }}>
              📍 {exp.location}
            </span>
            {exp.duration && (
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#5A6A80',
              }}>
                ⏱ {exp.duration}
              </span>
            )}
          </div>

          {/* Avaliação */}
          {exp.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ color: '#F5A623', fontSize: '0.85rem' }}>★</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
                fontSize: '0.85rem', color: '#0D1B3E',
              }}>
                {exp.rating.toFixed(1)}
              </span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#5A6A80',
              }}>
                ({exp.reviewCount.toLocaleString('pt-BR')} avaliações)
              </span>
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontFamily: 'Fraunces, serif', fontSize: '1.15rem',
                fontWeight: 700, color: '#0D1B3E', margin: 0,
              }}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency', currency: exp.currency === 'EUR' ? 'EUR' : 'BRL',
                  minimumFractionDigits: 0,
                }).format(exp.price)}
              </p>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem',
                color: '#5A6A80', margin: '2px 0 0',
              }}>
                por pessoa
              </p>
            </div>
            <a
              href={exp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '10px 20px' }}
            >
              Reservar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Formulário de busca ────────────────────────────────────

function SearchForm({
  defaultDestination, defaultDate, defaultCategory, onSearch,
}: {
  defaultDestination: string
  defaultDate:        string
  defaultCategory:    string
  onSearch: (destination: string, date: string, category: string) => void
}) {
  const [destination, setDestination] = useState(defaultDestination)
  const [date,        setDate]        = useState(defaultDate)
  const [category,    setCategory]    = useState(defaultCategory)

  const CATEGORIES = [
    { value: '', label: 'Todas as categorias' },
    { value: 'tours', label: 'City tours' },
    { value: 'food', label: 'Gastronomia' },
    { value: 'outdoor', label: 'Aventura e natureza' },
    { value: 'culture', label: 'Cultura e museus' },
    { value: 'sport', label: 'Esportes' },
    { value: 'transfer', label: 'Transfers e traslados' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!destination) return
    onSearch(destination, date, category)
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
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: '1.8rem',
          color: '#fff', marginBottom: 6,
        }}>
          Guias e experiências
        </h1>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.6)', marginBottom: 28,
        }}>
          Tours, aventuras, gastronomia e atividades no seu destino.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: 12, alignItems: 'end' }}>
            {/* Destino */}
            <div>
              <label style={labelStyle}>Destino</label>
              <CitySearch
                value={destination}
                onChange={setDestination}
                placeholder="Ex: Rio de Janeiro, Paris, Tóquio"
                dark={true}
                required
              />
            </div>

            {/* Data */}
            <div>
              <label style={labelStyle}>Data (opcional)</label>
              <input
                type="date"
                style={inputStyle}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            {/* Categoria */}
            <div>
              <label style={labelStyle}>Categoria</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value} style={{ background: '#0D1B3E' }}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: 14, padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
          >
            Buscar experiências
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────

function GuiasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialDestination = searchParams.get('destination') || ''
  const initialDate        = searchParams.get('date')        || ''
  const initialCategory    = searchParams.get('category')    || ''

  const [experiences,  setExperiences]  = useState<Experience[]>([])
  const [status,       setStatus]       = useState<'idle' | 'loading' | 'done' | 'error' | 'redirect'>('idle')
  const [fallbackUrl,  setFallbackUrl]  = useState<string>('')
  const [current, setCurrent] = useState({
    destination: initialDestination,
    date:        initialDate,
    category:    initialCategory,
  })

  useEffect(() => {
    if (initialDestination) {
      fetchExperiences(initialDestination, initialDate, initialCategory)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchExperiences(destination: string, date: string, category: string) {
    setStatus('loading')
    setExperiences([])
    setCurrent({ destination, date, category })

    const qs = new URLSearchParams({ destination })
    if (date)     qs.set('date', date)
    if (category) qs.set('category', category)
    router.replace(`/guias?${qs}`, { scroll: false })

    try {
      const res  = await fetch(`/api/experiences?${qs}`)
      const data = await res.json()

      // API não configurada ainda → redireciona para GYG diretamente
      if (res.status === 503 || res.status === 500) {
        setFallbackUrl(data.fallbackUrl || `https://www.getyourguide.com/s/?q=${encodeURIComponent(destination)}`)
        setStatus('redirect')
        return
      }

      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      setExperiences(data.experiences ?? [])
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  // URL de fallback GetYourGuide
  const gygFallbackUrl = current.destination
    ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(current.destination)}&partner_id=GOLIVOO`
    : 'https://www.getyourguide.com'

  return (
    <>
      <SearchForm
        defaultDestination={initialDestination}
        defaultDate={initialDate}
        defaultCategory={initialCategory}
        onSearch={fetchExperiences}
      />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{
              width: 40, height: 40, border: '3px solid #EEF4FF',
              borderTop: '3px solid #1A56DB', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80' }}>
              Buscando experiências em {current.destination}...
            </p>
          </div>
        )}

        {/* Redirect → GetYourGuide (API ainda não configurada) */}
        {status === 'redirect' && (
          <div>
            {/* Cabeçalho */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', color: '#0D1B3E', marginBottom: 4 }}>
                Experiências em {current.destination}
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5A6A80' }}>
                Redirecionando para GetYourGuide — maior plataforma de experiências do mundo
              </p>
            </div>

            {/* Card de redirect */}
            <div style={{
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(13,27,62,0.08)', border: '1px solid #D0DCF0',
            }}>
              {/* Header colorido */}
              <div style={{
                background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
                padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 24,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, flexShrink: 0,
                }}>
                  🧭
                </div>
                <div>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                    letterSpacing: '1.5px', marginBottom: 6,
                  }}>
                    Parceiro verificado
                  </p>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                    GetYourGuide — {current.destination}
                  </h3>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginTop: 4, marginBottom: 0 }}>
                    Tours, experiências, guias locais e atividades para a sua viagem
                  </p>
                </div>
              </div>

              {/* Corpo */}
              <div style={{ padding: '32px 40px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 16, marginBottom: 32,
                }}>
                  {[
                    { icon: '⭐', label: 'Avaliações verificadas', desc: 'Só quem fez a experiência avalia' },
                    { icon: '🔒', label: 'Reserva segura', desc: 'Cancelamento grátis na maioria das atividades' },
                    { icon: '🌍', label: '+300 mil atividades', desc: 'O maior catálogo global de experiências' },
                    { icon: '💬', label: 'Suporte em português', desc: 'Atendimento disponível em PT-BR' },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: '#F4F7FF', borderRadius: 12, padding: '16px 18px',
                    }}>
                      <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#0D1B3E', margin: '0 0 4px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', color: '#5A6A80', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center', padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Ver experiências em {current.destination} no GetYourGuide →
                </a>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem',
                  color: '#5A6A80', textAlign: 'center', marginTop: 10,
                }}>
                  A Go Livoo recebe uma comissão quando você reserva — sem custo adicional para você.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Erro genérico */}
        {status === 'error' && (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 48,
            textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)',
          }}>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80', fontSize: '0.9rem', marginBottom: 20 }}>
              Não foi possível carregar as experiências. Tente novamente.
            </p>
            <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(current.destination)}`}
              target="_blank" rel="noopener noreferrer" className="btn-primary"
              style={{ display: 'inline-block', fontSize: '0.9rem', padding: '12px 28px' }}>
              Buscar no GetYourGuide →
            </a>
          </div>
        )}

        {/* Resultados */}
        {status === 'done' && experiences.length > 0 && (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20,
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'Fraunces, serif', fontSize: '1.2rem',
                  color: '#0D1B3E', marginBottom: 4,
                }}>
                  {current.destination}
                </h2>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5A6A80',
                }}>
                  {experiences.length} experiência{experiences.length !== 1 ? 's' : ''} encontrada{experiences.length !== 1 ? 's' : ''}
                  {current.date ? ` · ${formatDateDisplay(current.date)}` : ''}
                </p>
              </div>
              <a
                href={gygFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
                  color: '#1A56DB', fontWeight: 600, textDecoration: 'none',
                }}
              >
                Ver mais no GetYourGuide →
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experiences.map(exp => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          </>
        )}

        {/* Sem resultados */}
        {status === 'done' && experiences.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 48,
            textAlign: 'center', boxShadow: '0 4px 20px rgba(13,27,62,0.07)',
          }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🗺️</span>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0D1B3E', marginBottom: 8 }}>
              Nenhuma experiência encontrada
            </h3>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5A6A80',
              fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 28px',
            }}>
              Não encontramos experiências para esse destino na nossa base. Veja o que está disponível diretamente no GetYourGuide.
            </p>
            <a
              href={gygFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-block', fontSize: '0.9rem', padding: '12px 28px' }}
            >
              Buscar no GetYourGuide →
            </a>
          </div>
        )}

        {/* Estado inicial */}
        {status === 'idle' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#5A6A80', fontSize: '0.95rem',
            }}>
              Digite o destino para encontrar tours, guias e experiências locais.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }
        input::placeholder { color: rgba(255,255,255,0.45) !important; }
        select option { background: #0D1B3E; color: #fff; }
      `}</style>
    </>
  )
}

export default function GuiasPage() {
  return (
    <Suspense>
      <GuiasContent />
    </Suspense>
  )
}
