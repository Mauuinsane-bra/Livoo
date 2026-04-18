import Link from 'next/link'
import SearchWidget from '@/components/SearchWidget'
import WaitlistForm from '@/components/WaitlistForm'

const events = [
  {
    date: 'MAI 2026',
    title: 'GP de Mônaco — F1',
    local: 'Circuit de Monaco · Mônaco',
    price: '12.400',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    href: '/eventos/f1-monaco',
  },
  {
    date: 'SET 2026',
    title: 'Rock in Rio 2026',
    local: 'Cidade do Rock · Rio de Janeiro',
    price: '1.890',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    href: '/eventos/rock-in-rio',
  },
  {
    date: 'OUT 2026',
    title: 'Oktoberfest — Munique',
    local: 'Theresienwiese · Munique, Alemanha',
    price: '7.200',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    href: '/eventos/oktoberfest',
  },
  {
    date: 'JUL 2026',
    title: 'Tomorrowland 2026',
    local: 'De Schorre · Boom, Bélgica',
    price: '9.800',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    href: '/eventos/tomorrowland',
  },
]

const destinations = [
  { name: 'Mônaco', count: '3 eventos', img: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=400&q=80', href: '/eventos?destino=monaco' },
  { name: 'Rio de Janeiro', count: '8 eventos', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80', href: '/eventos?destino=rio' },
  { name: 'Munique', count: '5 eventos', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80', href: '/eventos?destino=munique' },
  { name: 'Paris', count: '5 eventos', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80', href: '/eventos?destino=paris' },
  { name: 'São Paulo', count: '12 eventos', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80', href: '/eventos?destino=sao-paulo' },
]

const diferenciais = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Você descreve, a gente resolve',
    desc: 'Diga qual experiência quer viver. Nossa IA monta um roteiro completo com voo, hotel, ingressos e documentação em segundos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Documentação incluída',
    desc: 'Checklist completo de visto, passaporte e vacinas para cada destino. Sem surpresas na hora de embarcar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2" strokeLinecap="round" style={{ width: 22, height: 22 }}>
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'Qualquer evento, qualquer lugar',
    desc: 'Copa do Mundo no México, Carnaval de Veneza, festival gastronômico em Tóquio — se o evento existe, a Go Livoo monta o seu pacote.',
  },
]

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #093468 0%, #1A82D8 55%, #2B9FEE 100%)',
        padding: '50px 24px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* círculos decorativos */}
        <div style={{ position: 'absolute', top: -90, right: -110, width: 440, height: 440, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
        <div style={{ position: 'absolute', bottom: 50, left: -80, width: 290, height: 290, borderRadius: '50%', background: 'rgba(245,168,0,.09)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(26px, 3.8vw, 50px)',
            fontWeight: 900,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 10,
            letterSpacing: '-.4px',
          }}>
            Você quer a experiência.<br />
            <span style={{ color: '#F5A800' }}>A Go Livoo resolve o resto.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
            Voo + hotel + ingressos + documentação — tudo em um roteiro completo.
          </p>

          {/* Widget de busca existente */}
          <div style={{ width: '100%', maxWidth: 880 }}>
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* ── PROMO STRIP ── */}
      <div className="promo-strip">
        <div className="promo-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Pacote completo em minutos
        </div>
        <span className="promo-sep">|</span>
        <div className="promo-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Zero taxa de serviço
        </div>
        <span className="promo-sep">|</span>
        <div className="promo-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Cobertura mundial de eventos
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

        {/* Experiências em alta */}
        <div className="section-header-row" style={{ marginTop: 16 }}>
          <h2 className="section-title-main">Experiências em alta</h2>
          <Link href="/eventos" className="section-link-all">Ver todos os eventos →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {events.map((ev) => (
            <div key={ev.href} className="ev-card">
              <div
                className="ev-img"
                style={{ backgroundImage: `url('${ev.img}')` }}
              >
                <span className="ev-badge">{ev.date}</span>
              </div>
              <div className="ev-body">
                <div className="ev-title">{ev.title}</div>
                <div className="ev-local">
                  <PinIcon /> {ev.local}
                </div>
                <div className="ev-price-row">
                  <div>
                    <span className="ev-from">pacote a partir de</span>
                    <div className="ev-price"><small>R$</small> {ev.price}</div>
                  </div>
                  <Link href={ev.href} className="ev-btn">Ver pacote</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Destinos populares */}
        <div className="section-header-row" style={{ marginTop: 48 }}>
          <h2 className="section-title-main">Destinos populares</h2>
          <Link href="/eventos" className="section-link-all">Explorar todos →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {destinations.map((d) => (
            <Link key={d.href} href={d.href} className="dest-card">
              <div className="dest-bg" style={{ backgroundImage: `url('${d.img}')` }} />
              <div className="dest-overlay">
                <div className="dest-name">{d.name}</div>
                <div className="dest-count">{d.count}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Diferenciais */}
        <div className="difs-row" style={{ marginTop: 48 }}>
          {diferenciais.map((d) => (
            <div key={d.title} className="dif-item">
              <div className="dif-ico">{d.icon}</div>
              <div>
                <div className="dif-title">{d.title}</div>
                <div className="dif-desc">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── ACESSO ANTECIPADO (Waitlist) ── */}
      <section
        id="acesso-antecipado"
        style={{
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          padding: '80px 24px',
          marginTop: 56,
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            background: 'rgba(245,168,0,.15)',
            color: '#F5A800',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: 50,
            display: 'inline-block',
            marginBottom: 20,
            border: '1px solid rgba(245,168,0,.3)',
          }}>
            Acesso Antecipado
          </span>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Seja um dos primeiros
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,.65)', marginBottom: 36, lineHeight: 1.7 }}>
            A Go Livoo está em desenvolvimento. Entre na lista e você será notificado quando abrirmos o acesso — e terá condições especiais de lançamento.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .events-grid-home { grid-template-columns: repeat(2, 1fr) !important; }
          .dest-grid-home   { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .events-grid-home { grid-template-columns: 1fr !important; }
          .dest-grid-home   { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
