import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllSlugs } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug) as any
  if (!post) return {}
  const img = post.coverImage
    ? urlFor(post.coverImage).width(1200).url()
    : post._fallbackImageUrl
  return {
    title: `${post.title} | Blog Go Livoo`,
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function postImageUrl(post: SanityBlogPost & { _fallbackImageUrl?: string }, width = 1200): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(width).url() } catch { /* empty */ }
  }
  return post._fallbackImageUrl ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'
}

// ─── Componentes Portable Text ────────────────────────────────────────────────
const ptComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.35rem', color: '#0F2340', margin: '32px 0 14px', lineHeight: 1.3 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.1rem', color: '#0F2340', margin: '24px 0 10px' }}>
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#4A5A70', lineHeight: 1.8, marginBottom: 16 }}>
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #1A82D8',
        paddingLeft: 20,
        margin: '24px 0',
        color: '#0F2340',
        fontStyle: 'italic',
        fontFamily: 'Inter, sans-serif',
        fontSize: '1rem',
      }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', color: '#4A5A70', lineHeight: 1.75, paddingLeft: 22, marginBottom: 16 }}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', color: '#4A5A70', lineHeight: 1.75, paddingLeft: 22, marginBottom: 16 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ marginBottom: 6 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ marginBottom: 6 }}>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ color: '#0F2340', fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ color: '#1A82D8', fontStyle: 'italic' }}>{children}</em>,
    code: ({ children }: any) => (
      <code style={{ background: '#F4F6F9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.88em' }}>
        {children}
      </code>
    ),
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        style={{ color: '#1A82D8', fontWeight: 600, textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => {
      const src = value?.asset ? urlFor(value).width(800).url() : null
      if (!src) return null
      return (
        <figure style={{ margin: '28px 0' }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden' }}>
            <Image src={src} alt={value.alt ?? ''} fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
          {value.caption && (
            <figcaption style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#9AAABB', marginTop: 8 }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug) as (SanityBlogPost & { _fallbackImageUrl?: string; _fallbackContent?: string }) | null
  if (!post) notFound()

  const color = categoryColor(post.category)
  const imgUrl = postImageUrl(post)

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>

      {/* Hero com imagem */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <Image src={imgUrl} alt={post.title} fill style={{ objectFit: 'cover' }} priority unoptimized />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(13,27,62,0.4) 0%, rgba(13,27,62,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px 24px',
          maxWidth: 860, margin: '0 auto',
          width: '100%', left: '50%', transform: 'translateX(-50%)',
        }}>
          <Link href="/blog" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            ← Voltar ao blog
          </Link>
          <span style={{
            display: 'inline-block', background: color, color: '#fff',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', padding: '3px 12px', borderRadius: 50,
            marginBottom: 14, alignSelf: 'flex-start',
          }}>
            {post.category}
          </span>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            color: '#fff', lineHeight: 1.2, marginBottom: 12,
          }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
              {formatDate(post.publishedAt)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
              {post.readTime} min de leitura
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>

          {/* Artigo */}
          <article>
            {/* Excerpt */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px 28px',
              border: '1px solid #E2E8F0', marginBottom: 32,
              borderLeft: `4px solid ${color}`,
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '1rem',
                color: '#0F2340', fontWeight: 600, lineHeight: 1.7, margin: 0,
              }}>
                {post.excerpt}
              </p>
            </div>

            {/* Corpo do artigo */}
            <div style={{
              background: '#fff', borderRadius: 20,
              padding: '40px 44px',
              boxShadow: '0 4px 24px rgba(13,27,62,0.07)',
              border: '1px solid #E2E8F0',
            }}>
              {/* Sanity Portable Text */}
              {post.content && (
                <PortableText value={post.content} components={ptComponents} />
              )}
              {/* Fallback para posts locais (HTML) */}
              {!post.content && post._fallbackContent && (
                <div
                  dangerouslySetInnerHTML={{ __html: post._fallbackContent }}
                  className="blog-content"
                />
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
                    color: '#64748B', background: '#fff',
                    border: '1px solid #E2E8F0', padding: '4px 12px', borderRadius: 50,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 100 }}>
            {/* CTA Livoo Prep */}
            <div style={{
              background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
              borderRadius: 16, padding: '28px 24px', marginBottom: 24, textAlign: 'center',
            }}>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.1rem', color: '#fff', marginBottom: 10 }}>
                Precisa de visto?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 18,
              }}>
                Verifique passaporte, visto e vacinas antes de comprar sua passagem. R$ 39 por viagem.
              </p>
              <Link href="/prep" className="btn-gold" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                Usar Livoo Prep
              </Link>
            </div>

            {/* CTA Roteiro */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px',
              border: '1px solid #E2E8F0', marginBottom: 24,
            }}>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1rem', color: '#0F2340', marginBottom: 8 }}>
                Monte seu roteiro
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                color: '#64748B', lineHeight: 1.6, marginBottom: 14,
              }}>
                Descreva a experiência que quer ter e receba um pacote completo com voo + hotel.
              </p>
              <Link href="/" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px', display: 'block', textAlign: 'center' }}>
                Gerar roteiro grátis
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Estilos fallback para posts HTML legados */}
      <style>{`
        .blog-content h2 { font-family: Nunito, sans-serif; font-size: 1.35rem; color: #0F2340; margin: 32px 0 14px; line-height: 1.3; }
        .blog-content h3 { font-family: Nunito, sans-serif; font-size: 1.1rem; color: #0F2340; margin: 24px 0 10px; }
        .blog-content p  { font-family: Inter, sans-serif; font-size: 0.95rem; color: #4A5A70; line-height: 1.8; margin-bottom: 16px; }
        .blog-content ul, .blog-content ol { font-family: Inter, sans-serif; font-size: 0.92rem; color: #4A5A70; line-height: 1.75; padding-left: 22px; margin-bottom: 16px; }
        .blog-content a { color: #1A82D8; }
        .blog-content blockquote { border-left: 3px solid #1A82D8; margin: 20px 0; padding: 12px 20px; background: #E6F3FF; border-radius: 0 8px 8px 0; }
        .blog-content code { background: #F0F4F8; padding: 2px 6px; border-radius: 4px; font-size: 0.88rem; }
      `}</style>
    </div>
  )
}
