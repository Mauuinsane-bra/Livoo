// lib/sanity-queries.ts — GROQ queries reutilizáveis
import { sanityClient, type SanityBlogPost } from './sanity'
import { BLOG_POSTS } from './blog-data'

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

export async function getAllPosts(): Promise<SanityBlogPost[]> {
  try {
    const posts = await sanityClient.fetch<(SanityBlogPost & { coverImageUrl?: string })[]>(
      `*[_type == "blogPost"] | order(publishedAt desc) { ${POST_FIELDS} }`
    )
    if (posts && posts.length > 0) {
      // Propaga coverImageUrl como _fallbackImageUrl para posts sem Sanity image
      return posts.map(p => {
        if (!p.coverImage && p.coverImageUrl) {
          (p as SanityBlogPost & { _fallbackImageUrl?: string })._fallbackImageUrl = p.coverImageUrl
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
        (post as SanityBlogPost & { _fallbackImageUrl?: string })._fallbackImageUrl = post.coverImageUrl
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
    console.info('[Go Livoo] Sanity getPostsB