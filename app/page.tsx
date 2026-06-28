import Link from 'next/link'
import Image from 'next/image'
import HomeEventsGrid from '@/components/HomeEventsGrid'
import { WelcomeModal } from '@/components/WelcomeModal'
import { getLatestPosts } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'
import { getTrendingDestinations, type TrendingDestination } from '@/lib/trending-destinations'
import { getHomeEvents, monthDayLabel } from '@/lib/home-events'

// Revalida a cada 5 min — eventos adicionados/removidos no painel Sanity
// aparecem na home sem precisar de novo deploy.
export const revalidate = 300

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

// calDays gerado dinamicamente dentro do componente HomePage — usa new Date() em tempo de render

const filterCats =['Todos', 'Shows & Festivais', 'Esportes', 'Automobilismo', 'Gastronomia', 'Cultura', 'Aventura', 'Ecoturismo', 'Artes']

export default async function HomePage() {
  const [latestPostsRaw, trendingRaw, upcomingEvents] = await Promise.all([
    getLatestPosts(4),
    getTrendingDestinations('GRU', 5),
    getHomeEvents(),
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

  // Calendar strip dinâmico — gera 9 dias a partir de hoje, marca hoje como "active"
  const today = new Date()
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const calDays = Array.from({ length: 9 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return {
      m: dayNames[date.getDay()],
      d: String(date.getDate()),
      active: i === 0,
      dot: i > 0 && i % 2 === 1,
    }
  })
  const calMonthLabel = monthNames[today.getMonth()]
  const calYearLabel = String(today.getFullYear())

  const destinations = trendingRaw.length > 0
    ? trendingRaw.map(d => ({ name: d.name, sub: d.sub, price: d.price, href: d.href, photo: d.photo }))
    : FALLBACK_DESTINATIONS

  // upcomingEvents vem do getHomeEvents() (painel Sanity → fallback estático),
  // já filtrado (só futuros) e ordenado. Eventos vencidos somem sozinhos.
  const heroBig = upcomingEvents[0]
  const heroSmall = upcomingEvents.slice(1, 3)
  const heroSmallGradients = [
    'linear-gradient(160deg, rgba(12,29,94,.75), rgba(26,31,255,.7))',
    'linear-gradient(160deg, rgba(26,130,216,.7), rgba(225,29,72,.65))',
  ]

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

          {/* Featured grid — montado a partir dos eventos futuros (lib/home-events.ts) */}
          {heroBig && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16, marginBottom: 16 }} className="feat-grid">
            {/* Big card */}
            <Link href={heroBig.href} style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '16/11',
              background: `linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.75) 100%), url(${heroBig.imageUrl}) center/cover`,
              display: 'flex', alignItems: 'flex-end', color: '#fff', padding: 30, textDecoration: 'none',
            }}>
              <span style={{ position: 'absolute', top: 20, left: 20, background: '#F5A800', color: '#0F2340', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 999, letterSpacing: '.02em' }}>{heroBig.tag}</span>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', gap: 20 }}>
                <div style={{ maxWidth: 560 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .85, marginBottom: 10 }}>{monthDayLabel(heroBig.date).day} {monthDayLabel(heroBig.date).month} {heroBig.date.slice(0, 4)} · {heroBig.cat}</div>
                  <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 52, lineHeight: .98, fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 8px' }}>{heroBig.title}</h3>
                  <div style={{ fontSize: 15, opacity: .9 }}>{heroBig.loc}</div>
                </div>
                <span style={{ background: '#1A82D8', color: '#fff', padding: '14px 20px', borderRadius: 999, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>Montar roteiro →</span>
              </div>
            </Link>

            {/* Small stack */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
              {heroSmall.map((ev, i) => (
              <Link key={ev.href + ev.date} href={ev.href} style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', padding: 24, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190,
                background: `${heroSmallGradients[i % heroSmallGradients.length]}, url(${ev.imageUrl}) center/cover`, textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{ev.cat.split('·')[0].trim()}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>{monthDayLabel(ev.date).day} {monthDayLabel(ev.date).month} · {ev.date.slice(0, 4)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
                  <div>
                    <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 4px' }}>{ev.title}</h4>
                    <div style={{ fontSize: 13, opacity: .85 }}>{ev.loc}</div>
                  </div>
                  <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '9px 16px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', flexShrink: 0 }}>Ver roteiro →</span>
                </div>
              </Link>
              ))}
            </div>
          </div>
          )}

          {/* Calendar strip */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 14, marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 700, paddingLeft: 8, whiteSpace: 'nowrap' }}>{calMonthLabel}<br />{calYearLabel}</div>
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
              {upcomingEvents.map(ev => (
                <Link key={ev.title} href={ev.href} className="ev" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="ev-img" style={{
                    aspectRatio: '16/10',
                    background: ev.imageUrl
                      ? `linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.55) 100%), url(${ev.imageUrl}) center/cover`
                      : `repeating-linear-gradient(135deg,#d6cfbb 0 12px,#c7beab 12px 24px)`,
                    position: 'relative',
                  }}>
                    <span className="tag">{ev.tag}</span>
                    <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', color: 'var(--ink)', padding: '6px 10px', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', lineHeight: 1 }}>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{monthDayLabel(ev.date).month}</div>
                        <div style={{ fontSize: 20 }}>{monthDayLabel(ev.date).day}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{ev.cat}</span>
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
      {/* ── Como funciona — substituiu testemunhos fabricados em 13/mai/2026 ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 12 }}>
              Como funciona
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: 'var(--navy)', margin: 0, maxWidth: 640, marginInline: 'auto' }}>
              Você foca na experiência. A Go Livoo resolve o resto.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Descreva o que quer viver', desc: 'Não precisa saber datas, voos ou hotéis. Só o sonho — "GP de Mônaco", "Rock in Rio", "Hanami em Tóquio".' },
              { step: '02', title: 'Receba o roteiro completo', desc: 'Voo + hospedagem perto do evento + documentação necessária (visto, passaporte, vacinas) + dicas do destino. Tudo em um só lugar.' },
              { step: '03', title: 'Reserve direto com nossos parceiros', desc: 'Você compra direto nos sites parceiros (Kiwi, Booking, Rentcars). A Go Livoo é gratuita — vivemos da comissão dos parceiros.' },
            ].map((item) => (
              <div key={item.step} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, fontFamily: 'Nunito, sans-serif', letterSpacing: '0.02em' }}>{item.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: 'var(--navy)', margin: 0, lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/roteiro" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontSize: 15, fontWeight: 700 }}>
              Começar agora — é grátis
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

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
