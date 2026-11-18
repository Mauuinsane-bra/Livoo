'use client'

import { useState, useEffect } from 'react'
import { SignedIn } from '@clerk/nextjs'

// ── Tipos (espelha CheapFlight de /api/cheap-flights) ───────────────────────
interface FlightDeal {
  origin: string
  destination: string
  destinationCity: string
  destinationCountry: string
  destinationPhoto: string
  price: number
  currency: string
  airline: string
  stops: number
  departDate: string
  returnDate: string
  isRoundTrip: boolean
  link: string
  region: string
}

interface Meta {
  dest: string; name: string; country: string
  dream: number; good: number
  price: number | null; link?: string; departAt?: string
}

// ── Origens ─────────────────────────────────────────────────────────────────
const ORIGINS = [
  { iata: 'CWB', city: 'Curitiba' },
  { iata: 'GRU', city: 'São Paulo' },
  { iata: 'FLN', city: 'Florianópolis' },
  { iata: 'GIG', city: 'Rio de Janeiro' },
  { iata: 'BSB', city: 'Brasília' },
  { iata: 'POA', city: 'Porto Alegre' },
]

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
function fmtDate(d: string): string {
  if (!d || d.length < 10) return ''
  const [, m, day] = d.split('-')
  return parseInt(day, 10) + ' ' + (MES[parseInt(m, 10) - 1] || '')
}
function brl(v: number): string {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}
function tripLine(d: FlightDeal): string {
  const stops = d.stops === 0 ? 'Direto' : d.stops + ' parada' + (d.stops > 1 ? 's' : '')
  return [stops, d.airline, fmtDate(d.departDate)].filter(Boolean).join('  ·  ')
}

// ── Ícones ──────────────────────────────────────────────────────────────────
const IcoArrow = () => <svg className="ico" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const IcoPin = () => <svg className="ico" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const IcoDown = () => <svg className="ico" viewBox="0 0 24 24"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
const IcoPlane = () => <svg className="ico" viewBox="0 0 24 24" style={{ width: 19, height: 19 }}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>

// ── Faixa "Minhas metas" (só logado) ────────────────────────────────────────
function MinhasMetas() {
  const [metas, setMetas] = useState<Meta[]>([])
  useEffect(() => {
    fetch('/api/deals/metas')
      .then(r => r.json())
      .then(d => setMetas(d.routes ?? []))
      .catch(() => setMetas([]))
  }, [])

  if (metas.length === 0) return null

  return (
    <section className="wrap sec">
      <div className="shead"><h2>Minhas <span className="c">metas</span></h2><span className="n">via GRU · mar–mai 2027</span></div>
      <div className="metas">
        {metas.map(m => {
          const hasPrice = m.price !== null
          const pct = hasPrice ? Math.min(100, Math.round((m.dream / (m.price as number)) * 100)) : 0
          const falta = hasPrice ? Math.round((((m.price as number) - m.dream) / m.dream) * 100) : 0
          return (
            <div className="meta" key={m.dest}>
              <div className="co">{m.country}</div>
              <div className="city">{m.name}</div>
              <div className="num">{hasPrice ? brl(m.price as number) : '—'}</div>
              <div className="tg"><IcoDown />{hasPrice ? `meta ${brl(m.dream)} · falta ${falta}%` : `meta ${brl(m.dream)} · sem oferta`}</div>
              <div className="bar"><i style={{ width: pct + '%' }} /></div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Card de promoção ─────────────────────────────────────────────────────────
function DealCard({ deal, tag }: { deal: FlightDeal; tag: string | null }) {
  return (
    <a className="deal" href={deal.link} target="_blank" rel="noopener noreferrer">
      <div className="ph">
        <img src={deal.destinationPhoto} alt={deal.destinationCity} loading="lazy" />
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div className="bd">
        <div className="co">{deal.destinationCountry}</div>
        <div className="city">{deal.destinationCity}</div>
        <div className="trip">{tripLine(deal)}</div>
        <div className="foot">
          <div className="pr">{brl(deal.price)}<small>{deal.isRoundTrip ? 'ida e volta' : 'só ida'}</small></div>
          <span className="go">Ver<IcoArrow /></span>
        </div>
      </div>
    </a>
  )
}

// ── Página ───────────────────────────────────────────────────────────────────
export default function PromocoesPage() {
  const [origin, setOrigin] = useState('CWB')
  const [deals, setDeals] = useState<FlightDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true); setError(false)
    fetch('/api/cheap-flights?origin=' + origin)
      .then(r => r.json())
      .then(d => { if (active) setDeals(d.flights ?? []) })
      .catch(() => { if (active) { setError(true); setDeals([]) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [origin])

  const originCity = ORIGINS.find(o => o.iata === origin)?.city ?? origin

  return (
    <div className="promo">
      <style>{CSS}</style>

      <div className="hero"><div className="wrap">
        <div className="kick"><IcoPin />Radar de passagens</div>
        <h1>As promoções de hoje, saindo de onde você voa.</h1>
        <div className="ops">
          <span className="lbl">Origem:</span>
          {ORIGINS.map(o => (
            <button key={o.iata} className={'pill' + (o.iata === origin ? ' on' : '')} onClick={() => setOrigin(o.iata)}>
              {o.city}
            </button>
          ))}
        </div>
        <div className="upd">Preços em cache · atualizados ao longo do dia · compra no Kiwi.com</div>
      </div></div>

      <SignedIn><MinhasMetas /></SignedIn>

      <section className="wrap sec">
        <div className="shead">
          <IcoPlane />
          <h2>Saindo de {originCity} agora</h2>
          <span className="n">{!loading && !error ? `${deals.length} destinos · menor preço primeiro` : ''}</span>
        </div>

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => <div className="skel" key={i} />)}
          </div>
        ) : error || deals.length === 0 ? (
          <div className="empty">
            <p>Sem promoções em cache para esta origem agora.</p>
            <button className="pill dark" onClick={() => setOrigin('GRU')}>Ver a partir de São Paulo</button>
          </div>
        ) : (
          <div className="grid">
            {deals.map((d, i) => (
              <DealCard key={d.destination + i} deal={d} tag={i === 0 ? 'Menor preço' : (d.region && d.region !== 'brasil' ? 'Internacional' : null)} />
            ))}
          </div>
        )}

        <p className="note">Preços em cache da Travelpayouts; confirme o valor ao vivo antes de comprar e, quando possível, compre direto no site da companhia.</p>
      </section>
    </div>
  )
}

// ── Estilos (direção Teal) ────────────────────────────────────────────────────
const CSS = `
.promo{--navy:#0F2340;--teal:#0D9488;--teal-d:#0F766E;--teal-l:#14B8A6;--ink:#1B2733;--mut:#637282;--bg:#F4F8F7;--line:#E7EEEC;background:var(--bg);color:var(--ink);min-height:100vh}
.promo .ico{width:17px;height:17px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;flex:none}
.promo .wrap{max-width:1080px;margin:0 auto;padding:0 22px}
.promo .sec{padding:30px 22px}
.promo .hero{background:linear-gradient(120deg,var(--teal-d),var(--teal-l));color:#fff;padding:32px 0 36px}
.promo .hero .kick{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:7px}
.promo .hero h1{font-family:Nunito,sans-serif;font-weight:800;font-size:clamp(25px,4.4vw,34px);letter-spacing:-.02em;margin:10px 0 18px;max-width:19ch;line-height:1.08}
.promo .ops{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.promo .ops .lbl{font-size:12px;color:rgba(255,255,255,.72);margin-right:2px}
.promo .pill{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:999px;padding:8px 15px;font-size:13px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif}
.promo .pill.on{background:#fff;color:var(--teal-d)}
.promo .pill.dark{background:var(--navy);color:#fff;border-color:var(--navy)}
.promo .hero .upd{margin-top:15px;font-size:12px;color:rgba(255,255,255,.72)}
.promo .shead{display:flex;align-items:center;gap:9px;margin-bottom:16px}
.promo .shead h2{font-family:Nunito,sans-serif;font-weight:800;font-size:19px;color:var(--navy);margin:0}
.promo .shead .c{color:var(--teal-d)}
.promo .shead .n{margin-left:auto;font-size:12.5px;color:var(--mut)}
.promo .metas{display:grid;grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:14px}
.promo .meta{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px}
.promo .meta .co{font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--mut)}
.promo .meta .city{font-family:Nunito,sans-serif;font-weight:800;font-size:16px;color:var(--navy);margin-top:2px}
.promo .meta .num{font-size:22px;font-weight:700;color:var(--navy);letter-spacing:-.02em;margin:8px 0 2px}
.promo .meta .tg{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mut)}
.promo .meta .tg .ico{width:14px;height:14px;color:#E0603A}
.promo .meta .bar{height:6px;border-radius:999px;background:#EEF3F2;margin-top:11px;overflow:hidden}
.promo .meta .bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--teal),#F08043)}
.promo .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
.promo .deal{display:block;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .14s,box-shadow .14s}
.promo .deal:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(15,35,64,.1)}
.promo .deal .ph{height:152px;position:relative;background:#dfe8e6}
.promo .deal .ph img{width:100%;height:100%;object-fit:cover;display:block}
.promo .deal .tag{position:absolute;top:12px;left:12px;background:var(--teal);color:#fff;font-size:11px;font-weight:700;padding:5px 10px;border-radius:999px}
.promo .deal .bd{padding:14px 16px 16px}
.promo .deal .co{font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--mut)}
.promo .deal .city{font-family:Nunito,sans-serif;font-weight:800;font-size:18px;color:var(--navy);margin-top:1px}
.promo .deal .trip{font-size:12.5px;color:var(--mut);margin-top:9px}
.promo .deal .foot{display:flex;align-items:flex-end;justify-content:space-between;margin-top:14px}
.promo .deal .pr{font-family:Nunito,sans-serif;font-weight:800;font-size:23px;color:var(--navy);letter-spacing:-.02em}
.promo .deal .pr small{display:block;font-family:Inter,sans-serif;font-weight:500;font-size:11px;color:var(--mut)}
.promo .deal .go{display:inline-flex;align-items:center;gap:6px;background:var(--navy);color:#fff;font-weight:600;font-size:13px;padding:9px 14px;border-radius:11px}
.promo .deal .go:hover{background:#17304f}
.promo .skel{height:258px;border-radius:18px;background:linear-gradient(100deg,#eef3f2 30%,#f6faf9 50%,#eef3f2 70%);background-size:200% 100%;animation:sh 1.3s infinite}
@keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
.promo .empty{background:#fff;border:1px solid var(--line);border-radius:16px;padding:48px 24px;text-align:center;color:var(--mut)}
.promo .empty p{margin:0 0 16px;font-size:14px}
.promo .note{color:var(--mut);font-size:12px;line-height:1.6;margin-top:22px}
`
