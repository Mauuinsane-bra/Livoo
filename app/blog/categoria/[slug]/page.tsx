import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import BlogImage from '../../BlogImage'
import { getPostsByCategory, getAllPosts } from '@/lib/sanity-queries'
import { urlFor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60

const CAT_META: Record<string, {
  label: string
  description: string
  keyword: string
}> = {
  destinos: {
    label: 'Destinos',
    description: 'Os melhores destinos para quem quer uma experiência única — com roteiros práticos, dicas de custo real e o que ninguém te conta antes de ir.',
    keyword: 'Destinos',
  },
  eventos: {
    label: 'Eventos',
    description: 'F1, rock, rally, festivais e tudo que vale uma viagem. Antes, durante e depois do evento — a Go Livoo cobre tudo.',
    keyword: 'Eventos',
  },
  guias: {
    label: 'Guias',
    description: 'Guias práticos e diretos ao ponto. Documentação, vistos, vacinas, câmbio — o que você precisa saber antes de embarcar.',
    keyword: 'Guias',
  },
  'copa-do-mundo': {
    label: 'Copa do Mundo 2026',
    description: 'Tudo sobre a Copa do Mundo 2026 no México, Canadá e EUA — visto, cidades-sede, estádios, voos, hospedagem e dicas de viagem.',
    keyword: 'Copa do Mundo 2026',
  },
}

// Posts mockados removidos — todo o conteúdo vem do Sanity CMS.
// Quando novos posts forem publicados no Sanity, aparecerão automaticamente (ISR 60s).
const STATIC_POSTS_BY_CAT: Record<string, Array<{
  slug: string; title: string; excerpt: string; category: string;
  date: string; readTime: string; author: string; imageUrl: string; tags: string[]
}>> = {
  destinos: [],
  eventos: [],
  guias: [],
  'copa-do-mundo': [],
}

const GRADIENTS = [
  'linear-gradient(135deg,#1A56DB,#2B6EE6)',
  'linear-gradient(135deg,#2b74ff,#06a06b)',
  'linear-gradient(135deg,#1445B0,#1A56DB)',
  'linear-gradient(135deg,#06a06b,#2b74ff)',
  'linear-gradient(135deg,#2B6EE6,#1A56DB)',
  'linear-gradient(135deg,#1A56DB,#2b74ff)',
]

type Post = SanityBlogPost & { _fallbackImageUrl?: string }

export async function generateStaticParams() {
  return Object.keys(CAT_META).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const meta = CAT_META[slug]
  if (!meta) return { title: 'Categoria — Blog Go Livoo' }
  return {
    title: `${meta.label} — Blog Go Livoo`,
    description: meta.description,
  }
}

function postImg(post: Post): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(560).url() } catch { /* */ }
  }
  return post._fallbackImageUrl ?? ''
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = CAT_META[slug] ?? {
    label: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Categoria',
    description: 'Posts desta categoria.',
    keyword: slug,
  }

  let sanityPosts: Post[] = []
  try {
    sanityPosts = (await getPostsByCategory(slug)) as Post[]
  } catch { /* fallback */ }

  const staticFallback = STATIC_POSTS_BY_CAT[slug] ?? []
  const hasSanity = sanityPosts.length > 0

  return (
    <div className="blog-root">
      <style>{`
        /* Category hero */
        .cat-hero {
          background: var(--ink);
          padding: 80px 20px 72px;
          position: relative;
          overflow: hidden;
        }
        .cat-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,90,31,.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cat-hero-inner {
          max-width: 1340px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .cat-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--orange);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .cat-kicker::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 2px;
          background: var(--orange);
          border-radius: 2px;
        }
        .cat-h1 {
          font-family: 'Archivo', sans-serif;
          font-variation-settings: "wght" 900;
          font-size: clamp(52px, 8vw, 80px);
          letter-spacing: -.04em;
          line-height: .92;
          color: #ffffff;
          margin: 0 0 28px;
          max-width: 700px;
        }
        .cat-h1 .hl {
          color: var(--orange);
        }
        .cat-desc {
          font-size: 17px;
          line-height: 1.6;
          color: rgba(255,255,255,.6);
          max-width: 560px;
          margin: 0 0 40px;
        }
        .cat-stats {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }
        .cat-stat-val {
          font-family: 'Archivo', sans-serif;
          font-variation-settings: "wght" 800;
          font-size: 28px;
          letter-spacing: -.03em;
          color: var(--sun);
          line-height: 1;
        }
        .cat-stat-lbl {
          font-size: 12px;
          color: rgba(255,255,255,.45);
          margin-top: 4px;
          font-weight: 500;
          letter-spacing: .02em;
        }

        /* Toolbar */
        .cat-toolbar {
          background: var(--bg-2);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 125px;
          z-index: 30;
          padding: 0 20px;
        }
        .cat-toolbar-inner {
          max-width: 1340px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .cat-toolbar-inner::-webkit-scrollbar { display: none; }
        .cat-pill {
          white-space: nowrap;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid var(--line-2);
          background: var(--bg);
          color: var(--ink-2);
          transition: all .15s;
        }
        .cat-pill.active {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .cat-sort {
          margin-left: auto;
          flex: 0 0 auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
          background: var(--bg);
          border: 1.5px solid var(--line-2);
          border-radius: 8px;
          padding: 7px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Post list */
        .cat-list {
          max-width: 1340px;
          margin: 0 auto;
          padding: 48px 20px 80px;
        }
        .cat-list-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cat-list-count::before {
          content: '';
          display: inline-block;
          width: 12px;
          height: 2px;
          background: var(--orange);
          border-radius: 2px;
        }
        .cat-post {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 0;
          border: 1.5px solid var(--line);
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-2);
          margin-bottom: 20px;
          transition: transform .15s, box-shadow .15s;
          text-decoration: none;
          color: inherit;
        }
        .cat-post:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -12px rgba(26,20,16,.12);
        }
        .cat-post:hover .cat-post-title {
          color: var(--orange);
        }
        .cat-post-img {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .cat-post-img-placeholder {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cat-post-body {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
        }
        .cat-post-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .cat-post-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--orange);
          background: rgba(255,90,31,.08);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .cat-post-date {
          font-size: 12px;
          color: var(--muted);
          font-weight: 500;
        }
        .cat-post-readtime {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          margin-left: auto;
        }
        .cat-post-title {
          font-family: 'Archivo', sans-serif;
          font-variation-settings: "wght" 700;
          font-size: 22px;
          letter-spacing: -.02em;
          line-height: 1.2;
          color: var(--ink);
          margin: 0 0 12px;
          transition: color .15s;
        }
        .cat-post-excerpt {
          font-size: 15px;
          line-height: 1.65;
          color: var(--ink-2);
          margin: 0 0 20px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cat-post-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .cat-post-author-av {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--orange), var(--coral));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          color: #fff;
          flex: 0 0 auto;
        }
        .cat-post-author-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-2);
        }
        .cat-post-cta {
          margin-left: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: var(--orange);
          letter-spacing: .04em;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cat-post-cta svg {
          transition: transform .15s;
        }
        .cat-post:hover .cat-post-cta svg {
          transform: translateX(3px);
        }
        .cat-post-tags {
          display: flex;
          gap: 6px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .cat-post-tag-chip {
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          background: var(--bg-soft);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }

        /* Pagination */
        .cat-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px 80px;
          max-width: 1340px;
          margin: 0 auto;
        }
        .cat-page-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1.5px solid var(--line-2);
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-2);
          cursor: pointer;
          transition: all .15s;
          text-decoration: none;
        }
        .cat-page-btn:hover { border-color: var(--ink); color: var(--ink); }
        .cat-page-btn.active { background: var(--ink); color: #fff; border-color: var(--ink); }
        .cat-page-dots {
          font-size: 13px;
          color: var(--muted);
          padding: 0 4px;
        }

        /* Empty state */
        .cat-empty {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
        }
        .cat-empty-icon {
          width: 64px;
          height: 64px;
          background: var(--bg-soft);
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        @media (max-width: 720px) {
          .cat-h1 { font-size: 44px; }
          .cat-stats { gap: 24px; }
          .cat-post { grid-template-columns: 1fr; }
          .cat-post-img { height: 180px; }
          .cat-post-body { padding: 20px; }
          .cat-post-title { font-size: 18px; }
        }
      `}</style>

      {/* Hero */}
      <section className="cat-hero">
        <div className="cat-hero-inner">
          <p className="cat-kicker">Blog da Go Livoo · Categoria</p>
          <h1 className="cat-h1">
            <span className="hl">{meta.keyword}</span>
            <br />sem papo furado.
          </h1>
          <p className="cat-desc">{meta.description}</p>
        </div>
      </section>

      {/* Toolbar removida — filtros sem funcionalidade */}

      {/* Post list */}
      <div className="cat-list">
        <div className="cat-list-count">
          {hasSanity ? sanityPosts.length : staticFallback.length} artigos em {meta.label}
        </div>

        {hasSanity ? (
          sanityPosts.map((post, idx) => {
            const img = postImg(post)
            const av = 'G'
            return (
              <Link key={post._id} href={`/blog/${post.slug ?? post._id}`} className="cat-post">
                <div className="cat-post-img">
                  {img ? (
                    <BlogImage src={img} fallback={post._fallbackImageUrl} alt={post.title} />
                  ) : (
                    <div className="cat-post-img-placeholder" style={{ background: GRADIENTS[idx % GRADIENTS.length] }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="cat-post-body">
                  <div className="cat-post-meta">
                    <span className="cat-post-tag">{post.category ?? meta.label}</span>
                    <span className="cat-post-date">{post.publishedAt ? fmtDate(post.publishedAt) : ''}</span>
                    <span className="cat-post-readtime">8 min</span>
                  </div>
                  <h2 className="cat-post-title">{post.title}</h2>
                  <p className="cat-post-excerpt">{post.excerpt}</p>
                  <div className="cat-post-footer">
                    <div className="cat-post-author-av">{av}</div>
                    <span className="cat-post-author-name">Equipe Go Livoo</span>
                    <span className="cat-post-cta">
                      Ler artigo
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        ) : staticFallback.length > 0 ? (
          staticFallback.map((post, idx) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="cat-post">
              <div className="cat-post-img">
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized />
                ) : (
                  <div className="cat-post-img-placeholder" style={{ background: GRADIENTS[idx % GRADIENTS.length] }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="cat-post-body">
                <div className="cat-post-meta">
                  <span className="cat-post-tag">{post.category}</span>
                  <span className="cat-post-date">{fmtDate(post.date)}</span>
                  <span className="cat-post-readtime">{post.readTime}</span>
                </div>
                <h2 className="cat-post-title">{post.title}</h2>
                <p className="cat-post-excerpt">{post.excerpt}</p>
                {post.tags && (
                  <div className="cat-post-tags">
                    {post.tags.map(t => (
                      <span key={t} className="cat-post-tag-chip">{t}</span>
                    ))}
                  </div>
                )}
                <div className="cat-post-footer">
                  <div className="cat-post-author-av">{(post.author ?? 'E').charAt(0)}</div>
                  <span className="cat-post-author-name">{post.author ?? 'Equipe Go Livoo'}</span>
                  <span className="cat-post-cta">
                    Ler artigo
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="cat-empty">
            <div className="cat-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8 }}>Nenhum post encontrado</p>
            <p style={{ fontSize: 14 }}>Em breve novos artigos sobre {meta.label}.</p>
            <Link href="/blog" style={{ display: 'inline-block', marginTop: 20, padding: '10px 24px', background: 'var(--ink)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Ver todos os posts
            </Link>
          </div>
        )}

        {/* Paginação removida — sem funcionalidade real */}
      </div>
    </div>
  )
}
