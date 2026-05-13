import Link from 'next/link'
import Image from 'next/image'
import HomeEventsGrid from '@/components/HomeEventsGrid'
import { Testimonials } from '@/components/Testimonials'
import { WelcomeModal } from '@/components/WelcomeModal'
import { getLatestPosts } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'
import { getTrendingDestinations, type TrendingDestination } from '@/lib/trending-destinations'

function blogImgUrl(post: SanityBlogPost & { _fallbackImageUrl?: string }): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(600).url() } catch { /* empty */ }
  }
  return post._fallbackImageUrl ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'
}

/* ── SVG icons for products ──────────────────────────── */
const PlaneIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M14.5 8L9 6V2.5a1 1 0 10-2 0V6L1.5 8v1.5L7 8.5V12l-1.5 1v1L8 13.5l2.5.5v-1L9 12V8.5l5.5 1z"/>
  </svg>
)
const HotelIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M2 3h12v10h-2v-3H4v3H2V3zm2 2v3h3V5H4zm5 0v3h3V5H9z"/>
  </svg>
)
const PackageIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M8 1l7 3v8l-7 3-7-3V4l7-3zm0 2.2L3.3 5 8 6.8 12.7 5 8 3.2zM2.5 6.3v5.8L7 14V8.2L2.5 6.3zm11 0L9 8.2V14l4.5-1.9V6.3z"/>
  </svg>
)
const CarIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M3 5l1-2h8l1 2h1v6h-2v1h-2v-1H6v1H4v-1H2V5h1zm.5 1L3 8h10l-.5-2h-9zM4 9a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"/>
  </svg>
)
const BusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M3 2h10a1 1 0 011 1v9a1 1 0 01-1 1v1h-2v-1H5v1H3v-1a1 1 0 01-1-1V3a1 1 0 011-1zm0 2v4h10V4H3zm1.5 5a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z"/>
  </svg>
)
const GuideIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M8 2a3 3 0 100 6 3 3 0 000-6zM2 14c0-3 3-5 6-5s6 2 6 5H2z"/>
  </svg>
)
const ShieldIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M8 1l6 2v5c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V3l6-2z"/>
  </svg>
)

const products = [
  { icon: <PlaneIcon />,  label: 'Passagens', desc: 'Busca de passagens', href: '/passagens' },
  { icon: <HotelIcon />,  label: 'Hotéis',    desc: 'Hotéis ao redor do mundo', href: '/hoteis' },
  { icon: <PackageIcon />,label: 'Roteiros',  desc: 'Roteiro personalizado por IA', href: '/roteiros-curados' },
  { icon: <CarIcon />,    label: 'Carros',    desc: '38 locadoras', href: '/carros' },
  { icon: <BusIcon />,    label: 'Ônibus',   desc: 'Brasil e Europa', href: '/onibus' },
  { icon: <GuideIcon />,  label: 'Guias',     desc: 'Locais em PT', href: '/guias' },
  { icon: <ShieldIcon />, label: 'Documentação', desc: 'Visto, vacinas e docs', href: '/roteiro' },
]

// Fallback estático caso a API Travelpayouts esteja offline
const FALLBACK_DESTINATIONS = [
  { name: 'Lisboa', sub: 'Portugal · EU', price: 0, href: '/explorar-destinos', photo: 'https://images.unsplash.com/photo-1518241354-e57c7e99e5ce?auto=format&fit=crop&w=600&q=80' },
  { name: 'Buenos Aires', sub: 'Argentina · SA', price: 0, href: '/explorar-destinos', photo: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paris', sub: 'França · EU', price: 0, href: '/explorar-destinos', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { name: 'Miami', sub: 'EUA · NA', price: 0, href: '/explorar-destinos', photo: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Santiago', sub: 'Chile · SA', price: 0, href: '/explorar-destinos', photo: 'https://images.unsplash.com/photo-1689850543263-01a52ccc6943?auto=format&fit=crop&w=600&q=80' },
]

const calDays = [
  { m: 'Qua', d: '13' }, { m: 'Qui', d: '14', dot: true }, { m: 'Sex', d: '15' },
  { m: 'Sáb', d: '16', dot: true }, { m: 'Dom', d: '17' }, { m: 'Seg', d: '18' },
  { m: 'Dom', d: '24', active: true, dot: true }, { m: 'Ter', d: '26' }, { m: 'Sex', d: '29', dot: true },
]

const catalogEvents = [
  { month: 'MAI', day: '24', tag: 'Mônaco 2026', tagType: '', cat: 'F1 · DOMINGO', rating: '', title: 'GP de Mônaco — Tribuna K', loc: 'Monte Carlo, Mônaco', chips: ['Voo', 'Hotel: 4 noites', 'Ingresso', 'Heli'], href: '/eventos/f1-monaco', imageUrl: 'https://images.unsplash.com/photo-1752884991193-f40e0018e483?auto=format&fit=crop&w=600&q=80' },
  { month: 'SET', day: '03', tag: 'POPULAR', tagType: '', cat: 'FESTIVAL · 3 DIAS', rating: '', title: 'Rock in Rio 2026', loc: 'Rio de Janeiro · Brasil', chips: ['Voo', 'Hotel: 3 noites Copa', 'Ingresso'], href: '/eventos/rock-in-rio', imageUrl: 'https://images.unsplash.com/photo-1521547480571-2b6061babf76?auto=format&fit=crop&w=600&q=80' },
  { month: 'OUT', day: '03', tag: 'Outubro 2026', tagType: '', cat: 'CULTURA · 16 DIAS', rating: '', title: 'Oktoberfest de Munique', loc: 'Munique, Alemanha', chips: ['Voo', 'Hotel: 5 noites', 'Tenda reservada'], href: '/eventos', imageUrl: 'https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?auto=format&fit=crop&w=600&q=80' },
  { month: 'JUL', day: '17', tag: 'Julho 2026', tagType: '', cat: 'FESTIVAL · 5 DIAS', rating: '', title: 'Tomorrowland 2026', loc: 'Boom, Bélgica', chips: ['Voo', 'Dreamville', 'Full Madness'], href: '/eventos', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' },
  { month: 'JUN', day: '15', tag: 'COPA 26', tagType: '', cat: 'FUTEBOL · 3 JOGOS', rating: '', title: 'Copa do Mundo — Fase Grupos', loc: 'Cidade do México', chips: ['Voo', 'Hotel: 5 noites', '3 ingressos'], href: '/eventos', imageUrl: 'https://images.unsplash.com/photo-1556816213-354f013c9d40?auto=format&fit=crop&w=600&q=80' },
  { month: 'NOV', day: '08', tag: 'Novembro 2026', tagType: '', cat: 'GASTRONOMIA · 7 NOITES', rating: '', title: 'Rota Omakase em Tóquio', loc: 'Tóquio, Japão', chips: ['Voo', 'Hotel: Ginza', '6 balcões'], href: '/eventos', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' },
]

const filterCats = ['Todos', 'Shows & Festivais', 'Esportes', 'Automobilismo', 'Gastronomia', 'Cultura', 'Aventura', 'Ecoturismo', 'Artes']

export default async function HomePage() {
  const [latestPostsRaw, trendingRaw] = await Promise.all([
    getLatestPosts(4),
    getTrendingDestinations('GRU', 5),
  ])
  const latestPosts = latestPostsRaw as (SanityBlogPost & { _fallbackImageUrl?: string })[]

  // Contador de roteiros gerados
  let roteiroCount = 47
  try {
    const statsRes = await fetch(
      `${process.env.NEXT_PUBLIC_URL || 'https://livoo-two.vercel.app'}/api/stats`,
      { next: { revalidate: 300 } }
    )
    if (statsRes.ok) {
      const statsJson = await statsRes.json()
      roteiroCount = statsJson.count ?? 47
    }
  } catch { /* silencia — fallback */ }
  const destinations = trendingRaw.length > 0
    ? trendingRaw.map(d => ({ name: d.name, sub: d.sub, price: d.price, href: d.href, photo: d.photo }))
    : FALLBACK_DESTINATIONS

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding: '36px 0 12px', background: 'var(--bg)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 20, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: 72, lineHeight: .95,
              fontWeight: 700, letterSpacing: '-.04em', margin: 0, maxWidth: 800,
            }}>
              Um catálogo de{' '}
              <em style={{ fontStyle: 'normal', background: '#F5A800', padding: '0 10px', borderRadius: 6 }}>experiências</em>
              ,<br />com a viagem inteira junto.
            </h1>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexShrink: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 38, color: '#0F2340', fontWeight: 700, letterSpacing: '-.02em', display: 'block', lineHeight: 1 }}>+20</span>
                eventos internacionais<br />selecionados a dedo
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 38, color: '#1A82D8', fontWeight: 700, letterSpacing: '-.02em', display: 'block', lineHeight: 1 }}>+{roteiroCount}</span>
                roteiros<br />montados
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
            {filterCats.map((cat, i) => (
              <Link key={cat} href={i === 0 ? '/eventos' : `/eventos?cat=${encodeURIComponent(cat)}`}
                style={{
                  whiteSpace: 'nowrap', padding: '9px 16px', borderRadius: 999,
                  border: '1px solid var(--line)', background: i === 0 ? '#0F2340' : '#fff',
                  color: i === 0 ? '#fff' : '#0F2340', fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Featured grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16, marginBottom: 16 }} className="feat-grid">
            {/* Big card */}
            <Link href="/eventos/f1-monaco" style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '16/11',
              background: 'linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.75) 100%), url(https://images.unsplash.com/photo-1752884991193-f40e0018e483?auto=format&fit=crop&w=900&q=80) center/cover',
              display: 'flex', alignItems: 'flex-end', color: '#fff', padding: 30, textDecoration: 'none',
            }}>
              <span style={{ position: 'absolute', top: 20, left: 20, background: '#F5A800', color: '#0F2340', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 999, letterSpacing: '.02em' }}>Mônaco · Maio 2026</span>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', gap: 20 }}>
                <div style={{ maxWidth: 560 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .85, marginBottom: 10 }}>24 Mai 2026 · Domingo · 15h</div>
                  <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 52, lineHeight: .98, fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 8px' }}>GP de Mônaco — F1 2026</h3>
                  <div style={{ fontSize: 15, opacity: .9 }}>Circuit de Monaco, Mônaco · Roteiro 4 noites</div>
                </div>
                <span style={{ background: '#1A82D8', color: '#fff', padding: '14px 20px', borderRadius: 999, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>Montar roteiro →</span>
              </div>
            </Link>

            {/* Small stack */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
              <Link href="/eventos/rock-in-rio" style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', padding: 24, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190,
                background: 'linear-gradient(160deg, rgba(12,29,94,.75), rgba(26,31,255,.7)), url(https://images.unsplash.com/photo-1521547480571-2b6061babf76?auto=format&fit=crop&w=600&q=80) center/cover', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>FESTIVAL</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>03 SET · 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
                  <div>
                    <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 4px' }}>Rock in Rio 2026</h4>
                    <div style={{ fontSize: 13, opacity: .85 }}>Rio de Janeiro · Cidade do Rock</div>
                  </div>
                  <Link href="/eventos/rock-in-rio" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '9px 16px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}>Ver roteiro →</Link>
                </div>
              </Link>

              <Link href="/eventos" style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', padding: 24, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190,
                background: 'linear-gradient(160deg, rgba(26,130,216,.7), rgba(225,29,72,.65)), url(https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?auto=format&fit=crop&w=600&q=80) center/cover', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>CULTURA</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>SET–OUT · 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
                  <div>
                    <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 4px' }}>Oktoberfest Munique</h4>
                    <div style={{ fontSize: 13, opacity: .85 }}>Alemanha · com tenda reservada</div>
                  </div>
                  <Link href="/eventos" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '9px 16px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}>Ver roteiro →</Link>
                </div>
              </Link>
            </div>
          </div>

          {/* Calendar strip */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 14, marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 700, paddingLeft: 8, whiteSpace: 'nowrap' }}>Maio<br />2026</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 6 }} className="cal-grid">
              {calDays.map(({ m, d, dot, active }) => (
                <div key={d} style={{
                  borderRadius: 10, border: `1px solid ${active ? '#0F2340' : 'var(--line)'}`,
                  padding: '8px 4px', textAlign: 'center', position: 'relative', cursor: 'pointer',
                  background: active ? '#0F2340' : 'transparent', color: active ? '#fff' : 'inherit',
                }}>
                  <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: active ? '#aaa' : 'var(--muted)', fontWeight: 600 }}>{m}</div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 700, marginTop: 1 }}>{d}</div>
                  {dot && <div style={{ width: 5, height: 5, borderRadius: 999, background: active ? '#F5A800' : '#1A82D8', margin: '3px auto 0' }} />}
                </div>
              ))}
            </div>
            <Link href="/eventos" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--muted)', textDecoration: 'none', flexShrink: 0, fontSize: 18 }}>›</Link>
          </div>
        </div>
      </section>

      {/* ── Catalog grid ───────────────────────────────── */}
      <section style={{ paddingTop: 20, paddingBottom: 32, background: 'var(--bg)' }}>
        <div className="wrap">
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '28px 0 14px', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              Eventos internacionais selecionados · roteiro inclui voo + hotel + ingresso
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{ padding: '8px 14px', border: '1px solid var(--line)', borderRadius: 10, background: '#fff', fontSize: 13, fontFamily: 'inherit', fontWeight: 500 }}>
                <option>Ordenar · Em alta</option>
                <option>Data mais próxima</option>
                <option>Recém-adicionados</option>
              </select>
              <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <button style={{ border: 0, borderRight: '1px solid var(--line)', padding: '8px 12px', background: '#0F2340', color: '#fff', fontSize: 13 }}>Grid</button>
                <button style={{ border: 0, padding: '8px 12px', fontSize: 13 }}>Lista</button>
              </div>
            </div>
          </div>

          {/* Layout: filter rail + grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }} className="catalog-layout">
            {/* Filter rail */}
            <aside style={{ position: 'sticky', top: 80, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 6 }} className="filter-rail">
              {[
                { title: 'Categoria', opts: [['Shows & Festivais', 42, true], ['Esportes', 34, true], ['Automobilismo', 12, false], ['Gastronomia', 18, false], ['Cultura', 7, false], ['Aventura', 15, false]] },
                { title: 'Continente', opts: [['América do Sul', 38, true], ['Europa', 54, true], ['América do Norte', 22, false], ['Ásia', 10, false]] },
                { title: 'Período', opts: [['Próximos 30 dias', 22, true], ['2º semestre 2026', 86, true], ['2027', 20, false]] },
                { title: 'O que inclui', opts: [['Voo direto', 54, true], ['Traslado', 92, true], ['Guia falando PT', 48, false], ['Seguro incluído', 88, false]] },
              ].map(({ title, opts }) => (
                <div key={title} style={{ padding: '6px 10px 10px', borderBottom: '1px solid var(--line)' }}>
                  <h5 style={{ margin: '14px 6px 8px', fontFamily: 'Nunito, sans-serif', fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>{title}</h5>
                  {(opts as [string, number, boolean][]).map(([label, count, checked]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? '#0F2340' : 'var(--line-2)'}`, display: 'grid', placeItems: 'center', flexShrink: 0, background: checked ? '#0F2340' : 'transparent', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                        {checked && '✓'}
                      </span>
                      {label}
                      <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--muted)' }}>{count}</span>
                    </div>
                  ))}
                </div>
              ))}
            </aside>

            {/* Event cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="events-grid">
              {catalogEvents.map(ev => (
                <Link key={ev.title} href={ev.href} className="ev" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="ev-img" style={{
                    aspectRatio: '16/10',
                    background: ev.imageUrl
                      ? `linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.55) 100%), url(${ev.imageUrl}) center/cover`
                      : `repeating-linear-gradient(135deg,#d6cfbb 0 12px,#c7beab 12px 24px)`,
                    position: 'relative',
                  }}>
                    <span className={`tag${ev.tagType === 'hot' ? ' hot' : ev.tagType === 'sale' ? ' sale' : ''}`}>{ev.tag}</span>
                    <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', color: 'var(--ink)', padding: '6px 10px', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', lineHeight: 1 }}>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{ev.month}</div>
                        <div style={{ fontSize: 20 }}>{ev.day}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{ev.cat}</span>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{ev.rating}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', margin: '0 0 2px', lineHeight: 1.2, color: '#0F2340' }}>{ev.title}</h3>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{ev.loc}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      {ev.chips.map(c => (
                        <span key={c} style={{ background: 'var(--bg)', fontSize: 10.5, padding: '3px 7px', borderRadius: 4, color: 'var(--ink-2)', fontWeight: 500 }}>{c}</span>
                      ))}
                    </div>
                    <div className="ev-foot">
                      <span className="buy" style={{ width: '100%', textAlign: 'center' }}>Montar roteiro →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/eventos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', background: '#fff', border: '1px solid var(--line)', borderRadius: 999, fontWeight: 600, fontSize: 13.5 }}>
              Ver mais eventos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Destinos ───────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display">Destinos em <em>alta</em></h2>
            <Link href="/explorar-destinos" className="all">Ver todos os destinos →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }} className="dest-grid">
            {destinations.map(dest => (
              <Link key={dest.name} href={dest.href} style={{
                position: 'relative', aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden',
                color: '#fff', display: 'flex', alignItems: 'flex-end', padding: 14,
                fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em',
                background: '#0F2340', textDecoration: 'none',
              }}>
                {/* Foto de fundo */}
                <img
                  src={dest.photo}
                  alt={dest.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                />
                {/* Gradiente sobre a foto */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.72) 100%)' }} />
                {/* Conteúdo */}
                {dest.price > 0 && (
                  <span style={{ position: 'absolute', top: 12, right: 12, background: '#F5A800', color: '#0F2340', fontSize: 11, padding: '3px 8px', borderRadius: 999, fontWeight: 700, zIndex: 1 }}>
                    {'R$ ' + dest.price.toLocaleString('pt-BR')}
                  </span>
                )}
                <span style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 500, opacity: .85, zIndex: 1 }}>{dest.sub}</span>
                <span style={{ position: 'relative', zIndex: 1 }}>{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produtos ───────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display">Prefere buscar por <em>tipo</em>?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }} className="prods-grid">
            {products.map(p => (
              <Link key={p.label} href={p.href} className="prod-card" style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120, textAlign: 'left',
                textDecoration: 'none', color: 'inherit', transition: 'border-color .15s, transform .15s',
              }}>
                <span style={{ color: '#1A82D8' }}>{p.icon}</span>
                <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13.5, fontWeight: 700, margin: 0, letterSpacing: '-.01em' }}>{p.label}</h4>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, lineHeight: 1.35 }}>{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ───────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display">Do <em>blog</em>, esta semana</h2>
            <Link href="/blog" className="all">Ver tudo →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="blog-grid-home">
            {latestPosts.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="blog-card" style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden',
                textDecoration: 'none', color: 'inherit', transition: 'border-color .15s',
                display: 'block',
              }}>
                <div style={{
                  aspectRatio: '4/3',
                  background: `url(${blogImgUrl(post)}) center/cover, repeating-linear-gradient(135deg,#d6cfbb 0 10px,#c7beab 10px 20px)`,
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', right: 10, bottom: 8, fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', background: 'rgba(0,0,0,.55)', padding: '3px 6px', borderRadius: 4 }}>{post.category}</span>
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1A82D8' }}>
                    {post.category} · {post.readTime} min
                  </div>
                  <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', margin: '6px 0', lineHeight: 1.2 }}>{post.title}</h3>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <Testimonials />

      {/* ── Newsletter ─────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 56 }}>
        <div className="wrap">
          <div style={{
            background: 'linear-gradient(135deg,#1A82D8,#E11D48)', color: '#fff', borderRadius: 24,
            padding: 40, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32,
            alignItems: 'center', position: 'relative', overflow: 'hidden',
          }} className="news-grid">
            <div style={{ position: 'absolute', right: -20, bottom: -40, fontFamily: 'Nunito, sans-serif', fontSize: 160, fontWeight: 700, letterSpacing: '-.04em', opacity: .07, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
              GO · LIVOO
            </div>
            <div>
              <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 10px', lineHeight: 1.02 }}>
                Novos eventos toda semana. Fique por dentro.
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, maxWidth: 440, opacity: .92 }}>
                Receba curadoria de experiências + alertas de queda de preço diretamente no e-mail.
              </p>
            </div>
            <div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 6, display: 'flex', gap: 6 }}>
                <input placeholder="seu@email.com" style={{ flex: 1, border: 0, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#0F2340', outline: 'none', background: 'transparent' }} />
                <button type="button" style={{ background: '#0F2340', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: 0 }}>Receber</button>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9a9aa0', margin: '6px 0 0' }}>
                Ao assinar, você concorda com nossa{' '}
                <a href="/privacidade" style={{ color: '#1A82D8', textDecoration: 'underline' }}>Política de Privacidade</a>.
                Cancele quando quiser.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WelcomeModal />

      <style>{`
        .prod-card:hover { border-color: #0F2340 !important; transform: translateY(-2px); }
        .blog-card:hover { border-color: #0F2340 !important; }
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .catalog-layout { grid-template-columns: 1fr !important; }
          .filter-rail { position: static !important; display: none; }
          .events-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          .prods-grid { grid-template-columns: repeat(4,1fr) !important; }
          .blog-grid-home { grid-template-columns: repeat(2,1fr) !important; }
          .prep-grid { grid-template-columns: 1fr !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .cal-grid { grid-template-columns: repeat(5,1fr) !important; }
        }
        @media (max-width: 600px) {
          .events-grid { grid-template-columns: 1fr !important; }
          .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          .prods-grid { grid-template-columns: repeat(2,1fr) !important; }
          .blog-grid-home { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
