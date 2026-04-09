'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { TMEvent } from '@/app/api/events/route'

// ── Tipos ──────────────────────────────────────────────────

type Category = 'todos' | 'futebol' | 'automobilismo' | 'shows' | 'cultura' | 'esportes'

interface StaticEvent {
  id:            string
  title:         string
  description:   string
  date:          string
  location:      string
  country:       string
  flag:          string
  category:      Category
  tag:           string
  tagColor:      string
  imageUrl:      string
  ticketUrl:     string
  ticketLabel:   string
  priceEstimate: string
  flightFrom?:   string
  source:        'static'
}

type AnyEvent = StaticEvent | (TMEvent & { flightFrom?: string })

// ── Eventos curados (fallback e base sempre visível) ────────

const STATIC_EVENTS: StaticEvent[] = [
  {
    id: 'athletico-pr',
    title: 'Athletico Paranaense — Brasileirão',
    description: 'Sinta a atmosfera da Ligga Arena e o calor da torcida rubro-negra. Experiência completa para torcedores estrangeiros.',
    date: 'Temporada 2025',
    location: 'Curitiba, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'futebol',
    tag: 'Futebol Brasileiro',
    tagColor: '#16a34a',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600',
    ticketUrl: 'https://ingressos.athletico.com.br/',
    ticketLabel: 'Comprar ingresso — ingressos.athletico.com.br',
    priceEstimate: 'Ingressos a partir de R$ 40',
    flightFrom: 'Voos para Curitiba a partir de R$ 320',
    source: 'static',
  },
  {
    id: 'flamengo',
    title: 'Flamengo — Maracanã',
    description: 'O maior clube do Brasil no palco mais icônico do futebol mundial. Uma experiência que vai além do jogo.',
    date: 'Temporada 2025',
    location: 'Rio de Janeiro, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'futebol',
    tag: 'Futebol Brasileiro',
    tagColor: '#16a34a',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600',
    ticketUrl: 'https://www.futebolcard.com/events?team=flamengo',
    ticketLabel: 'Comprar ingresso — FutebolCard',
    priceEstimate: 'Ingressos a partir de R$ 60',
    flightFrom: 'Voos para o Rio a partir de R$ 280',
    source: 'static',
  },
  {
    id: 'corinthians',
    title: 'Corinthians — Neo Química Arena',
    description: 'A Fiel Torcida é uma das mais apaixonadas do mundo. Viver um jogo na Neo Química Arena é inesquecível.',
    date: 'Temporada 2025',
    location: 'São Paulo, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'futebol',
    tag: 'Futebol Brasileiro',
    tagColor: '#16a34a',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600',
    ticketUrl: 'https://www.futebolcard.com/events?team=corinthians',
    ticketLabel: 'Comprar ingresso — FutebolCard',
    priceEstimate: 'Ingressos a partir de R$ 50',
    flightFrom: 'Voos para São Paulo a partir de R$ 220',
    source: 'static',
  },
  {
    id: 'copa-libertadores',
    title: 'Final da Copa Libertadores 2025',
    description: 'O maior torneio de clubes das Américas. Atmosfera única, times apaixonados e o troféu mais cobiçado do continente.',
    date: 'Nov 2025',
    location: 'Buenos Aires, Argentina',
    country: 'Argentina',
    flag: '🇦🇷',
    category: 'futebol',
    tag: 'Em alta',
    tagColor: '#F5A623',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc82e6e25b?w=600',
    ticketUrl: 'https://www.conmebol.com/pt/',
    ticketLabel: 'Ingressos — CONMEBOL',
    priceEstimate: 'Preço estimado a partir de R$ 800',
    flightFrom: 'Voos para Buenos Aires a partir de R$ 1.200',
    source: 'static',
  },
  {
    id: 'f1-monaco',
    title: 'GP de Fórmula 1 — Mônaco',
    description: 'A corrida mais glamourosa do mundo. Curvas impossíveis, iates no porto e o som dos motores ecoando nas montanhas.',
    date: 'Mai 2026',
    location: 'Monte Carlo, Mônaco',
    country: 'Mônaco',
    flag: '🇲🇨',
    category: 'automobilismo',
    tag: 'Esgotando',
    tagColor: '#dc2626',
    imageUrl: 'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=600',
    ticketUrl: 'https://www.formula1.com/en/racing/2026/monaco/tickets.html',
    ticketLabel: 'Ingressos oficiais — Formula1.com',
    priceEstimate: 'Preço estimado a partir de R$ 22.000',
    flightFrom: 'Voos para Nice a partir de R$ 6.800',
    source: 'static',
  },
  {
    id: 'f1-brasil',
    title: 'GP de Fórmula 1 — Brasil',
    description: 'Interlagos é eleita pelos pilotos como um dos melhores circuitos do mundo. A torcida brasileira torna tudo mais especial.',
    date: 'Nov 2025',
    location: 'São Paulo, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'automobilismo',
    tag: 'Em alta',
    tagColor: '#F5A623',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ticketUrl: 'https://www.formula1.com/en/racing/2025/brazil/tickets.html',
    ticketLabel: 'Ingressos oficiais — Formula1.com',
    priceEstimate: 'Preço estimado a partir de R$ 1.800',
    flightFrom: 'Voos para São Paulo a partir de R$ 320',
    source: 'static',
  },
  {
    id: 'arrancada-florida',
    title: 'Drag Racing — Florida NHRA',
    description: 'Os carros mais rápidos do mundo em linha reta. Uma experiência sonora e visual que poucos eventos conseguem igualar.',
    date: 'Mar 2026',
    location: 'Gainesville, EUA',
    country: 'EUA',
    flag: '🇺🇸',
    category: 'automobilismo',
    tag: 'Nichado',
    tagColor: '#7c3aed',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600',
    ticketUrl: 'https://www.nhra.com/tickets',
    ticketLabel: 'Ingressos oficiais — NHRA.com',
    priceEstimate: 'Preço estimado a partir de R$ 2.400',
    flightFrom: 'Voos para Orlando a partir de R$ 3.200',
    source: 'static',
  },
  {
    id: 'rally-georgia',
    title: 'Rally Cross — Geórgia',
    description: 'O campeonato de rally cross mais emocionante da Europa, com pilotos de 20 países em circuitos de terra e asfalto.',
    date: 'Out 2026',
    location: 'Tbilisi, Geórgia',
    country: 'Geórgia',
    flag: '🇬🇪',
    category: 'automobilismo',
    tag: 'Exclusivo',
    tagColor: '#7c3aed',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ticketUrl: 'https://www.fiaworldrallycross.com/',
    ticketLabel: 'Ingressos — FIA World RX',
    priceEstimate: 'Preço estimado a partir de R$ 8.900',
    flightFrom: 'Voos para Tbilisi a partir de R$ 5.400',
    source: 'static',
  },
  {
    id: 'lollapalooza-brasil',
    title: 'Lollapalooza Brasil 2026',
    description: 'O maior festival de música do Brasil no Autódromo de Interlagos. Três dias, múltiplos palcos, artistas internacionais.',
    date: 'Mar 2026',
    location: 'São Paulo, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'shows',
    tag: 'Em alta',
    tagColor: '#F5A623',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
    ticketUrl: 'https://www.lollapaloozabr.com/',
    ticketLabel: 'Ingressos — lollapaloozabr.com',
    priceEstimate: 'Ingressos a partir de R$ 650',
    flightFrom: 'Voos para São Paulo a partir de R$ 220',
    source: 'static',
  },
  {
    id: 'rock-in-rio',
    title: 'Rock in Rio 2025',
    description: 'O maior festival de música do mundo acontece no Rio de Janeiro. Uma semana de shows com os maiores artistas do planeta.',
    date: 'Set 2025',
    location: 'Rio de Janeiro, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'shows',
    tag: 'Esgotando',
    tagColor: '#dc2626',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
    ticketUrl: 'https://rockinrio.com/rio/ingressos/',
    ticketLabel: 'Ingressos — rockinrio.com',
    priceEstimate: 'Ingressos a partir de R$ 395',
    flightFrom: 'Voos para o Rio a partir de R$ 280',
    source: 'static',
  },
  {
    id: 'carnaval-rio',
    title: 'Carnaval do Rio — Sambódromo',
    description: 'O maior espetáculo da Terra. Desfiles das escolas de samba no Sambódromo — uma experiência única no mundo.',
    date: 'Mar 2026',
    location: 'Rio de Janeiro, Brasil',
    country: 'Brasil',
    flag: '🇧🇷',
    category: 'cultura',
    tag: 'Ícone',
    tagColor: '#F5A623',
    imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600',
    ticketUrl: 'https://www.liesa.com.br/',
    ticketLabel: 'Ingressos — liesa.com.br',
    priceEstimate: 'Ingressos a partir de R$ 200',
    flightFrom: 'Voos para o Rio a partir de R$ 280',
    source: 'static',
  },
  {
    id: 'hanami-japao',
    title: 'Hanami — Japão',
    description: 'A cerimônia das flores de cerejeira. Uma semana de festivais, picnics nos parques e o Japão mais fotogênico do ano.',
    date: 'Mar–Abr 2027',
    location: 'Tóquio & Kyoto, Japão',
    country: 'Japão',
    flag: '🇯🇵',
    category: 'cultura',
    tag: 'Em alta',
    tagColor: '#F5A623',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600',
    ticketUrl: 'https://www.japan.travel/pt/',
    ticketLabel: 'Guia de viagem — japan.travel',
    priceEstimate: 'Preço estimado a partir de R$ 15.800',
    flightFrom: 'Voos para Tóquio a partir de R$ 7.200',
    source: 'static',
  },
]

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'futebol', label: 'Futebol' },
  { value: 'automobilismo', label: 'Automobilismo' },
  { value: 'shows', label: 'Shows' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'esportes', label: 'Esportes' },
]

// ── Componente de card ─────────────────────────────────────

function EventCard({ event }: { event: AnyEvent }) {
  const roteirUrl = `/roteiro?evento=${encodeURIComponent(event.title)}&destino=${encodeURIComponent(event.location)}`
  const isTM = event.source === 'ticketmaster'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #D0DCF0',
        boxShadow: '0 2px 12px rgba(13,27,62,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(13,27,62,0.12)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(13,27,62,0.06)'
      }}
    >
      {/* Imagem */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#0D1B3E' }}>
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
          }}>
            {event.flag}
          </div>
        )}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,62,0.6) 0%, transparent 50%)',
        }} />

        {/* Tag */}
        <span style={{
          position: 'absolute',
          top: 14, left: 14,
          background: event.tagColor,
          color: '#fff',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: 50,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          {event.tag}
        </span>

        {/* Badge Ticketmaster */}
        {isTM && (
          <span style={{
            position: 'absolute',
            top: 14, right: 14,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontSize: '0.6rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 50,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: '0.5px',
          }}>
            AO VIVO
          </span>
        )}

        {/* Flag + local */}
        <span style={{
          position: 'absolute',
          bottom: 12, left: 14,
          color: '#fff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.8rem',
          fontWeight: 500,
        }}>
          {event.flag} {event.location}
        </span>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#1A56DB',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          marginBottom: 8,
        }}>
          {event.date}
        </div>
        <h3 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0D1B3E',
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}>
          {event.title}
        </h3>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.85rem',
          color: '#5A6A80',
          lineHeight: 1.6,
          margin: '0 0 16px',
        }}>
          {event.description}
        </p>
      </div>

      {/* Preços + ações */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#F4F7FF',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 14,
        }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.78rem',
            color: '#5A6A80',
            marginBottom: 4,
          }}>
            {event.priceEstimate}
          </div>
          {'flightFrom' in event && event.flightFrom && (
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.78rem',
              color: '#1A56DB',
              fontWeight: 600,
            }}>
              {event.flightFrom}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#0D1B3E',
              color: '#fff',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.82rem',
              padding: '10px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Ingressos
          </a>
          <Link
            href={roteirUrl}
            style={{
              display: 'block',
              background: 'transparent',
              color: '#1A56DB',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.82rem',
              padding: '10px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              textAlign: 'center',
              border: '2px solid #1A56DB',
            }}
          >
            Montar pacote completo
          </Link>
        </div>

        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.68rem',
          color: '#5A6A80',
          margin: '10px 0 0',
          textAlign: 'center',
        }}>
          {event.ticketLabel}
        </p>
      </div>
    </div>
  )
}

// ── Skeleton de loading ────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid #D0DCF0',
    }}>
      <div style={{ height: 200, background: '#EEF4FF' }} />
      <div style={{ padding: 20 }}>
        <div style={{ height: 12, background: '#EEF4FF', borderRadius: 6, marginBottom: 12, width: '40%' }} />
        <div style={{ height: 20, background: '#EEF4FF', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 14, background: '#EEF4FF', borderRadius: 6, marginBottom: 6, width: '80%' }} />
        <div style={{ height: 14, background: '#EEF4FF', borderRadius: 6, width: '65%' }} />
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────

export default function EventosPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('todos')
  const [keyword, setKeyword]               = useState('')
  const [inputValue, setInputValue]         = useState('')
  const [liveEvents, setLiveEvents]         = useState<TMEvent[]>([])
  const [loading, setLoading]               = useState(false)
  const [isDemoMode, setIsDemoMode]         = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce do input de busca
  function handleInputChange(val: string) {
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setKeyword(val), 400)
  }

  // Busca ao Ticketmaster quando keyword ou category muda
  useEffect(() => {
    async function fetchLive() {
      setLoading(true)
      try {
        const qs = new URLSearchParams()
        if (keyword) qs.set('keyword', keyword)
        if (activeCategory !== 'todos') qs.set('category', activeCategory)

        const res  = await fetch(`/api/events?${qs}`)
        const data = await res.json()
        setLiveEvents(data.events ?? [])
        setIsDemoMode(data.isDemoMode ?? false)
      } catch {
        setLiveEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchLive()
  }, [keyword, activeCategory])

  // Filtra estáticos por categoria + keyword
  const filteredStatic = STATIC_EVENTS.filter(e => {
    const matchCat = activeCategory === 'todos' || e.category === activeCategory
    const matchKw  = !keyword || e.title.toLowerCase().includes(keyword.toLowerCase()) ||
                     e.location.toLowerCase().includes(keyword.toLowerCase())
    return matchCat && matchKw
  })

  // Deduplica TM (remove se já tem id idêntico no estático, improvável mas seguro)
  const staticIds = new Set(filteredStatic.map(e => e.id))
  const uniqueLive = liveEvents.filter(e => !staticIds.has(e.id))

  // Se buscando: TM primeiro, depois estáticos relevantes
  // Se não buscando: só estáticos (TM carrega silenciosamente)
  const allEvents: AnyEvent[] = keyword
    ? [...uniqueLive, ...filteredStatic]
    : [...filteredStatic, ...uniqueLive]

  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)',
        padding: '64px 0 48px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
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
            Experiências Reais
          </span>
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 16px',
          }}>
            Eventos & Experiências
          </h1>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 540,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            Escolha o evento. A Go Livoo monta o pacote completo — voo, hotel e toda a logística.
          </p>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto 28px', position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              fontSize: 16, color: 'rgba(255,255,255,0.5)', pointerEvents: 'none',
            }}>
              🔍
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="Buscar eventos ao vivo — ex: F1, Taylor Swift, Coachella..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 12,
                color: '#fff',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Filtros de categoria */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 50,
                  border: activeCategory === cat.value
                    ? '2px solid #F5A623'
                    : '2px solid rgba(255,255,255,0.2)',
                  background: activeCategory === cat.value ? '#F5A623' : 'transparent',
                  color: activeCategory === cat.value ? '#0D1B3E' : '#fff',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID DE EVENTOS ── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">

          {/* Banner Ticketmaster (ao vivo) */}
          {!isDemoMode && uniqueLive.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #D0DCF0',
              borderRadius: 12,
              padding: '14px 20px',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{
                background: '#dc2626',
                color: '#fff',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: '0.65rem',
                padding: '3px 8px',
                borderRadius: 4,
                letterSpacing: '1px',
              }}>
                AO VIVO
              </span>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.82rem',
                color: '#0D1B3E',
                margin: 0,
              }}>
                <strong>{uniqueLive.length} evento{uniqueLive.length !== 1 ? 's' : ''}</strong> encontrado{uniqueLive.length !== 1 ? 's' : ''} ao vivo via Ticketmaster
              </p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
              marginBottom: 28,
            }}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Grid de eventos */}
          {!loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
            }}>
              {allEvents.map(event => (
                <EventCard key={`${event.source}-${event.id}`} event={event} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && allEvents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              color: '#5A6A80',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '1rem',
                color: '#5A6A80',
                marginBottom: 12,
              }}>
                Nenhum evento encontrado para &ldquo;{keyword}&rdquo;
              </p>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem',
                color: '#8A9AB5',
              }}>
                Tente outro termo ou descreva a experiência abaixo — montamos o pacote do zero.
              </p>
            </div>
          )}

          {/* Info demo mode */}
          {isDemoMode && keyword && (
            <div style={{
              background: '#FFF8EC',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 12,
              padding: '14px 20px',
              marginTop: 20,
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
                Busca ao vivo não configurada — exibindo eventos curados. Adicione{' '}
                <code style={{ fontSize: '0.78rem' }}>TICKETMASTER_API_KEY</code> no{' '}
                <code style={{ fontSize: '0.78rem' }}>.env.local</code> para ativar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ROTEIRO ── */}
      <section style={{
        background: '#0D1B3E',
        padding: '56px 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            color: '#fff',
            margin: '0 0 12px',
          }}>
            Não achou o evento que procura?
          </h2>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.65)',
            margin: '0 0 28px',
          }}>
            Descreva a experiência que você quer viver e montamos o pacote do zero.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            background: '#F5A623',
            color: '#0D1B3E',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '14px 32px',
            borderRadius: 10,
            textDecoration: 'none',
          }}>
            Criar roteiro personalizado
          </Link>
        </div>
      </section>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.4) !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        div[style*="background: #EEF4FF"] { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
