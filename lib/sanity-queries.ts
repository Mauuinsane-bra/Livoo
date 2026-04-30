// lib/sanity-queries.ts — GROQ queries reutilizáveis
import { sanityClient, type SanityBlogPost } from './sanity'
import { BLOG_POSTS } from './blog-data'
import { MEXICO_COPA_2026_HTML } from './content/mexico-copa-2026'

// Campos comuns sem content (para listagens)
const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  coverImage { asset, alt },
  coverImageUrl,
  publishedAt,
  readTime,
  tags,
  featured
`

// ─── Queries ────────────────────────────────────────────────────────────────


// ─── Fallback de imagem — Wikipedia bloqueia hotlinking ─────────────────────
// Mapa de palavras-chave de URL do Wikipedia → imagem Unsplash equivalente
const WIKI_TO_UNSPLASH: Array<[RegExp, string]> = [
  [/mexico|méxico|zocalo|cidade.*mexico|mexico.*city/i, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1400&q=80'],
  [/estadio|stadium|arena|futbol|football/i, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1400&q=80'],
  [/cancun|cancún|guadalajara|monterrey/i, 'https://images.unsplash.com/photo-1512813389649-acb9131ced20?auto=format&fit=crop&w=1400&q=80'],
  [/copa.*mundo|world.*cup|fifa/i, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80'],
]

export function sanitizeImageUrl(url: string | undefined, hint?: string): string {
  if (!url) return ''
  // Wikipedia e Wikimedia bloqueiam hotlinking — substituir por Unsplash
  if (url.includes('wikimedia.org') || url.includes('wikipedia.org')) {
    const text = (hint ?? '') + url
    for (const [re, replacement] of WIKI_TO_UNSPLASH) {
      if (re.test(text)) return replacement
    }
    // Fallback genérico de viagem
    return 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80'
  }
  return url
}


// ─── Fallback de conteúdo rico por palavra-chave ─────────────────────────────
// Injeta _fallbackContent em posts do Sanity que vieram sem imagens no corpo.
const RICH_CONTENT_MAP: Array<[RegExp, string]> = [
  [/mexico|méxico|copa.*mundo.*2026|copa do mundo 2026/i, MEXICO_COPA_2026_HTML],
]

function findRichContent(title = '', category = ''): string | null {
  const text = title + ' ' + category
  for (const [re, html] of RICH_CONTENT_MAP) {
    if (re.test(text)) return html
  }
  return null
}

export async function getAllPosts(): Promise<SanityBlogPost[]> {
  try {
    const posts = await sanityClient.fetch<(SanityBlogPost & { coverImageUrl?: string })[]>(
      `*[_type == "blogPost"] | order(publishedAt desc) { ${POST_FIELDS} }`
    )
    if (posts && posts.length > 0) {
      // Propaga coverImageUrl como _fallbackImageUrl para posts sem Sanity image
      return posts.map(p => {
        if (!p.coverImage && p.coverImageUrl) {
          (p as SanityBlogPost & { _fallbackImageUrl?: string })._fallbackImageUrl = sanitizeImageUrl(p.coverImageUrl, p.title)
        }
        return p
      })
    }
  } catch (err) {
    console.info('[Go Livoo] Sanity getAllPosts: usando fallback local', err)
  }
  // Fallback para dados locais (lib/blog-data.ts) enquanto Sanity não tem posts
  return BLOG_POSTS.map(p => ({
    _id: p.slug,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: undefined,
    publishedAt: p.date,
    readTime: p.readTime,
    tags: p.tags,
    featured: p.featured,
    _fallbackImageUrl: p.imageUrl,
  } as SanityBlogPost & { _fallbackImageUrl?: string }))
}

export async function getLatestPosts(limit = 3): Promise<SanityBlogPost[]> {
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(
      `*[_type == "blogPost"] | order(publishedAt desc)[0...${limit}] { ${POST_FIELDS} }`
    )
    if (posts && posts.length > 0) return posts
  } catch (err) {
    console.info('[Go Livoo] Sanity getLatestPosts: usando fallback local', err)
  }
  return BLOG_POSTS.slice(0, limit).map(p => ({
    _id: p.slug,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: undefined,
    publishedAt: p.date,
    readTime: p.readTime,
    featured: p.featured,
    _fallbackImageUrl: p.imageUrl,
  } as SanityBlogPost & { _fallbackImageUrl?: string }))
}

export async function getPostBySlug(slug: string): Promise<(SanityBlogPost & { _fallbackImageUrl?: string; _fallbackContent?: string }) | null> {
  try {
    const post = await sanityClient.fetch<SanityBlogPost & { coverImageUrl?: string }>(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        ${POST_FIELDS},
        content,
        autoPost,
        coverImageUrl
      }`,
      { slug },
      { cache: 'no-store' }   // força busca sempre fresh, nunca usa cache do Next.js
    )
    if (post?._id) {
      // Se não tem imagem Sanity mas tem URL externa, usa como fallback
      if (!post.coverImage && post.coverImageUrl) {
        (post as SanityBlogPost & { _fallbackImageUrl?: string })._fallbackImageUrl = sanitizeImageUrl(post.coverImageUrl, post.title)
      }
      // Se o Sanity não tem imagens no corpo do artigo, injeta conteúdo rico local
      const hasContentImages = Array.isArray(post.content) && post.content.some((b: any) => b._type === 'image')
      if (!hasContentImages) {
        const richHtml = findRichContent(post.title, post.category)
        if (richHtml) {
          (post as SanityBlogPost & { _fallbackContent?: string })._fallbackContent = richHtml
        }
      }
      return post
    }
    // post retornou mas sem _id → loga para diagnóstico
    if (post !== null && post !== undefined) {
      console.error('[Go Livoo] getPostBySlug: Sanity retornou objeto sem _id para slug:', slug, post)
    }
  } catch (err) {
    console.error('[Go Livoo] getPostBySlug ERRO para slug:', slug, err)
  }
  // Fallback local
  const local = BLOG_POSTS.find(p => p.slug === slug)
  if (!local) return null
  return {
    _id: local.slug,
    title: local.title,
    slug: local.slug,
    excerpt: local.excerpt,
    category: local.category,
    coverImage: undefined,
    publishedAt: local.date,
    readTime: local.readTime,
    tags: local.tags,
    featured: local.featured,
    _fallbackImageUrl: local.imageUrl,
    _fallbackContent: local.content,
  }
}

export async function getPostsByCategory(category: string): Promise<SanityBlogPost[]> {
  // "copa-do-mundo" slug → filtra por categoria "Copa do Mundo 2026" no Sanity
  const sanityCat = category === 'copa-do-mundo' ? 'Copa do Mundo 2026' : category
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(
      `*[_type == "blogPost" && (string::lower(category) == $cat || category == $catExact)] | order(publishedAt desc) { ${POST_FIELDS} }`,
      { cat: category.toLowerCase(), catExact: sanityCat }
    )
    if (posts && posts.length > 0) return posts
  } catch (err) {
    console.info('[Go Livoo] Sanity getPostsByCategory: usando fallback local', err)
  }
  return []
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(
      `*[_type == "blogPost"]{ "slug": slug.current }`
    )
    if (slugs?.length > 0) return slugs.map(s => s.slug)
  } catch (err) {
    console.info('[Go Livoo] Sanity getAllSlugs: usando fallback local', err)
  }
  return BLOG_POSTS.map(p => p.slug)
}
