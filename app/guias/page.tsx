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
          background: '#fafaf7',
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9aaabb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Categoria */}
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.7rem',
            fontWeight: 700, color: '#ff5722', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 6, display: 'block',
          }}>
            {exp.category}
          </span>

          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem',
            color: '#0d0d0f', margin: '0 0 6px',
          }}>
            {exp.title}
          </h3>

          <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6d6d74',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6d6d74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {exp.location}
            </span>
            {exp.duration && (
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6d6d74',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6d6d74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {exp.duration}
              </span>
            )}
          </div>

          {/* Avaliação */}
          {exp.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffd600" stroke="#ffd600" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '0.85rem', color: '#0d0d0f',
              }}>
                {exp.rating.toFixed(1)}
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6d6d74',
              }}>
                ({exp.reviewCount.toLocaleString('pt-BR')} avaliações)
              </span>
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.15rem',
                fontWeight: 700, color: '#0d0d0f', margin: 0,
              }}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency', currency: exp.currency === 'EUR' ? 'EUR' : 'BRL',
                  minimumFractionDigits: 0,
                }).format(exp.price)}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
                color: '#6d6d74', margin: '2px 0 0',
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
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem',
          color: '#fff', marginBottom: 6,
        }}>
          Guias e experiências
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
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
                  <option key={c.value} value={c.value} style={{ background: '#0d0d0f' }}>
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
              width: 40, height: 40, border: '3px solid #fafaf7',
              borderTop: '3px solid #ff5722', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74' }}>
              Buscando experiências em {current.destination}...
            </p>
          </div>
        )}

        {/* Redirect → GetYourGuide (API ainda não configurada) */}
        {status === 'redirect' && (
          <div>
            {/* Cabeçalho */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', color: '#0d0d0f', marginBottom: 4 }}>
                Experiências em {current.destination}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6d6d74' }}>
                Redirecionando para GetYourGuide — maior plataforma de experiências do mundo
              </p>
            </div>

            {/* Card de redirect */}
            <div style={{
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(13,27,62,0.08)', border: '1px solid #e7e6e0',
            }}>
              {/* Header colorido */}
              <div style={{
                background: 'linear-gradient(135deg, #0d0d0f 0%, #1A3A6E 100%)',
                padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 24,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                    letterSpacing: '1.5px', marginBottom: 6,
                  }}>
                    Parceiro verificado
                  </p>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                    GetYourGuide — {current.destination}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginTop: 4, marginBottom: 0 }}>
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
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffd600" stroke="#ffd600" strokeWidth="1.5" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ),
                      label: 'Avaliações verificadas', desc: 'Só quem fez a experiência avalia',
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      ),
                      label: 'Reserva segura', desc: 'Cancelamento grátis na maioria das atividades',
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      ),
                      label: '+300 mil atividades', desc: 'O maior catálogo global de experiências',
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      ),
                      label: 'Suporte em português', desc: 'Atendimento disponível em PT-BR',
                    },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: '#fafaf7', borderRadius: 12, padding: '16px 18px',
                    }}>
                      <span style={{ display: 'block', marginBottom: 8 }}>{item.icon}</span>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#0d0d0f', margin: '0 0 4px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6d6d74', margin: 0 }}>
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
                  fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
                  color: '#6d6d74', textAlign: 'center', marginTop: 10,
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
            <p style={{ fontFamily: 'Inter, sans-serif', color: '#6d6d74', fontSize: '0.9rem', marginBottom: 20 }}>
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
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem',
                  color: '#0d0d0f', marginBottom: 4,
                }}>
                  {current.destination}
                </h2>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6d6d74',
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
                  fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                  color: '#ff5722', fontWeight: 600, textDecoration: 'none',
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9aaabb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/>
                <line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0d0d0f', marginBottom: 8 }}>
              Nenhuma experiência encontrada
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif', color: '#6d6d74',
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
              fontFamily: 'Inter, sans-serif',
              color: '#6d6d74', fontSize: '0.95rem',
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
        select option { background: #0d0d0f; color: #fff; }
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
