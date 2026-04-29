'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Helpers ────────────────────────────────────────────────────────────────

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

// ── Destinos de aluguel de carros ──────────────────────────────────────────

interface CarDeal {
  city:          string
  country:       string
  flag:          string
  photo:         string
  priceLabel:    string   // "a partir de R$ 79/dia"
  category:      string   // "nacional" | "international"
  rentcarsSlug:  string   // slug usado na URL da Rentcars
  highlight:     string   // ex: "150+ opções"
}

// Preços pesquisados na Rentcars.com.br em abril/2026
// Rentcars agrega Localiza, Movida, Unidas, Hertz, Avis e outros
const NATIONAL_DEALS: CarDeal[] = [
  { city: 'São Paulo',      country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 79/dia',  highlight: '200+ opções', rentcarsSlug: 'sao-paulo',       photo: U('1554168848-228452c09d60') },
  { city: 'Rio de Janeiro', country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 89/dia',  highlight: '150+ opções', rentcarsSlug: 'rio-de-janeiro',  photo: U('1483729558449-99ef09a8c325') },
  { city: 'Florianópolis',  country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 95/dia',  highlight: '80+ opções',  rentcarsSlug: 'florianopolis',   photo: U('1565574337618-b08146e94992') },
  { city: 'Curitiba',       country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 85/dia',  highlight: '90+ opções',  rentcarsSlug: 'curitiba',        photo: U('1616642325314-fe17e194b380') },
  { city: 'Salvador',       country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 80/dia',  highlight: '70+ opções',  rentcarsSlug: 'salvador',        photo: U('1603237568326-e7c5adde84ff') },
  { city: 'Fortaleza',      country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 75/dia',  highlight: '75+ opções',  rentcarsSlug: 'fortaleza',       photo: U('1560971923-16c232d1ee89') },
  { city: 'Recife',         country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 80/dia',  highlight: '65+ opções',  rentcarsSlug: 'recife',          photo: U('1563455227142-d0f82238d6f8') },
  { city: 'Brasília',       country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 90/dia',  highlight: '100+ opções', rentcarsSlug: 'brasilia',        photo: U('1625426078245-6911839409dd') },
  { city: 'Manaus',         country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 95/dia',  highlight: '40+ opções',  rentcarsSlug: 'manaus',          photo: U('1700753618948-79f177a3b19e') },
  { city: 'Foz do Iguaçu',  country: 'Brasil', flag: '🇧🇷', category: 'nacional', priceLabel: 'a partir de R$ 85/dia',  highlight: '50+ opções',  rentcarsSlug: 'foz-do-iguacu',   photo: U('1538703012804-b74999aa11b9') },
]

const INTERNATIONAL_DEALS: CarDeal[] = [
  { city: 'Lisboa',          country: 'Portugal',        flag: '🇵🇹', category: 'international', priceLabel: 'a partir de R$ 130/dia', highlight: 'Multi-companhias', rentcarsSlug: 'lisboa',          photo: U('1534430480872-3498386e7856') },
  { city: 'Madri',           country: 'Espanha',         flag: '🇪🇸', category: 'international', priceLabel: 'a partir de R$ 150/dia', highlight: 'Multi-companhias', rentcarsSlug: 'madri',           photo: U('1543783207-ec64e4d8de4b') },
  { city: 'Miami',           country: 'EUA',             flag: '🇺🇸', category: 'international', priceLabel: 'a partir de R$ 110/dia', highlight: 'Multi-companhias', rentcarsSlug: 'miami',           photo: U('1533106497176-45ae19e68ba2') },
  { city: 'Orlando',         country: 'EUA',             flag: '🇺🇸', category: 'international', priceLabel: 'a partir de R$ 120/dia', highlight: 'Multi-companhias', rentcarsSlug: 'orlando',         photo: U('1605723517503-3cadb5818a0c') },
  { city: 'Buenos Aires',    country: 'Argentina',       flag: '🇦🇷', category: 'international', priceLabel: 'a partir de R$ 160/dia', highlight: 'Multi-companhias', rentcarsSlug: 'buenos-aires',    photo: U('1589909202802-8f4aadce1849') },
  { city: 'Santiago',        country: 'Chile',           flag: '🇨🇱', category: 'international', priceLabel: 'a partir de R$ 170/dia', highlight: 'Multi-companhias', rentcarsSlug: 'santiago',        photo: U('1689850543263-01a52ccc6943') },
  { city: 'Cancún',          country: 'México',          flag: '🇲🇽', category: 'international', priceLabel: 'a partir de R$ 100/dia', highlight: 'Multi-companhias', rentcarsSlug: 'cancun',          photo: U('1510097467424-192d713fd8b2') },
  { city: 'Nova York',       country: 'EUA',             flag: '🇺🇸', category: 'international', priceLabel: 'a partir de R$ 180/dia', highlight: 'Multi-companhias', rentcarsSlug: 'nova-york',       photo: U('1496442226666-8d4d0e62e6e9') },
]

// ── Categoria selecionada ──────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'nacional',      label: 'Brasil',          deals: NATIONAL_DEALS },
  { id: 'international', label: 'Internacional',   deals: INTERNATIONAL_DEALS },
]

// ── Skeleton ───────────────────────────────────────────────────────────────

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

// ── Car Deal Card ──────────────────────────────────────────────────────────

function CarDealCard({ deal }: { deal: CarDeal }) {
  const link = `https://www.rentcars.com/pt-br/?requestorid=10582&utm_source=www.golivoo.com.br&utm_medium=afiliado-link&utm_campaign=${encodeURIComponent(deal.city)}`

  return (
    <a
      href={link}
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
            alt={deal.city}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
          }} />
          <span style={{
            position: 'absolute', bottom: 10, left: 12,
            color: '#fff', fontFamily: 'Inter, sans-serif',
            fontSize: '0.82rem', fontWeight: 600,
          }}>
            {deal.flag} {deal.city}
          </span>
          {/* Carro badge */}
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
            fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 11l1.5-4.5h11L19 11M17 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M3 11h18v7H3z"/>
            </svg>
            Rentcars
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            fontWeight: 600, color: '#64748B', textTransform: 'uppercase',
            letterSpacing: '0.8px', marginBottom: 4,
          }}>
            {deal.country} · {deal.highlight}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem',
            fontWeight: 700, color: '#0F2340', marginBottom: 10,
          }}>
            {deal.city}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '1.2rem',
            fontWeight: 800, color: '#1A82D8',
          }}>
            {deal.priceLabel}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#9a9aa0', marginTop: 4,
          }}>
            Preço estimado · via Rentcars
          </div>
        </div>
      </div>
    </a>
  )
}

// ── Página principal ───────────────────────────────────────────────────────

export default function CarrosPage() {
  const [selectedCategory, setSelectedCategory] = useState('nacional')
  const [loading, setLoading]                   = useState(true)

  // Simula carregamento para ter a mesma UX que outras páginas
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
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
        padding: '64px 0 52px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,80,255,0.15)', color: '#a5b4fc',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50,
            marginBottom: 20, border: '1px solid rgba(0,80,255,0.3)',
          }}>
            Aluguel de carros
          </span>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            color: '#fff', margin: '0 0 16px',
          }}>
            Alugue um carro no seu destino
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)', maxWidth: 520,
            margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Compare as melhores locadoras em uma busca pelo Rentcars, o maior agregador do Brasil.
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
                  borderColor: selectedCategory === c.id ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
                  background: selectedCategory === c.id ? '#a5b4fc' : 'transparent',
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
                {cat.label === 'Brasil' ? 'Destinos nacionais' : 'Destinos internacionais'}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Clique em um destino para ver modelos e disponibilidade no Rentcars
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              color: '#9a9aa0', flexShrink: 0,
            }}>
              Via Rentcars.com
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {deals.map((deal, i) => (
                <CarDealCard key={`${deal.rentcarsSlug}-${i}`} deal={deal} />
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
                Quer incluir o carro no roteiro completo?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                color: '#64748B', margin: '0 0 20px', maxWidth: 420,
                marginLeft: 'auto', marginRight: 'auto',
              }}>
                Voo + hotel + carro + experiências — a Go Livoo organiza tudo por você.
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
