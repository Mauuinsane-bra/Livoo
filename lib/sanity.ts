// lib/sanity.ts — cliente Sanity para buscar dados no Next.js
// Usa @sanity/client diretamente (sem next-sanity) para compatibilidade com Next.js 16
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Tipo compatível com @sanity/image-url sem depender de path interno do pacote
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0tdmg2yt',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-04-20',
  useCdn: false,   // false = API direta, sem delay de CDN — posts aparecem imediatamente após publicar
  // token de leitura (opcional — necessário apenas para conteúdo privado)
  // token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Tipos ─────────────────────────────────────────────────────────────────

export interface SanityBlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content?: any[]          // Portable Text
  category: string
  coverImage?: SanityImageSource & { alt?: string }
  publishedAt: string
  readTime: number
  tags?: string[]
  featured?: boolean
  autoPost?: boolean
}

// Mapa de cor por categoria (mantido local para evitar dados no CMS)
export const CATEGORY_COLORS: Record<string, string> = {
  'Automobilismo': '#7c3aed',
  'Festivais':     '#db2777',
  'Cultura':       '#0891b2',
  'Dicas de Viagem': '#16a34a',
  'Esportes':      '#ea580c',
  'Aventura':      '#b45309',
  'Gastronomia':   '#9333ea',
}

export function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? '#1A82D8'
}