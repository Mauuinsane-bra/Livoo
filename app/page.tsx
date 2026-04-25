import Link from 'next/link'
import Image from 'next/image'
import HomeEventsGrid from '@/components/HomeEventsGrid'
import { getLatestPosts } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'

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
  { icon: <PlaneIcon />,  label: 'Passagens', desc: '500+ companhias', href: '/passagens' },
  { icon: <HotelIcon />,  label: 'Hotéis',    desc: '2M+ hospedagens', href: '/hoteis' },
  { icon: <PackageIcon />,label: 'Pacotes',   desc: 'Voo + hotel combinados', href: '/pacotes' },
  { icon: <CarIcon />,    label: 'Carros',    desc: '38 locadoras', href: '/carros' },
  { icon: <BusIcon />,    label: 'Ônibus',   desc: '+200 empresas', href: '/onibus' },
  { icon: <GuideIcon />,  label: 'Guias',     desc: 'Locais em PT', href: '/guias' },
  { icon: <ShieldIcon />, label: 'Seguro',    desc: 'A partir de R$ 9/dia', href: '/prep' },
]

const destinations = [
  { name: 'Monte Carlo', sub: 'Mônaco · EU', n: 3, href: '/eventos/f1-monaco', photo: 'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Rio de Janeiro', sub: 'Brasil · SA', n: 8, href: '/eventos', photo: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80' },
  { name: 'Munique', sub: 'Alemanha · EU', n: 5, href: '/eventos', photo: 'https://images.unsplash.com/photo-1595168517039-39c27e413ea8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paris', sub: 'França · EU', n: 5, href: '/eventos', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { name: 'São Paulo', sub: 'Brasil · SA', n: 12, href: '/eventos', photo: 'https://images.unsplash.com/photo-1554168848-228452c09d60?auto=format&fit=crop&w=600&q=80' },
]

const calDays = [
  { m: 'Qua', d: '13' }, { m: 'Qui', d: '14', dot: true }, { m: 'Sex', d: '15' },
  { m: 'Sáb', d: '16', dot: true }, { m: 'Dom', d: '17' }, { m: 'Seg', d: '18' },
  { m: 'Dom', d: '24', active: true, dot: true }, { m: 'Ter', d: '26' }, { m: 'Sex', d: '29', dot: true },
]

const catalogEvents = [
  { month: 'MAI', day: '24', tag: '-17%', tagType: 'hot', cat: 'F1 · DOMINGO', rating: '4.9', title: 'GP de Mônaco — Tribuna K', loc: 'Monte Carlo, Mônaco', chips: ['Voo', 'Hotel: 4 noites', 'Ingresso', 'Heli'], price: 'R$ 12.400', parcelas: '12x sem juros', href: '/eventos/f1-monaco', bg: 'Monte Carlo' },
  { month: 'SET', day: '03', tag: 'POPULAR', tagType: '', cat: 'FESTIVAL · 3 DIAS', rating: '4.8', title: 'Rock in Rio 2026', loc: 'Rio de Janeiro · Brasil', chips: ['Voo', 'Hotel: 3 noites Copa', 'Ingresso'], price: 'R$ 1.890', parcelas: '10x sem juros', href: '/eventos/rock-in-rio', bg: 'Cidade do Rock' },
  { month: 'SET', day: '20', tag: '-22%', tagType: 'sale', cat: 'CULTURA · 16 DIAS', rating: '4.7', title: 'Oktoberfest de Munique', loc: 'Munique, Alemanha', chips: ['Voo', 'Hotel: 5 noites', 'Tenda reservada'], price: 'R$ 7.200', parcelas: '12x sem juros', href: '/eventos', bg: 'Theresienwiese' },
  { month: 'JUL', day: '17', tag: 'ÚLTIMAS 12', tagType: 'hot', cat: 'FESTIVAL · 5 DIAS', rating: '4.9', title: 'Tomorrowland 2026', loc: 'Boom, Bélgica', chips: ['Voo', 'Dreamville', 'Full Madness'], price: 'R$ 9.800', parcelas: '12x sem juros', href: '/eventos', bg: 'Dreamville' },
  { month: 'JUN', day: '15', tag: 'COPA 26', tagType: '', cat: 'FUTEBOL · 3 JOGOS', rating: '4.8', title: 'Copa do Mundo — Fase Grupos', loc: 'Cidade do México', chips: ['Voo', 'Hotel: 5 noites', '3 ingressos'], price: 'R$ 8.990', parcelas: '12x sem juros', href: '/eventos', bg: 'Cidade do México' },
  { month: 'NOV', day: '08', tag: 'AUTORAL', tagType: 'sale', cat: 'GASTRONOMIA · 7 NOITES', rating: '5.0', title: 'Rota Omakase em Tóquio', loc: 'Tóquio, Japão', chips: ['Voo', 'Hotel: Ginza', '6 balcões'], price: 'R$ 14.200', parcelas: '12x sem juros', href: '/eventos', bg: 'Ginza · Tóquio' },
]

const filterCats = ['Todos', 'Shows & Festivais', 'Esportes', 'Automobilismo', 'Gastronomia', 'Cultura', 'Aventura', 'Ecoturismo', 'Artes']

export default async function HomePage() {
  const latestPosts = (await getLatestPosts(4)) as (SanityBlogPost & { _fallbackImageUrl?: string })[]

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding: '36px 0 12px', background: 'var(--bg)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 20, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 72, lineHeight: .95,
              fontWeight: 700, letterSpacing: '-.04em', margin: 0, maxWidth: 800,
            }}>
              Um catálogo de{' '}
              <em style={{ fontStyle: 'normal', background: '#ffd600', padding: '0 10px', borderRadius: 6 }}>experiências</em>
              ,<br />com a viagem inteira junto.
            </h1>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6d6d74', textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 38, color: '#0d0d0f', fontWeight: 700, letterSpacing: '-.02em', display: 'block', lineHeight: 1 }}>128</span>
              eventos em 48 países<br />74 novos esta semana
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
            {filterCats.map((cat, i) => (
              <Link key={cat} href={i === 0 ? '/eventos' : `/eventos?cat=${encodeURIComponent(cat)}`}
                style={{
                  whiteSpace: 'nowrap', padding: '9px 16px', borderRadius: 999,
                  border: '1px solid var(--line)', background: i === 0 ? '#0d0d0f' : '#fff',
                  color: i === 0 ? '#fff' : '#0d0d0f', fontSize: 13, fontWeight: 500,
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
              background: 'linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.75) 100%), repeating-linear-gradient(135deg,#b57f4e 0 14px,#9e6d3f 14px 28px)',
              display: 'flex', alignItems: 'flex-end', color: '#fff', padding: 30, textDecoration: 'none',
            }}>
              <span style={{ position: 'absolute', top: 20, left: 20, background: '#ffd600', color: '#0d0d0f', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 999, letterSpacing: '.02em' }}>EM ALTA · 3ª semana</span>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', gap: 20 }}>
                <div style={{ maxWidth: 560 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .85, marginBottom: 10 }}>24 Mai 2026 · Domingo · 15h</div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 52, lineHeight: .98, fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 8px' }}>GP de Mônaco — F1 2026</h3>
                  <div style={{ fontSize: 15, opacity: .9 }}>Circuit de Monaco, Mônaco · Pacote 4 noites</div>
                </div>
                <span style={{ background: '#ff5722', color: '#fff', padding: '14px 20px', borderRadius: 999, fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>ver pacote · R$ 12.400 →</span>
              </div>
            </Link>

            {/* Small stack */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
              <Link href="/eventos/rock-in-rio" style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', padding: 24, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190,
                background: 'linear-gradient(160deg,#0c1d5e,#1a1fff)', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>FESTIVAL</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>03 SET · 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
                  <div>
                    <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 4px' }}>Rock in Rio 2026</h4>
                    <div style={{ fontSize: 13, opacity: .85 }}>Rio de Janeiro · Cidade do Rock</div>
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>R$ 1.890<small style={{ fontWeight: 400, fontSize: 11, opacity: .7, display: 'block', letterSpacing: '.05em', textTransform: 'uppercase' }}>a partir de</small></div>
                </div>
              </Link>

              <Link href="/eventos" style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', padding: 24, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190,
                background: 'linear-gradient(160deg,#ff5722,#ff2060)', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>-22% HOJE</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>20 SET · 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
                  <div>
                    <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 4px' }}>Oktoberfest Munique</h4>
                    <div style={{ fontSize: 13, opacity: .85 }}>Alemanha · com tenda reservada</div>
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>R$ 7.200<small style={{ fontWeight: 400, fontSize: 11, opacity: .7, display: 'block', letterSpacing: '.05em', textTransform: 'uppercase' }}>a partir de</small></div>
                </div>
              </Link>
            </div>
          </div>

          {/* Calendar strip */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 14, marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, paddingLeft: 8, whiteSpace: 'nowrap' }}>Maio<br />2026</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 6 }} className="cal-grid">
              {calDays.map(({ m, d, dot, active }) => (
                <div key={d} style={{
                  borderRadius: 10, border: `1px solid ${active ? '#0d0d0f' : 'var(--line)'}`,
                  padding: '8px 4px', textAlign: 'center', position: 'relative', cursor: 'pointer',
                  background: active ? '#0d0d0f' : 'transparent', color: active ? '#fff' : 'inherit',
                }}>
                  <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: active ? '#aaa' : 'var(--muted)', fontWeight: 600 }}>{m}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, marginTop: 1 }}>{d}</div>
                  {dot && <div style={{ width: 5, height: 5, borderRadius: 999, background: active ? '#ffd600' : '#ff5722', margin: '3px auto 0' }} />}
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
              Mostrando <strong style={{ color: 'var(--ink)' }}>48</strong> de 128 eventos · pacote inclui voo + hotel + ingresso
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{ padding: '8px 14px', border: '1px solid var(--line)', borderRadius: 10, background: '#fff', fontSize: 13, fontFamily: 'inherit', fontWeight: 500 }}>
                <option>Ordenar · Em alta</option>
                <option>Preço crescente</option>
                <option>Data mais próxima</option>
                <option>Recém-adicionados</option>
              </select>
              <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <button style={{ border: 0, borderRight: '1px solid var(--line)', padding: '8px 12px', background: '#0d0d0f', color: '#fff', fontSize: 13 }}>Grid</button>
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
                { title: 'Inclui no pacote', opts: [['Voo direto', 54, true], ['Traslado', 92, true], ['Guia falando PT', 48, false], ['Seguro incluído', 88, false]] },
              ].map(({ title, opts }) => (
                <div key={title} style={{ padding: '6px 10px 10px', borderBottom: '1px solid var(--line)' }}>
                  <h5 style={{ margin: '14px 6px 8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>{title}</h5>
                  {(opts as [string, number, boolean][]).map(([label, count, checked]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? '#0d0d0f' : 'var(--line-2)'}`, display: 'grid', placeItems: 'center', flexShrink: 0, background: checked ? '#0d0d0f' : 'transparent', color: '#fff', fontSize: 10, fontWeight: 700 }}>
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
                    background: `repeating-linear-gradient(135deg,#d6cfbb 0 12px,#c7beab 12px 24px)`,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', right: 12, bottom: 10, color: '#fff', fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(0,0,0,.5)', padding: '3px 7px', borderRadius: 4 }}>{ev.bg}</span>
                    <span className={`tag${ev.tagType === 'hot' ? ' hot' : ev.tagType === 'sale' ? ' sale' : ''}`}>{ev.tag}</span>
                    <div style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', color: 'var(--ink)', padding: '6px 10px', borderRadius: 8, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', gap: 10, alignItems: 'center', lineHeight: 1 }}>
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
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', margin: '0 0 2px', lineHeight: 1.2, color: '#0d0d0f' }}>{ev.title}</h3>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{ev.loc}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      {ev.chips.map(c => (
                        <span key={c} style={{ background: 'var(--bg)', fontSize: 10.5, padding: '3px 7px', borderRadius: 4, color: 'var(--ink-2)', fontWeight: 500 }}>{c}</span>
                      ))}
                    </div>
                    <div className="ev-foot">
                      <div className="p">{ev.price}<small style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 10.5, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase', marginTop: -2 }}>{ev.parcelas}</small></div>
                      <span className="buy">Ver pacote →</span>
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
            <Link href="/eventos" className="all">Ver todos os destinos →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }} className="dest-grid">
            {destinations.map(dest => (
              <Link key={dest.name} href={dest.href} style={{
                position: 'relative', aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden',
                color: '#fff', display: 'flex', alignItems: 'flex-end', padding: 14,
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em',
                background: '#0d0d0f', textDecoration: 'none',
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
                <span style={{ position: 'absolute', top: 12, right: 12, background: '#ffd600', color: '#0d0d0f', fontSize: 11, padding: '3px 8px', borderRadius: 999, fontWeight: 700, zIndex: 1 }}>{dest.n}</span>
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
                <span style={{ color: '#ff5722' }}>{p.icon}</span>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 700, margin: 0, letterSpacing: '-.01em' }}>{p.label}</h4>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, lineHeight: 1.35 }}>{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prep (Livoo Prep) ──────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div style={{
            background: '#0d0d0f', color: '#fff', borderRadius: 24, padding: 40,
            display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }} className="prep-grid">
            <div style={{ position: 'absolute', right: -80, bottom: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,0,.25), transparent 60%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ffd600', marginBottom: 12, position: 'relative' }}>Preparativos · Livoo Prep</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 44, fontWeight: 700, letterSpacing: '-.025em', margin: '0 0 14px', lineHeight: 1.02, position: 'relative', maxWidth: 460 }}>
                Visto, seguro, câmbio —{' '}
                <em style={{ fontStyle: 'normal', background: '#ffd600', color: '#0d0d0f', padding: '0 8px', borderRadius: 6 }}>pronto</em>.
              </h2>
              <p style={{ color: '#b6b6bd', fontSize: 14.5, maxWidth: 420, margin: '0 0 20px', position: 'relative' }}>
                Para cada evento, montamos um checklist completo com tudo o que você precisa antes do voo — e resolvemos o que quiser delegar.
              </p>
              <Link href="/prep" style={{ background: '#ffd600', color: '#0d0d0f', padding: '13px 20px', borderRadius: 999, fontWeight: 700, fontSize: 13.5, display: 'inline-flex', gap: 8, alignItems: 'center', textDecoration: 'none' }}>
                Montar checklist →
              </Link>
            </div>
            <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 8, position: 'relative' }}>
              {[
                { n: '01', t: 'Visto Schengen', sub: 'Entrada em 90 dias · emitido por nós', v: 'INCLUÍDO' },
                { n: '02', t: 'Seguro viagem', sub: 'Cobertura € 30.000 · exigido em Mônaco', v: 'R$ 147/PP' },
                { n: '03', t: 'Câmbio Euro · 0% IOF', sub: 'Cartão Livoo · € 1 = R$ 6,24', v: 'SOLICITAR' },
                { n: '04', t: 'Adaptador C/F', sub: 'Tomada europeia · entregue no hotel', v: 'R$ 89' },
                { n: '05', t: 'Chip internacional', sub: '10 GB Europa · ativação automática', v: 'R$ 129' },
              ].map((item, idx) => (
                <div key={item.n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center', padding: '11px 14px', borderTop: idx > 0 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#6c6c74', letterSpacing: '.1em' }}>{item.n}</div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>{item.t}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#9c9ca5', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#ffd600', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>{item.v}</div>
                </div>
              ))}
            </div>
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
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#ff5722' }}>
                    {post.category} · {post.readTime} min
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', margin: '6px 0', lineHeight: 1.2 }}>{post.title}</h3>
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
            background: 'linear-gradient(135deg,#ff5722,#ff2060)', color: '#fff', borderRadius: 24,
            padding: 40, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32,
            alignItems: 'center', position: 'relative', overflow: 'hidden',
          }} className="news-grid">
            <div style={{ position: 'absolute', right: -20, bottom: -40, fontFamily: 'Space Grotesk, sans-serif', fontSize: 160, fontWeight: 700, letterSpacing: '-.04em', opacity: .07, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
              GO · LIVOO
            </div>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 10px', lineHeight: 1.02 }}>
                Novos eventos toda semana. Fique por dentro.
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, maxWidth: 440, opacity: .92 }}>
                Receba curadoria de experiências + alertas de queda de preço diretamente no e-mail.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 6, display: 'flex', gap: 6 }}>
              <input placeholder="seu@email.com" style={{ flex: 1, border: 0, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#0d0d0f', outline: 'none', background: 'transparent' }} />
              <button type="button" style={{ background: '#0d0d0f', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: 0 }}>Receber</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .prod-card:hover { border-color: #0d0d0f !important; transform: translateY(-2px); }
        .blog-card:hover { border-color: #0d0d0f !important; }
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
