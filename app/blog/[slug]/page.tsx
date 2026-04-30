import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import sanitizeHtml from 'sanitize-html'
import NewsletterForm from '../NewsletterForm'
import { getPostBySlug, getAllSlugs, getAllPosts, sanitizeImageUrl } from '@/lib/sanity-queries'
import { urlFor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60     // cache de 1 minuto — posts novos aparecem rápido sem sobrecarregar Sanity
export const dynamicParams = true // slugs fora do generateStaticParams são gerados on-demand

interface Props { params: Promise<{ slug: string }> }

type Post = SanityBlogPost & { _fallbackImageUrl?: string; _fallbackContent?: string }

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs()
    return slugs.map(slug => ({ slug }))
  } catch {
    return []  // se Sanity falhar no build, não bloqueia o deploy
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug) as Post | null
  if (!post) return {}
  const img = post.coverImage ? urlFor(post.coverImage).width(1200).url() : post._fallbackImageUrl
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: img ? [{ url: img }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function coverImg(post: Post): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(1400).url() } catch { /* */ }
  }
  return post._fallbackImageUrl ?? ''
}

const GRADIENTS = [
  'linear-gradient(135deg,#1A56DB,#2B6EE6)',
  'linear-gradient(135deg,#2b74ff,#06a06b)',
  'linear-gradient(135deg,#1445B0,#1A56DB)',
]

const ptComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: '-.035em', lineHeight: 1.05, margin: '44px 0 18px', color: 'var(--ink)', paddingTop: 14 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', lineHeight: 1.2, margin: '32px 0 12px', color: 'var(--ink)' }}>
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p style={{ margin: '0 0 18px', fontSize: 17.5, lineHeight: 1.65, color: 'var(--ink-2)', fontWeight: 500 }}>
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{ margin: '30px 0', background: 'var(--ink)', color: '#fff', padding: '28px 32px', borderRadius: 18, fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1.3, letterSpacing: '-.015em', position: 'relative' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ paddingLeft: 22, marginBottom: 18, fontSize: 17.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ paddingLeft: 22, marginBottom: 18, fontSize: 17.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ marginBottom: 6 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ marginBottom: 6 }}>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ color: 'var(--orange)' }}>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel="noopener noreferrer"
        style={{ color: 'var(--orange-dk)', fontWeight: 700, borderBottom: '2px solid var(--sun)', paddingBottom: 1 }}>
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => {
      // Suporta imagens Sanity (asset._ref) e URLs externas (url ou asset.url)
      let src: string | null = null
      if (value?.asset) {
        try { src = urlFor(value).width(800).url() } catch { /* */ }
      }
      // Sanitize external URLs (Wikipedia bloqueia hotlinking)
      if (!src && value?.url) src = sanitizeImageUrl(value.url, value.alt)
      if (!src && value?.asset?.url) src = sanitizeImageUrl(value.asset.url, value.alt)
      if (!src) return null
      return (
        <figure style={{ margin: '28px 0' }}>
          <div style={{ aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', position: 'relative', background: GRADIENTS[0] }}>
            <Image src={src} alt={value.alt ?? ''} fill style={{ objectFit: 'cover' }} />
          </div>
          {value.caption && <figcaption style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>{value.caption}</figcaption>}
        </figure>
      )
    },
  },
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug) as Post | null
  if (!post) notFound()

  const allPosts = await getAllPosts() as Post[]
  const related = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3)
  const cover = coverImg(post)

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: cover || undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Go Livoo' },
    publisher: { '@type': 'Organization', name: 'Go Livoo', url: 'https://golivoo.com.br' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── POST HERO ──────────────────────────────────── */}
      <div style={{ padding: '36px 0 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)' }}>
        <div className="blog-wrap">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            <Link href="/blog" style={{ color: 'inherit' }}>Blog</Link>
            <span style={{ opacity: .4 }}>›</span>
            <Link href={`/blog/categoria/${post.category?.toLowerCase()}`} style={{ color: 'inherit' }}>{post.category}</Link>
            <span style={{ opacity: .4 }}>›</span>
            <span style={{ color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{post.title}</span>
          </div>

          {/* Category tag */}
          <span style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '.02em', padding: '6px 14px', borderRadius: 999, marginBottom: 18 }}>
            {post.category}
          </span>

          {/* Title */}
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-.04em', lineHeight: .95, margin: '0 0 18px', maxWidth: 980 }}>
            {post.title.split(' ').map((word: string, i: number) =>
              i === 2 ? (
                <span key={i} style={{ background: 'linear-gradient(180deg,transparent 60%,var(--sun) 60%)', padding: '0 4px' }}>
                  {word}{' '}
                </span>
              ) : word + ' '
            )}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 19, color: 'var(--ink-2)', maxWidth: 760, lineHeight: 1.45, margin: '0 0 28px', fontWeight: 500 }}>
            {post.excerpt}
          </p>

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', padding: '22px 24px', background: 'var(--bg)', borderRadius: 18, border: '1.5px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {post.authorImage ? (
                <div style={{ width: 44, height: 44, borderRadius: 999, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <Image src={urlFor(post.authorImage).width(88).height(88).url()} alt={post.authorName ?? 'Autor'} fill style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'linear-gradient(135deg,var(--orange),var(--coral))', flexShrink: 0 }} />
              )}
              <div>
                <b style={{ display: 'block', fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{post.authorName ?? 'Equipe Go Livoo'}</b>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginTop: 2 }}>Redação Go Livoo</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.04em' }}>
              <span>{fmtDate(post.publishedAt)}</span>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--line-2)', display: 'inline-block' }} />
              <span>{post.readTime} min de leitura</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── COVER ─────────────────────────────────────── */}
      <div style={{ aspectRatio: '21/9', position: 'relative', overflow: 'hidden', background: cover ? undefined : GRADIENTS[0] }}>
        {cover ? (
          <Image src={cover} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[0] }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.15) 40%,rgba(0,0,0,.5) 100%)' }} />
      </div>

      {/* ── ARTICLE LAYOUT ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0,720px) 320px', gap: 48, padding: '56px 20px 40px', maxWidth: 1340, margin: '0 auto' }} className="article-grid">

        {/* TOC */}
        <aside style={{ position: 'sticky', top: 140, height: 'fit-content', fontSize: 13.5, borderLeft: '2px solid var(--orange)', paddingLeft: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>
            Neste artigo
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, counterReset: 'c', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Introdução', 'Quando ir e custos', 'Voos mais baratos', 'Hospedagem', 'Ingressos e dicas', 'Roteiro completo', 'Documentação necessária'].map((item, i) => (
              <li key={i} style={{ position: 'relative', paddingLeft: 28, lineHeight: 1.35, color: i === 0 ? 'var(--ink)' : 'var(--muted)', fontWeight: i === 0 ? 700 : 500, fontSize: 13.5, cursor: 'pointer' }}>
                <span style={{ position: 'absolute', left: 0, top: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: i === 0 ? 'var(--orange)' : 'var(--line-2)', fontWeight: 700 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </aside>

        {/* Article body */}
        <article style={{ fontSize: 17.5, lineHeight: 1.65, color: 'var(--ink-2)', fontWeight: 500 }}>
          {post._fallbackContent ? (
            /* Sanity sem imagens no corpo → usa HTML local com imagens Unsplash */
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post._fallbackContent, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'width', 'height', 'loading'],
                ul: ['class'],
                li: ['class'],
                figure: ['class'],
                figcaption: ['class'],
                blockquote: ['class'],
                a: ['href', 'target', 'rel'],
              },
            }) }} className="blog-fallback-content" />
          ) : post.content && post.content.length > 0 ? (
            <PortableText value={post.content} components={ptComponents} />
          ) : null}
          {!post.content && !post._fallbackContent && (
            <>
              <p style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--ink)', fontWeight: 600, marginBottom: 32 }}>
                {post.excerpt}
              </p>
              <p>Este guia completo cobre tudo que você precisa saber para aproveitar ao máximo sua viagem, com dicas exclusivas que a equipe Go Livoo reuniu após anos acompanhando esse destino de perto.</p>
              <div style={{ background: 'var(--sun)', color: 'var(--ink)', borderRadius: 18, padding: '24px 28px', margin: '30px 0', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M9 21h6M12 3a6 6 0 014 10.47V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3.53A6 6 0 0112 3z" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <b style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 17, display: 'block', marginBottom: 4, letterSpacing: '-.015em' }}>Dica Go Livoo</b>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, fontWeight: 500 }}>Compre com antecedência mínima de 90 dias para garantir os melhores preços em voos internacionais.</p>
                </div>
              </div>
              <p>Entre em contato com nossa equipe pelo WhatsApp para receber um roteiro personalizado com base na sua data de viagem e orçamento disponível.</p>
            </>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {post.tags.map((tag: string) => (
                <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'var(--bg-2)', border: '1px solid var(--line)', padding: '4px 12px', borderRadius: 999 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 140, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Newsletter card */}
          <div style={{ background: 'var(--bg-2)', borderRadius: 18, padding: 20, border: '1.5px solid var(--line)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 8 }}>
              Newsletter
            </div>
            <h5 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '-.025em', lineHeight: 1.05, margin: '0 0 8px' }}>
              Receba dicas de viagem
            </h5>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.5, fontWeight: 500 }}>Guias, destinos e alertas de preço direto no seu email.</p>
            <NewsletterForm variant="sidebar" />
          </div>
        </aside>
      </div>

      {/* ── RELACIONADOS ─────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ padding: '56px 0 20px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
          <div className="blog-wrap">
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: '-.03em', margin: '0 0 24px' }}>
              Leia também sobre <span style={{ color: 'var(--orange)' }}>{post.category}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="rel-grid">
              {related.map((r: Post) => (
                <Link key={r._id} href={`/blog/${r.slug}`} className="blog-post-card" style={{ textDecoration: 'none' }}>
                  <div style={{ aspectRatio: '4/3', position: 'relative', background: GRADIENTS[0] }}>
                    {r._fallbackImageUrl && <Image src={r._fallbackImageUrl} alt={r.title} fill style={{ objectFit: 'cover' }} />}
                  </div>
                  <div style={{ padding: '14px 16px 18px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 6 }}>{r.category}</div>
                    <h4 className="pc-title" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 18, lineHeight: 1.12, letterSpacing: '-.022em', margin: '0 0 8px', color: 'var(--ink)', transition: 'color .15s' }}>{r.title}</h4>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)', fontWeight: 600 }}>{r.readTime} min · {fmtDate(r.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção de comentários removida — sem backend funcional */}

      <style>{`
        .article-grid { grid-template-columns: 260px minmax(0,720px) 320px; }
        .rel-grid { grid-template-columns: repeat(3, 1fr); }
        .blog-fallback-content h2 { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 32px; color: var(--ink); margin: 32px 0 14px; }
        .blog-fallback-content h3 { font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 22px; color: var(--ink); margin: 24px 0 10px; }
        .blog-fallback-content p { font-size: 17.5px; color: var(--ink-2); line-height: 1.65; margin-bottom: 16px; font-weight: 500; }
        .blog-fallback-content a { color: var(--orange-dk); font-weight: 700; border-bottom: 2px solid var(--sun); }
        .blog-fallback-content ul, .blog-fallback-content ol { font-size: 16px; color: var(--ink-2); padding-left: 22px; line-height: 1.65; margin-bottom: 16px; }
        .blog-fallback-content figure { margin: 28px 0; border-radius: 16px; overflow: hidden; }
        .blog-fallback-content figure img { width: 100%; height: auto; display: block; border-radius: 16px; }
        .blog-fallback-content figcaption { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); text-align: center; margin-top: 8px; font-style: italic; line-height: 1.5; padding: 0 8px; }
        .blog-fallback-content blockquote { margin: 28px 0; padding: 20px 24px; border-left: 5px solid var(--orange); background: var(--bg-soft); border-radius: 0 12px 12px 0; font-style: normal; }
        .blog-fallback-content blockquote.cta-rentcars { background: linear-gradient(135deg, #fff8f0 0%, #fff3e0 100%); border-left: 5px solid var(--orange); border-radius: 0 16px 16px 0; padding: 22px 28px; line-height: 1.7; }
        .blog-fallback-content blockquote.cta-rentcars strong { color: var(--ink); }
        .blog-fallback-content blockquote.cta-rentcars a { display: inline-block; margin-top: 12px; font-weight: 700; color: var(--orange-dk); border-bottom: 2px solid var(--sun); text-decoration: none; }
        .blog-fallback-content ul.jogos { list-style: none; padding: 0; margin: 16px 0 28px; display: flex; flex-direction: column; gap: 8px; }
        .blog-fallback-content ul.jogos li { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-soft); border: 1px solid var(--line); border-left: 4px solid var(--orange); border-radius: 10px; padding: 12px 16px; font-size: 15px; line-height: 1.45; color: var(--ink-2); }
        .blog-fallback-content ul.jogos li strong { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--orange); text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; margin-right: 4px; }
        @media (max-width: 1100px) {
          .article-grid { grid-template-columns: 1fr !important; }
          .rel-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .rel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
