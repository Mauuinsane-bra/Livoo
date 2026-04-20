import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/sanity-queries'
import { urlFor, categoryColor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60 // revalida a cada 60s

export const metadata: Metadata = {
  title: 'Blog — Guias de Viagem e Eventos | Go Livoo',
  description: 'Guias completos para viajantes: como ir a corridas de F1, festivais, eventos esportivos e experiências únicas no mundo. Dicas práticas de documentação e roteiro.',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function postImageUrl(post: SanityBlogPost & { _fallbackImageUrl?: string }): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(800).url() } catch { /* empty */ }
  }
  return post._fallbackImageUrl ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
}

export default async function BlogPage() {
  const allPosts = (await getAllPosts()) as (SanityBlogPost & { _fallbackImageUrl?: string })[]
  const featured = allPosts.filter(p => p.featured)
  const rest = allPosts.filter(p => !p.featured)

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #2B9FEE 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(245,166,35,0.15)',
          color: '#F5A800',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 50,
          marginBottom: 20,
          border: '1px solid rgba(245,166,35,0.3)',
        }}>
          Guias e dicas
        </span>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Viaje com mais inteligência
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 560,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Guias práticos para quem viaja para experiências específicas: shows, corridas,
          festivais, hanami e muito mais. Documentação, custos, dicas locais — tudo aqui.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 64px' }}>

        {/* Destaques */}
        {featured.length > 0 && (
          <>
            <h2 style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '1.5rem',
              color: '#0F2340',
              marginBottom: 28,
            }}>
              Em destaque
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
              marginBottom: 56,
            }}>
              {featured.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(13,27,62,0.08)',
                    border: '1px solid #E2E8F0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ position: 'relative', height: 200 }}>
                      <Image
                        src={postImageUrl(post)}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 50%, rgba(13,27,62,0.7) 100%)',
                      }} />
                      <span style={{
                        position: 'absolute', top: 14, left: 14,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.7rem', fontWeight: 700,
                        color: '#fff',
                        background: categoryColor(post.category),
                        padding: '3px 10px', borderRadius: 50,
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {post.category}
                      </span>
                    </div>
                    <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '1.1rem',
                        color: '#0F2340',
                        marginBottom: 10,
                        lineHeight: 1.35,
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.85rem',
                        color: '#64748B',
                        lineHeight: 1.65,
                        flex: 1,
                        marginBottom: 16,
                      }}>
                        {post.excerpt}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9AAABB' }}>
                          {formatDate(post.publishedAt)} · {post.readTime} min
                        </span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#1A82D8' }}>
                          Ler artigo →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Todos os artigos */}
        {rest.length > 0 && (
          <>
            <h2 style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '1.5rem',
              color: '#0F2340',
              marginBottom: 28,
            }}>
              Mais artigos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '24px 28px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    gap: 24,
                    alignItems: 'center',
                  }}>
                    <div style={{
                      position: 'relative',
                      width: 120, height: 90,
                      borderRadius: 10,
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      <Image
                        src={postImageUrl(post)}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="120px"
                        unoptimized
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.7rem', fontWeight: 700,
                        color: categoryColor(post.category),
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {post.category}
                      </span>
                      <h3 style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '1.05rem',
                        color: '#0F2340',
                        margin: '6px 0 8px',
                        lineHeight: 1.3,
                      }}>
                        {post.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9AAABB' }}>
                          {formatDate(post.publishedAt)} · {post.readTime} min de leitura
                        </span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#1A82D8' }}>
                          Ler →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 56,
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '44px 48px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.5rem', color: '#fff', marginBottom: 12 }}>
            Pronto para montar sua viagem?
          </h3>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 500,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            Use a Go Livoo para gerar um roteiro completo com voo, hotel e documentação — em segundos.
          </p>
          <Link href="/" className="btn-gold">Gerar meu roteiro agora</Link>
        </div>
      </div>
    </div>
  )
}
