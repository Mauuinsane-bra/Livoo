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
  publishedAt,
  readTime,
  tags,
  featured
`

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<SanityBlogPost[]> {
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(
      `*[_type == "blogPost"] | order(publishedAt desc) { ${POST_FIELDS} }`
    )
    if (posts && posts.length > 0) return posts
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
    const post = await sanityClient.fetch<SanityBlogPost>(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        ${POST_FIELDS},
        content,
        autoPost
      }`,
      { slug }
    )
    if (post?._id) return post
  } catch (err) {
    console.info('[Go Livoo] Sanity getPostBySlug: usando fallback local', err)
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

export async function getAllSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(
      `*[_type == "blogPost"]{ "slug": slug.current }`
    )
    if (slugs?.leng