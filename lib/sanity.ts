// lib/sanity.ts — cliente Sanity para buscar dados no Next.js
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r1ne031h',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-04-20',
  useCdn: true,
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