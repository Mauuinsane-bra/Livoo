import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPostsByCategory, getAllPosts } from '@/lib/sanity-queries'
import { urlFor, type SanityBlogPost } from '@/lib/sanity'

export const revalidate = 60

const CAT_META: Record<string, {
  label: string
  description: string
  count: number
  articles: number
  saved: string
  reads: string
  keyword: string
}> = {
  destinos: {
    label: 'Destinos',
    description: 'Os melhores destinos para quem quer uma experiência única — com roteiros práticos, dicas de custo real e o que ninguém te conta antes de ir.',
    count: 62,
    articles: 62,
    saved: '14.8k',
    reads: '312k',
    keyword: 'Destinos',
  },
  eventos: {
    label: 'Eventos',
    description: 'F1, rock, rally, festivais e tudo que vale uma viagem. Antes, durante e depois do evento — a Go Livoo cobre tudo.',
    count: 38,
    articles: 38,
    saved: '9.2k',
    reads: '198k',
    keyword: 'Eventos',
  },
  guias: {
    label: 'Guias',
    description: 'Guias práticos e diretos ao ponto. Documentação, vistos, vacinas, câmbio — o que você precisa saber antes de embarcar.',
    count: 54,
    articles: 54,
    saved: '21.3k',
    reads: '445k',
    keyword: 'Guias',
  },
  economico: {
    label: 'Econômico',
    description: 'Viajar bem gastando pouco é arte. Aqui você encontra as melhores estratégias para maximizar sua experiência sem esvaziar o bolso.',
    count: 41,
    articles: 41,
    saved: '18.6k',
    reads: '387k',
    keyword: 'Econômico',
  },
  familia: {
    label: 'Família',
    description: 'Roteiros pensados para quem viaja com crianças — destinos family-friendly, dicas de logística e experiências que todo mundo curte.',
    count: 29,
    articles: 29,
    saved: '7.4k',
    reads: '156k',
    keyword: 'Família',
  },
  solo: {
    label: 'Solo',
    description: 'Viajar sozinho é uma das experiências mais transformadoras que existem. Segurança, liberdade e as melhores rotas para viajantes solo.',
    count: 24,
    articles: 24,
    saved: '5.1k',
    reads: '108k',
    keyword: 'Solo',
  },
}

const STATIC_POSTS_BY_CAT: Record<string, Array<{
  slug: string; title: string; excerpt: string; category: string;
  date: string; readTime: string; author: string; imageUrl: string; tags: string[]
}>> = {
  destinos: [
    { slug: 'georgia-um-destino-que-poucos-conhecem', title: 'Geórgia: o destino europeu que poucos brasileiros conhecem (e por que você deveria ir)', excerpt: 'Tbilisi tem vinho milenar, montanhas absurdas e custo de vida menor que o Brasil. Um guia completo para chegar, se hospedar e aproveitar o melhor da Geórgia.', category: 'Destinos', date: '2026-04-12', readTime: '11 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=640&q=80', tags: ['Geórgia', 'Europa', 'Aventura'] },
    { slug: 'monaco-alem-da-formula-1', title: 'Mônaco além da Fórmula 1: o que fazer nos outros 364 dias do ano', excerpt: 'O principado mais famoso do mundo tem muito mais a oferecer do que uma corrida. Cassinos, praias, gastronomia estrelada e roteiros para todos os bolsos.', category: 'Destinos', date: '2026-03-28', readTime: '9 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80', tags: ['Mônaco', 'Europa', 'Luxo'] },
    { slug: 'rio-de-janeiro-para-estrangeiros', title: 'Rio de Janeiro visto por quem mora aqui: o guia sem mentira', excerpt: 'Esqueça o roteiro clichê. Este é o Rio dos bairros escondidos, dos botequins reais e das praias que os turistas ainda não descobriram.', category: 'Destinos', date: '2026-03-15', readTime: '13 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=640&q=80', tags: ['Rio', 'Brasil', 'Praia'] },
    { slug: 'toquio-guia-completo-2026', title: 'Tóquio 2026: guia completo para a primeira viagem', excerpt: 'Da chegada ao aeroporto ao último bowl de ramen antes de voltar. Tudo que você precisa saber para aproveitar Tóquio sem estresse e sem gastar uma fortuna.', category: 'Destinos', date: '2026-02-20', readTime: '15 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&q=80', tags: ['Japão', 'Ásia', 'Cultura'] },
  ],
  eventos: [
    { slug: 'rock-in-rio-2026-guia-completo', title: 'Rock in Rio 2026: guia completo para quem vai pela primeira vez', excerpt: 'Datas, line-up confirmado, como comprar ingresso, onde se hospedar em SP e o que levar na mochila. Tudo que você precisa saber antes de entrar na Cidade do Rock.', category: 'Eventos', date: '2026-04-10', readTime: '10 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=640&q=80', tags: ['Rock in Rio', 'Festival', 'Brasil'] },
    { slug: 'gp-monaco-2026-como-assistir', title: 'GP de Mônaco 2026: como assistir ao vivo sem pagar uma fortuna', excerpt: 'Os ingressos são caros, sim. Mas existem estratégias para assistir ao GP mais glamouroso do mundo por uma fração do preço oficial. Confira.', category: 'Eventos', date: '2026-04-05', readTime: '8 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1541773367336-d3f401e89a16?w=640&q=80', tags: ['F1', 'Mônaco', 'Europa'] },
  ],
  guias: [
    { slug: 'visto-para-georgia-brasileiro', title: 'Visto para a Geórgia: brasileiro precisa? Tudo sobre entrada, prazo e documentação', excerpt: 'A boa notícia: brasileiros têm entrada gratuita na Geórgia por até 365 dias. A má notícia: muita gente ainda não sabe disso e desiste antes de pesquisar.', category: 'Guias', date: '2026-04-08', readTime: '7 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=640&q=80', tags: ['Visto', 'Documentação', 'Geórgia'] },
    { slug: 'passaporte-brasileiro-2026', title: 'Passaporte brasileiro em 2026: como renovar, prazo e quanto custa', excerpt: 'O passaporte vencido é o motivo número 1 de viagens canceladas em cima da hora. Veja como renovar online, o prazo atual e quando vale a pena pagar a taxa de urgência.', category: 'Guias', date: '2026-03-22', readTime: '6 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=640&q=80', tags: ['Passaporte', 'Documentação', 'Brasil'] },
  ],
  economico: [
    { slug: 'voos-baratos-europa-2026', title: 'Como encontrar voos baratos para a Europa em 2026', excerpt: 'Alertas de preço, janelas de compra, aeroportos alternativos e os erros que fazem a maioria das pessoas pagar muito mais do que precisa.', category: 'Econômico', date: '2026-04-14', readTime: '9 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=640&q=80', tags: ['Voos', 'Europa', 'Economia'] },
  ],
  familia: [
    { slug: 'orlando-com-criancas-guia-2026', title: 'Orlando com crianças em 2026: o guia definitivo sem mentira', excerpt: 'Parques, hotéis, quanto custa de verdade e as dicas que só quem foi com crianças pequenas sabe. Planejamento de A a Z para uma viagem sem estresse.', category: 'Família', date: '2026-03-10', readTime: '14 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=640&q=80', tags: ['Orlando', 'Família', 'EUA'] },
  ],
  solo: [
    { slug: 'viajar-solo-pela-primeira-vez', title: 'Viajar sozinho pela primeira vez: o guia honesto para quem tem medo', excerpt: 'O medo é normal. A solidão dura três dias. Depois disso, você entende por que tanta gente nunca mais quis viajar de outro jeito. Guia prático e sem romantismo excessivo.', category: 'Solo', date: '2026-03-05', readTime: '12 min', author: 'Equipe Go Livoo', imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=640&q=80', tags: ['Solo', 'Iniciante', 'Mindset'] },
  ],
}

const GRADIENTS = [
  'linear-gradient(135deg,#ff7a45,#ff3e5a)',
  'linear-gradient(135deg,#2b74ff,#06a06b)',
  'linear-gradient(135deg,#ff5a1f,#ffb800)',
  'linear-gradient(135deg,#06a06b,#2b74ff)',
  'linear-gradient(135deg,#ff3e5a,#ff5a1f)',
  'linear-gradient(135deg,#ffb800,#ff7a45)',
]

type Post = SanityBlogPost & { _fallbackImageUrl?: string }

export async function generateStaticParams() {
  return Object.keys(CAT_META).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = CAT_META[params.slug]
  if (!meta) return { title: 'Categoria — Blog Go Livoo' }
  return {
    title: `${meta.label} — Blog Go Livoo`,
    description: meta.description,
  }
}

function postImg(post: Post, idx: number): string {
  if (post.coverImage) {
    try { return urlFor(post.coverImage).width(560).url() } catch { /* */ }
  }
  if (post._fallbackImageUrl) return post._fallbackImageUrl
  return ''
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const meta = CAT_META[slug] ?? {
    label: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Categoria',
    description: 'Posts desta categoria.',
    count: 0, articles: 0, saved: '0', reads: '0', keyword: slug,
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
          <div className="cat-stats">
            <div>
              <div className="cat-stat-val">{meta.articles}</div>
              <div className="cat-stat-lbl">artigos publicados</div>
            </div>
            <div>
              <div className="cat-stat-val">{meta.saved}</div>
              <div className="cat-stat-lbl">salvamentos</div>
            </div>
            <div>
              <div className="cat-stat-val">{meta.reads}</div>
              <div className="cat-stat-lbl">leituras totais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="cat-toolbar">
        <div className="cat-toolbar-inner">
          {['Todos', 'Mais recentes', 'Mais salvos', 'Mais lidos', 'Com vídeo'].map((f, i) => (
            <span key={f} className={`cat-pill${i === 0 ? ' active' : ''}`}>{f}</span>
          ))}
          <span className="cat-sort">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Ordenar
          </span>
        </div>
      </div>

      {/* Post list */}
      <div className="cat-list">
        <div className="cat-list-count">
          {hasSanity ? sanityPosts.length : staticFallback.length} artigos em {meta.label}
        </div>

        {hasSanity ? (
          sanityPosts.map((post, idx) => {
            const img = postImg(post, idx)
            const av = 'G'
            return (
              <Link key={post._id} href={`/blog/${post.slug ?? post._id}`} className="cat-post">
                <div className="cat-post-img">
                  {img ? (
                    <Image src={img} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized />
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

        {/* Pagination */}
        {(hasSanity ? sanityPosts.length : staticFallback.length) > 0 && (
          <div className="cat-pagination">
            <span className="cat-page-btn" style={{ opacity: .4, cursor: 'default' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <a href="#" className="cat-page-btn active">1</a>
            <a href="#" className="cat-page-btn">2</a>
            <a href="#" className="cat-page-btn">3</a>
            <span className="cat-page-dots">···</span>
            <a href="#" className="cat-page-btn">8</a>
            <a href="#" className="cat-page-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
