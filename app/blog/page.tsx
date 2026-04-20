import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/sanity-queries'
import { urlFor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Guias e Roteiros de Viagem',
  description: 'Roteiros, promoções e guias de viagem para quem quer experiências únicas. Sem papo furado, direto ao ponto.',
}

type Post = SanityBlogPost & { _fallbackImageUrl?: string }

const GRADIENTS = [
  'linear-gradient(135deg,#ff7a45,#ff3e5a)',
  'linear-gradient(135deg,#2b74ff,#06a06b)',
  'linear-gradient(135deg,#ff5a1f,#ffb800)',
  'linear-gradient(135deg,#06a06b,#2b74ff)',
  'linear-gradient(135deg,#ff3e5a,#ff5a1f)',
  'linear-gradient(135deg,#ffb800,#ff7a45)',
  'linear-gradient(135deg,#a34ad6,#ff3e5a)',
  'linear-gradient(135deg,#06a06b,#ffb800)',
]

const BOMBANDO = [
  { title: 'Rock in Rio 2026 · Pacote completo', price: 'R$ 2.890', old: 'R$ 4.020', pct: '-28%', date: '10 SET', vagas: 8, grad: GRADIENTS[0] },
  { title: 'Lollapalooza BR · SP e balada', price: 'R$ 1.680', old: 'R$ 2.100', pct: '-20%', date: '27 MAR', vagas: 22, grad: GRADIENTS[2] },
  { title: 'GP de Mônaco 2026 · VIP', price: 'R$ 12.400', old: 'R$ 15.800', pct: '-22%', date: '25 MAI', vagas: 4, grad: GRADIENTS[6] },
  { title: 'Oktoberfest Blumenau · 4 dias', price: 'R$ 3.200', old: 'R$ 4.100', pct: '-22%', date: '05 OUT', vagas: 11, grad: GRADIENTS[1] },
  { title: 'Rally da Geórgia · Aventura Total', price: 'R$ 8.900', old: 'R$ 11.000', pct: '-19%', date: '15 OUT', vagas: 6, grad: GRADIENTS[4] },
  { title: 'Carnaval Salvador 2027 · Camarote', price: 'R$ 4.700', old: 'R$ 5.800', pct: '-19%', date: '14 FEV', vagas: 15, grad: GRADIENTS[7] },
]

const BADGES = ['🔥 VIRAL', '💰 PROMO', '⭐ TOP 10', 'NOVO', '🔥 VIRAL', '💰 PROMO', 'NOVO', '⭐ TOP 10']

function postImg(post: Post): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(640).url() } catch { /* empty */ }
  }
  return post._fallbackImageUrl ?? ''
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function BlogHome() {
  const posts = (await getAllPosts()) as Post[]
  const featured = posts.find(p => p.featured) ?? posts[0]
  const grid = posts.filter(p => p._id !== featured?._id).slice(0, 8)

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="blog-wrap" style={{ paddingTop: 44, paddingBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>
          ◆ Blog oficial da Go Livoo
        </div>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(48px, 7vw, 82px)', lineHeight: .9, letterSpacing: '-.045em', margin: '0 0 16px', maxWidth: 980 }}>
          Viagem boa é a que{' '}
          <span style={{ background: 'linear-gradient(180deg,transparent 72%,#ffe08a 72%)', padding: '0 4px' }}>cabe no bolso</span>
          {' '}e vira{' '}
          <span style={{ color: 'var(--orange)' }}>história</span>.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-2)', maxWidth: 640, margin: '0 0 28px', lineHeight: 1.5, fontWeight: 500 }}>
          Roteiros, promoções e os guias que a gente só dá pra quem assina a newsletter. Sem papo furado, direto ao ponto.
        </p>
        <div style={{ display: 'flex', gap: 28, marginTop: 18, flexWrap: 'wrap' }}>
          {[
            { n: '248', u: ' posts', s: 'publicados até agora' },
            { n: '412k', u: ' leituras', s: 'só esse mês' },
            { n: '36k', u: ' assinantes', s: 'na newsletter' },
            { n: '4,9', u: '', s: 'média nos reviews', pre: 'nota ' },
          ].map(st => (
            <div key={st.s} style={{ display: 'flex', flexDirection: 'column' }}>
              <b style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 30, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-.02em' }}>
                {st.pre}<span style={{ color: 'var(--orange)' }}>{st.n}</span>{st.u}
              </b>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>{st.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────── */}
      {featured && (
        <section className="blog-wrap">
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
            <article style={{
              display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24,
              margin: '32px 0 48px', background: 'var(--bg-soft)', borderRadius: 24,
              overflow: 'hidden', border: '1px solid var(--line)', position: 'relative',
            }}>
              {/* MATÉRIA DA SEMANA badge */}
              <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--ink)', color: '#fff', fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 11, padding: '6px 12px', borderRadius: 999, letterSpacing: '.04em', zIndex: 2 }}>
                MATÉRIA DA SEMANA
              </div>

              {/* Imagem */}
              <div style={{ aspectRatio: '4/3', position: 'relative', background: postImg(featured) ? undefined : GRADIENTS[0] }}>
                {postImg(featured) ? (
                  <Image src={postImg(featured)} alt={featured.title} fill style={{ objectFit: 'cover' }} priority unoptimized />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[0] }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.1) 40%,rgba(0,0,0,.6) 100%)' }} />
                {/* Price tag */}
                <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'var(--orange)', color: '#fff', fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 14, padding: '12px 16px', borderRadius: 14, boxShadow: '0 3px 0 var(--orange-dk)' }}>
                  A partir de
                  <span style={{ fontSize: 28, display: 'block', lineHeight: 1, letterSpacing: '-.02em' }}>R$ 12.400</span>
                  <small style={{ fontSize: 10, fontWeight: 600, opacity: .9, display: 'block', marginTop: 3, letterSpacing: '.04em' }}>em 12x sem juros</small>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '44px 44px 44px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {featured.category}
                  <span style={{ background: 'var(--coral)', color: '#fff', padding: '3px 8px', borderRadius: 999, fontSize: 10, letterSpacing: '.06em' }}>AO VIVO</span>
                </span>
                <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: .98, letterSpacing: '-.035em', margin: '0 0 14px', color: 'var(--ink)' }}>
                  {featured.title}
                </h2>
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, margin: '0 0 20px', lineHeight: 1.5 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', marginBottom: 26 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg,var(--orange),var(--coral))', flexShrink: 0 }} />
                  <div>
                    <b style={{ color: 'var(--ink)', fontWeight: 700 }}>Equipe Go Livoo</b><br />
                    <span>{featured.readTime} min de leitura · {fmtDate(featured.publishedAt)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14, background: 'var(--orange)', color: '#fff', padding: '14px 22px', borderRadius: 14, boxShadow: '0 3px 0 var(--orange-dk)', letterSpacing: '.01em' }}>
                    Ler o guia completo →
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13.5, background: '#fff', color: 'var(--ink)', padding: '14px 18px', borderRadius: 14, border: '1.5px solid var(--line-2)' }}>
                    ♡ Salvar
                  </span>
                </div>
                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--orange-dk)', fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--orange)', display: 'inline-block' }} />
                  427 pessoas leram hoje · última atualização ontem
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* ── BOMBANDO AGORA ───────────────────────────── */}
      <section style={{ background: 'var(--bg-soft)', padding: '56px 0', margin: '0 0 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 10%, rgba(255,90,31,.08), transparent 50%)', pointerEvents: 'none' }} />
        <div className="blog-wrap">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
            <div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 44px)', letterSpacing: '-.035em', margin: 0, lineHeight: 1 }}>
                <span style={{ display: 'inline-flex', width: 44, height: 44, background: 'var(--sun)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 4, verticalAlign: '-8px', fontSize: 22 }}>🔥</span>
                Bombando agora
              </h3>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)', marginTop: 6, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                Pacotes com vagas se esgotando essa semana
              </div>
            </div>
            <Link href="/pacotes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#fff', fontWeight: 700, background: 'var(--orange)', border: '1.5px solid var(--orange)', padding: '9px 16px', borderRadius: 999, boxShadow: '0 3px 0 var(--orange-dk)', whiteSpace: 'nowrap' }}>
              Ver todos os pacotes →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {BOMBANDO.map((b, i) => (
              <Link key={i} href="/pacotes" style={{ flex: '0 0 300px', background: '#fff', borderRadius: 18, overflow: 'hidden', display: 'block', border: '1.5px solid var(--line)', transition: 'transform .15s, box-shadow .15s' }} className="bombando-card">
                <div style={{ aspectRatio: '1', position: 'relative', background: b.grad }}>
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--coral)', color: '#fff', padding: '4px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: '.02em' }}>{b.pct}</div>
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.55)', color: '#fff', padding: '4px 10px', borderRadius: 999, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600 }}>{b.date}</div>
                </div>
                <div style={{ padding: '14px 16px 18px' }}>
                  <h4 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 18, lineHeight: 1.08, letterSpacing: '-.02em', margin: '0 0 8px', color: 'var(--ink)' }}>{b.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, fontFamily: "'Archivo', sans-serif" }}>
                    <b style={{ fontWeight: 900, color: 'var(--ink)', fontSize: 22, letterSpacing: '-.02em' }}>{b.price}</b>
                    <small style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textDecoration: 'line-through' }}>{b.old}</small>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--orange-dk)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--orange)', display: 'inline-block' }} />
                    Restam {b.vagas} vagas
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OS MAIS SALVOS ───────────────────────────── */}
      <section className="blog-wrap" style={{ padding: '64px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-.035em', margin: 0, lineHeight: 1 }}>
              Os mais <span style={{ color: 'var(--orange)' }}>salvos</span>
            </h3>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 10 }}>
              Posts que o povo guarda pra ler depois
            </div>
          </div>
          <Link href="/blog" style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 700, display: 'inline-flex', gap: 6, alignItems: 'center', background: 'var(--bg-2)', border: '1.5px solid var(--ink)', padding: '9px 16px', borderRadius: 999 }}>
            Ver tudo →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }} className="blog-grid-4">
          {(grid.length ? grid : Array(8).fill(null)).map((post: Post | null, i) => (
            post ? (
              <Link key={post._id} href={`/blog/${post.slug}`} className="blog-post-card" style={{ textDecoration: 'none' }}>
                <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', background: GRADIENTS[i % GRADIENTS.length] }}>
                  {postImg(post) && (
                    <Image src={postImg(post)} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized />
                  )}
                  <div style={{ position: 'absolute', top: 10, left: 10, background: '#fafaf8', color: 'var(--ink)', padding: '5px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: '.02em', boxShadow: '0 1px 2px rgba(0,0,0,.1)' }}>
                    {BADGES[i % BADGES.length]}
                  </div>
                  <button style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,.92)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: 0, cursor: 'pointer', fontSize: 16 }}>♡</button>
                </div>
                <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 6 }}>
                    {post.category}
                  </div>
                  <h4 className="pc-title" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 18, lineHeight: 1.12, letterSpacing: '-.022em', margin: '0 0 8px', color: 'var(--ink)', transition: 'color .15s' }}>
                    {post.title}
                  </h4>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '0 0 12px', lineHeight: 1.45, fontWeight: 500 }}>
                    {post.excerpt?.slice(0, 90)}…
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.04em', marginTop: 'auto' }}>
                    <span>{post.readTime} min</span>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--line-2)', display: 'inline-block' }} />
                    <span>{fmtDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={i} className="blog-post-card" style={{ background: 'var(--bg-2)', minHeight: 280 }}>
                <div style={{ aspectRatio: '4/3', background: GRADIENTS[i % GRADIENTS.length] }} />
                <div style={{ padding: '14px 16px 18px' }}>
                  <div style={{ height: 10, background: 'var(--line)', borderRadius: 4, marginBottom: 8, width: '60%' }} />
                  <div style={{ height: 16, background: 'var(--line)', borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ height: 16, background: 'var(--line)', borderRadius: 4, width: '80%' }} />
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────── */}
      <section className="blog-wrap" style={{ padding: '64px 0' }}>
        <div style={{ background: 'var(--bg-soft)', borderRadius: 24, padding: '48px 40px', position: 'relative', overflow: 'hidden', border: '1px solid var(--line-2)' }}>
          <div style={{ position: 'absolute', top: -80, right: -60, width: 220, height: 220, background: 'var(--sun)', borderRadius: 999, opacity: .22, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: '20%', width: 180, height: 180, background: 'var(--orange)', borderRadius: 999, opacity: .1, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'center' }} className="nl-grid">
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 }}>
                ◆ Newsletter semanal
              </div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-.035em', lineHeight: .98, margin: '0 0 14px', color: 'var(--ink)' }}>
                Promoção boa<br />não espera.
              </h3>
              <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: 0, maxWidth: 440, fontWeight: 500 }}>
                Receba curadoria de experiências + alertas de queda de preço toda sexta-feira.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
                <input
                  placeholder="seu@email.com"
                  style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: '2px solid var(--ink)', borderRadius: 14, background: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, outline: 'none' }}
                />
                <button style={{ background: 'var(--ink)', color: '#fff', padding: '14px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, fontFamily: "'Archivo', sans-serif", letterSpacing: '-.01em', boxShadow: '0 3px 0 #000', border: 0, cursor: 'pointer' }}>
                  Quero receber
                </button>
              </div>
            </div>
            <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 20, padding: 24, fontFamily: "'Archivo', sans-serif", fontWeight: 700 }}>
              <div style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 16 }}>
                "Fui ao GP de Mônaco por R$ 11.800 graças ao alerta da Go Livoo."
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <b style={{ color: 'var(--sun)', fontSize: 26, fontWeight: 900, letterSpacing: '-.02em' }}>36.000+</b>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#b8b0a3', fontWeight: 500 }}>assinantes recebendo alertas toda sexta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAGS / TEMAS ─────────────────────────────── */}
      <section className="blog-wrap" style={{ paddingBottom: 72 }}>
        <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: '-.03em', marginBottom: 16, color: 'var(--ink)' }}>
          Explorar por tema
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { emoji: '🏖️', label: 'Praias', slug: 'destinos' },
            { emoji: '🎵', label: 'Shows & Festivais', slug: 'eventos' },
            { emoji: '🏎️', label: 'Automobilismo', slug: 'eventos' },
            { emoji: '🥾', label: 'Aventura', slug: 'guias' },
            { emoji: '👨‍👩‍👧', label: 'Família', slug: 'familia' },
            { emoji: '🌍', label: 'Solo Trip', slug: 'solo' },
            { emoji: '💰', label: 'Econômico', slug: 'economico' },
            { emoji: '🍜', label: 'Gastronomia', slug: 'destinos' },
          ].map(t => (
            <Link key={t.label} href={`/blog/categoria/${t.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--bg-2)', border: '1.5px solid var(--line)', borderRadius: 999, fontSize: 14, fontWeight: 700, color: 'var(--ink)', transition: 'border-color .15s' }} className="tag-pill">
              <span>{t.emoji}</span> {t.label}
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .blog-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .bombando-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -12px rgba(0,0,0,.12); border-color: var(--ink) !important; }
        .tag-pill:hover { border-color: var(--ink) !important; }
        @media (max-width: 980px) {
          .blog-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .nl-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .blog-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
