import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BLOG_POSTS, getPost } from '@/lib/blog-data'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Blog Go Livoo`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.imageUrl }],
      type: 'article',
      publishedTime: post.date,
    },
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>

      {/* Hero com imagem */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(13,27,62,0.4) 0%, rgba(13,27,62,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px 24px',
          maxWidth: 860,
          margin: '0 auto',
          width: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <Link href="/blog" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            marginBottom: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            ← Voltar ao blog
          </Link>
          <span style={{
            display: 'inline-block',
            background: post.categoryColor,
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '3px 12px',
            borderRadius: 50,
            marginBottom: 14,
            alignSelf: 'flex-start',
          }}>
            {post.category}
          </span>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.65)',
            }}>
              {formatDate(post.date)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.65)',
            }}>
              {post.readTime} min de leitura
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>

          {/* Artigo principal */}
          <article>
            {/* Excerpt */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #E2E8F0',
              marginBottom: 32,
              borderLeft: `4px solid ${post.categoryColor}`,
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#0F2340',
                fontWeight: 600,
                lineHeight: 1.7,
                margin: 0,
              }}>
                {post.excerpt}
              </p>
            </div>

            {/* HTML do artigo */}
            <div
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '40px 44px',
                boxShadow: '0 4px 24px rgba(13,27,62,0.07)',
                border: '1px solid #E2E8F0',
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="blog-content"
            />

            {/* Tags */}
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  color: '#64748B',
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  padding: '4px 12px',
                  borderRadius: 50,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 100 }}>
            {/* CTA Livoo Prep */}
            <div style={{
              background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
              borderRadius: 16,
              padding: '28px 24px',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.1rem',
                color: '#fff',
                marginBottom: 10,
              }}>
                Precisa de visto?
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.65,
                marginBottom: 18,
              }}>
                Verifique passaporte, visto e vacinas antes de comprar sua passagem. R$ 39 por viagem.
              </p>
              <Link href="/prep" className="btn-gold" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                Usar Livoo Prep
              </Link>
            </div>

            {/* CTA Roteiro */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '24px',
              border: '1px solid #E2E8F0',
              marginBottom: 24,
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1rem',
                color: '#0F2340',
                marginBottom: 8,
              }}>
                Monte seu roteiro
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                color: '#64748B',
                lineHeight: 1.6,
                marginBottom: 14,
              }}>
                Descreva a experiência que quer ter e receba um pacote completo com voo + hotel.
              </p>
              <Link href="/" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px', display: 'block', textAlign: 'center' }}>
                Gerar roteiro grátis
              </Link>
            </div>

            {/* Outros artigos */}
            {related.length > 0 && (
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '24px',
                border: '1px solid #E2E8F0',
              }}>
                <h3 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0F2340',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  marginBottom: 16,
                }}>
                  Leia também
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {related.map(r => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                      }}>
                        <div style={{
                          position: 'relative', width: 56, height: 44,
                          borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                        }}>
                          <Image src={r.imageUrl} alt={r.title} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.8rem',
                          color: '#0F2340',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          margin: 0,
                        }}>
                          {r.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Estilos do blog content */}
      <style>{`
        .blog-content h2 {
          font-family: Nunito, sans-serif;
          font-size: 1.35rem;
          color: #0F2340;
          margin: 32px 0 14px;
          line-height: 1.3;
        }
        .blog-content h3 {
          font-family: Nunito, sans-serif;
          font-size: 1.1rem;
          color: #0F2340;
          margin: 24px 0 10px;
        }
        .blog-content p {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: #4A5A70;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .blog-content ul, .blog-content ol {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          color: #4A5A70;
          line-height: 1.75;
          padding-left: 22px;
          margin-bottom: 16px;
        }
        .blog-content li { margin-bottom: 6px; }
        .blog-content strong { color: #0F2340; font-weight: 700; }
        .blog-content em { color: #1A82D8; font-style: italic; }
        .blog-content a { color: #1A82D8; font-weight: 600; text-decoration: underline; }
      `}</style>
    </div>
  )
}
