import Link from 'next/link'
import Image from 'next/image'
import SearchWidget from '@/components/SearchWidget'
import HomeEventsGrid from '@/components/HomeEventsGrid'
import { getLatestPosts } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'

function blogImgUrl(post: SanityBlogPost & { _fallbackImageUrl?: string }): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(600).url() } catch { /* empty */ }
  }
  return post._fallbackImageUrl ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'
}

const events = [
  {
    date: 'MAI 2026',
    title: 'GP de Mônaco — F1',
    local: 'Circuit de Monaco · Mônaco',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    href: '/eventos/f1-monaco',
    iata: 'NCE',
  },
  {
    date: 'SET 2026',
    title: 'Rock in Rio 2026',
    local: 'Cidade do Rock · Rio de Janeiro',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    href: '/eventos/rock-in-rio',
    iata: 'GIG',
  },
  {
    date: 'OUT 2026',
    title: 'Rally da Geórgia',
    local: 'Tbilisi · Geórgia',
    img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80',
    href: '/eventos/rally-georgia',
    iata: 'TBS',
  },
  {
    date: 'FEV 2027',
    title: 'Carnaval do Rio 2027',
    local: 'Sambódromo · Rio de Janeiro',
    img: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&q=80',
    href: '/eventos/carnaval-rio',
    iata: 'GIG',
  },
]

const destinations = [
  { name: 'Mônaco', img: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=400&q=80', href: '/eventos' },
  { name: 'Rio de Janeiro', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80', href: '/eventos' },
  { name: 'Geórgia', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&q=80', href: '/eventos' },
  { name: 'Paris', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80', href: '/eventos' },
  { name: 'São Paulo', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80', href: '/eventos' },
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

export const revalidate = 60

export default async function Home() {
  const latestPosts = (await getLatestPosts(3)) as (SanityBlogPost & { _fallbackImageUrl?: string })[]

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

        <HomeEventsGrid events={events} />

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

      {/* ── BLOG ── */}
      {latestPosts.length > 0 && (
        <section style={{ background: '#fff', padding: '56px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="section-header-row">
              <h2 className="section-title-main">Do blog</h2>
              <Link href="/blog" className="section-link-all">Ver todos os artigos →</Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
              marginTop: 28,
            }}>
              {latestPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{
                    background: '#F4F6F9',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ position: 'relative', height: 160 }}>
                      <Image
                        src={blogImgUrl(post)}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem', fontWeight: 700,
                        color: '#fff',
                        background: categoryColor(post.category),
                        padding: '3px 9px', borderRadius: 50,
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {post.category}
                      </span>
                    </div>
                    <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <h3 style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '0.95rem',
                        color: '#0F2340',
                        lineHeight: 1.35,
                        margin: 0,
                      }}>
                        {post.title}
                      </h3>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.72rem',
                        color: '#9AAABB',
                        marginTop: 'auto',
                      }}>
                        {post.readTime} min de leitura
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Roteiro ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          padding: '80px 24px',
          marginTop: 56,
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Descreva a experiência. A Go Livoo resolve o resto.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,.65)', marginBottom: 36, lineHeight: 1.7 }}>
            Diga onde quer ir, qual evento quer viver — e receba um roteiro completo com voo, hotel, ingressos e documentação.
          </p>
          <Link
            href="/roteiro"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #F5A800 0%, #D48A0A 100%)',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '14px 36px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(245,168,0,.35)',
            }}
          >
            Criar meu roteiro
          </Link>
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
