import Link from 'next/link'
import { WelcomeModal } from '@/components/WelcomeModal'
import HeroRoteiroForm from '@/components/HeroRoteiroForm'
import { getLatestPosts } from '@/lib/sanity-queries'
import { urlFor, type SanityBlogPost } from '@/lib/sanity'
import { getTrendingDestinations } from '@/lib/trending-destinations'
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

const filterCats = ['Todos', 'Shows & Festivais', 'Esportes', 'Automobilismo', 'Gastronomia', 'Cultura', 'Aventura', 'Ecoturismo', 'Artes']

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
      {/* ── Hero — o Roteiro é o produto principal ─────── */}
      <section style={{ padding: '56px 0 48px', background: 'var(--bg)' }}>
        <div className="wrap">
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.02,
              fontWeight: 700, letterSpacing: '-.04em', margin: '0 0 18px',
            }}>
              Você quer a{' '}
              <em style={{ fontStyle: 'normal', background: '#F5A800', padding: '0 10px', borderRadius: 6 }}>experiência</em>
              .<br />A Go Livoo resolve o resto.
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16.5, color: 'var(--ink-2)', maxWidth: 620, margin: '0 auto 30px', lineHeight: 1.65 }}>
              Diga o que quer viver — um show, um GP, uma cidade — e receba a viagem
              inteira montada: voo, hotel, documentação e o plano dia a dia.
            </p>

            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <HeroRoteiroForm />
            </div>

            <div style={{ display: 'flex', gap: 36, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#64748B', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 32, color: '#0F2340', fontWeight: 700, letterSpacing: '-.02em', display: 'block', lineHeight: 1 }}>+20</span>
                eventos internacionais<br />selecionados a dedo
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#64748B', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 32, color: '#1A82D8', fontWeight: 700, letterSpacing: '-.02em', display: 'block', lineHeight: 1 }}>+{roteiroCount}</span>
                roteiros<br />montados
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como funciona ──────────────────────────────── */}
      <section style={{ background: 'var(--bg-alt)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
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
              { step: '02', title: 'Receba o roteiro completo', desc: 'Voo + hospedagem perto do evento + documentação necessária (visto, passaporte, vacinas) + plano dia a dia, com PDF no seu e-mail.' },
              { step: '03', title: 'Reserve direto com nossos parceiros', desc: 'Você compra direto nos sites parceiros (Kiwi, Booking, Rentcars). A plataforma é gratuita — vivemos da comissão dos parceiros.' },
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

      {/* ── Experiências em alta ───────────────────────── */}
      <section style={{ padding: '56px 0 32px', background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display">Experiências em <em>alta</em></h2>
            <Link href="/eventos" className="all">Ver todos os eventos →</Link>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Eventos internacionais selecionados · o roteiro inclui voo + hotel + ingresso
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16, marginBottom: 24 }} className="feat-grid">
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

      {/* ── Ferramentas de viagem ──────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 className="display">Prefere montar por <em>partes</em>?</h2>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: 'var(--muted)', margin: '-6px 0 18px' }}>
            Ferramentas de apoio para quem já sabe o que quer: busque cada parte da viagem separadamente.
          </p>
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
          .events-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          .prods-grid { grid-template-columns: repeat(4,1fr) !important; }
          .blog-grid-home { grid-template-columns: repeat(2,1fr) !important; }
          .news-grid { grid-template-columns: 1fr !important; }
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
