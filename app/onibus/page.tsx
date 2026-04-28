'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Helpers ────────────────────────────────────────────────────────────────

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

// ── Rotas de ônibus ────────────────────────────────────────────────────────

interface BusDeal {
  origin:       string
  destination:  string
  destCountry:  string
  flag:         string
  photo:        string
  priceLabel:   string
  duration:     string   // "5h30" ou "12h"
  provider:     string   // "ClickBus" | "FlixBus" | "Buser"
  category:     string   // "saida-sp" | "saida-rj" | "europeu"
  link:         string
}

// Preços pesquisados no ClickBus, Buser e FlixBus em abril/2026
const DEALS_SP: BusDeal[] = [
  {
    origin: 'São Paulo', destination: 'Rio de Janeiro', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1483729558449-99ef09a8c325'), priceLabel: 'a partir de R$ 59',
    duration: '5h30', provider: 'ClickBus', category: 'saida-sp',
    link: 'https://www.clickbus.com.br/onibus/sao-paulo-sp/rio-de-janeiro-rj/',
  },
  {
    origin: 'São Paulo', destination: 'Florianópolis', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1565574337618-b08146e94992'), priceLabel: 'a partir de R$ 65',
    duration: '8h', provider: 'ClickBus', category: 'saida-sp',
    link: 'https://www.clickbus.com.br/onibus/sao-paulo-sp/florianopolis-sc/',
  },
  {
    origin: 'São Paulo', destination: 'Curitiba', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1616642325314-fe17e194b380'), priceLabel: 'a partir de R$ 49',
    duration: '5h', provider: 'Buser', category: 'saida-sp',
    link: 'https://www.buser.com.br/onibus/sao-paulo-sp',
  },
  {
    origin: 'São Paulo', destination: 'Foz do Iguaçu', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1538703012804-b74999aa11b9'), priceLabel: 'a partir de R$ 89',
    duration: '14h', provider: 'ClickBus', category: 'saida-sp',
    link: 'https://www.clickbus.com.br/onibus/sao-paulo-sp/foz-do-iguacu-pr/',
  },
  {
    origin: 'São Paulo', destination: 'Porto Alegre', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1632415978225-ffe0d0f2703e'), priceLabel: 'a partir de R$ 99',
    duration: '16h', provider: 'ClickBus', category: 'saida-sp',
    link: 'https://www.clickbus.com.br/onibus/sao-paulo-sp/porto-alegre-rs/',
  },
  {
    origin: 'São Paulo', destination: 'Belo Horizonte', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1568688503154-9edd877da0c7'), priceLabel: 'a partir de R$ 55',
    duration: '7h', provider: 'Buser', category: 'saida-sp',
    link: 'https://www.buser.com.br/onibus/sao-paulo-sp',
  },
]

const DEALS_RJ: BusDeal[] = [
  {
    origin: 'Rio de Janeiro', destination: 'São Paulo', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1554168848-228452c09d60'), priceLabel: 'a partir de R$ 59',
    duration: '5h30', provider: 'ClickBus', category: 'saida-rj',
    link: 'https://www.clickbus.com.br/onibus/rio-de-janeiro-rj/sao-paulo-sp/',
  },
  {
    origin: 'Rio de Janeiro', destination: 'Belo Horizonte', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1568688503154-9edd877da0c7'), priceLabel: 'a partir de R$ 45',
    duration: '5h', provider: 'ClickBus', category: 'saida-rj',
    link: 'https://www.clickbus.com.br/onibus/rio-de-janeiro-rj/belo-horizonte-mg/',
  },
  {
    origin: 'Rio de Janeiro', destination: 'Florianópolis', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1565574337618-b08146e94992'), priceLabel: 'a partir de R$ 79',
    duration: '12h', provider: 'ClickBus', category: 'saida-rj',
    link: 'https://www.clickbus.com.br/onibus/rio-de-janeiro-rj/florianopolis-sc/',
  },
  {
    origin: 'Rio de Janeiro', destination: 'Curitiba', destCountry: 'Brasil', flag: '🇧🇷',
    photo: U('1616642325314-fe17e194b380'), priceLabel: 'a partir de R$ 69',
    duration: '10h', provider: 'ClickBus', category: 'saida-rj',
    link: 'https://www.clickbus.com.br/onibus/rio-de-janeiro-rj/curitiba-pr/',
  },
]

const DEALS_EUROPA: BusDeal[] = [
  {
    origin: 'Lisboa', destination: 'Madri', destCountry: 'Espanha', flag: '🇪🇸',
    photo: U('1543783207-ec64e4d8de4b'), priceLabel: 'a partir de €9',
    duration: '7h', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/lisbon-madrid',
  },
  {
    origin: 'Paris', destination: 'Amsterdã', destCountry: 'Holanda', flag: '🇳🇱',
    photo: U('1512470876302-972faa2aa9a4'), priceLabel: 'a partir de €14',
    duration: '4h', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/paris-amsterdam',
  },
  {
    origin: 'Amsterdã', destination: 'Berlim', destCountry: 'Alemanha', flag: '🇩🇪',
    photo: U('1560969184-10fe8719e047'), priceLabel: 'a partir de €12',
    duration: '6h', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/amsterdam-berlin',
  },
  {
    origin: 'Roma', destination: 'Florença', destCountry: 'Itália', flag: '🇮🇹',
    photo: U('1552832230-c0197dd311b5'), priceLabel: 'a partir de €8',
    duration: '3h30', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/rome-florence',
  },
  {
    origin: 'Barcelona', destination: 'Madrid', destCountry: 'Espanha', flag: '🇪🇸',
    photo: U('1543783207-ec64e4d8de4b'), priceLabel: 'a partir de €10',
    duration: '6h', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/barcelona-madrid',
  },
  {
    origin: 'Madri', destination: 'Lisboa', destCountry: 'Portugal', flag: '🇵🇹',
    photo: U('1534430480872-3498386e7856'), priceLabel: 'a partir de €9',
    duration: '7h', provider: 'FlixBus', category: 'europeu',
    link: 'https://global.flixbus.com/bus/madrid-lisbon',
  },
]

// ── Categorias ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'saida-sp',  label: 'Saindo de SP',      deals: DEALS_SP },
  { id: 'saida-rj',  label: 'Saindo do Rio',      deals: DEALS_RJ },
  { id: 'europeu',   label: 'Europa (FlixBus)',    deals: DEALS_EUROPA },
]

// ── Componentes ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ height: 160, background: '#f0efeb' }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ height: 12, background: '#f0efeb', borderRadius: 6, marginBottom: 8, width: '50%' }} />
        <div style={{ height: 22, background: '#f0efeb', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 28, background: '#fde8e0', borderRadius: 6, width: '65%' }} />
      </div>
    </div>
  )
}

function BusDealCard({ deal }: { deal: BusDeal }) {
  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        {/* Foto */}
        <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#0F2340' }}>
          <img
            src={deal.photo}
            alt={deal.destination}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          }} />
          <span style={{
            position: 'absolute', bottom: 10, left: 12,
            color: '#fff', fontFamily: 'Inter, sans-serif',
            fontSize: '0.82rem', fontWeight: 600,
          }}>
            {deal.flag} {deal.destination}
          </span>
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
            fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            letterSpacing: '0.5px',
          }}>
            {deal.provider}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            fontWeight: 600, color: '#64748B', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 4,
          }}>
            {deal.origin} → {deal.destination}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
            fontWeight: 700, color: '#0F2340', marginBottom: 10,
          }}>
            {deal.destination}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '1.3rem',
            fontWeight: 800, color: '#1A82D8',
          }}>
            {deal.priceLabel}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', marginTop: 4,
          }}>
            Duração: {deal.duration} · via {deal.provider}
          </div>
        </div>
      </div>
    </a>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

export default function OnibusPage() {
  const [selectedCategory, setSelectedCategory] = useState('saida-sp')
  const [loading, setLoading]                   = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [selectedCategory])

  const cat   = CATEGORIES.find(c => c.id === selectedCategory)!
  const deals = cat.deals

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #7c3aed 60%, #a78bfa 100%)',
        padding: '64px 0 52px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.15)', color: '#c4b5fd',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 20, border: '1px solid rgba(124,58,237,0.3)',
          }}>
            Passagens de ônibus
          </span>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            color: '#fff', margin: '0 0 16px',
          }}>
            Rotas de ônibus em destaque
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)', maxWidth: 520,
            margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            As rotas mais procuradas no Brasil pelo ClickBus e Buser. Para a Europa, use o FlixBus — o maior da região.
          </p>

          {/* Seletor de categoria */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                  fontWeight: 600, padding: '9px 18px', borderRadius: 100,
                  border: '1.5px solid',
                  borderColor: selectedCategory === c.id ? '#c4b5fd' : 'rgba(255,255,255,0.3)',
                  background: selectedCategory === c.id ? '#c4b5fd' : 'transparent',
                  color: selectedCategory === c.id ? '#0F2340' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALS GRID ────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{
                fontFamily: 'Nunito, sans-serif', fontSize: '1.35rem',
                fontWeight: 700, color: '#0F2340', margin: '0 0 4px',
              }}>
                {cat.label}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Clique para ver horários e comprar a passagem diretamente na plataforma
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              color: '#9a9aa0', flexShrink: 0,
            }}>
              {selectedCategory === 'europeu' ? 'Via FlixBus' : 'Via ClickBus · Buser'}
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {deals.map((deal, i) => (
                <BusDealCard key={`${deal.origin}-${deal.destination}-${i}`} deal={deal} />
              ))}
            </div>
          )}

          {/* CTA roteiro */}
          {!loading && (
            <div style={{
              marginTop: 48, background: '#fff', borderRadius: 16,
              border: '1px solid #E2E8F0', padding: '32px',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif', fontSize: '1.15rem',
                fontWeight: 700, color: '#0F2340', margin: '0 0 10px',
              }}>
                Quer montar o roteiro completo com ônibus?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                color: '#64748B', margin: '0 0 20px', maxWidth: 420,
                marginLeft: 'auto', marginRight: 'auto',
              }}>
                Descreva a experiência que você quer ter e a Go Livoo organiza voos, ônibus, hotel e mais.
              </p>
              <Link
                href="/roteiro"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '14px 32px', textDecoration: 'none', fontSize: '0.95rem' }}
              >
                Montar roteiro completo →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
