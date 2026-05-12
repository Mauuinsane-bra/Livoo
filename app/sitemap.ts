// app/sitemap.ts — sitemap dinâmico com rotas estáticas + posts do blog
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/sanity-queries'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://livoo-two.vercel.app'

// Rotas estáticas com prioridade
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE,                             priority: 1.0, changeFrequency: 'daily'   },
  { url: `${BASE}/roteiro`,                priority: 0.9, changeFrequency: 'weekly'  },
  { url: `${BASE}/roteiros-curados`,       priority: 0.9, changeFrequency: 'weekly'  },
  { url: `${BASE}/eventos`,                priority: 0.9, changeFrequency: 'daily'   },
  { url: `${BASE}/passagens`,              priority: 0.8, changeFrequency: 'daily'   },
  { url: `${BASE}/voos-baratos`,           priority: 0.8, changeFrequency: 'daily'   },
  { url: `${BASE}/explorar-destinos`,      priority: 0.8, changeFrequency: 'daily'   },
  { url: `${BASE}/promocoes`,              priority: 0.8, changeFrequency: 'daily'   },
  { url: `${BASE}/hoteis`,                 priority: 0.7, changeFrequency: 'weekly'  },
  { url: `${BASE}/carros`,                 priority: 0.7, changeFrequency: 'weekly'  },
  { url: `${BASE}/onibus`,                 priority: 0.7, changeFrequency: 'weekly'  },
  { url: `${BASE}/guias`,                  priority: 0.7, changeFrequency: 'weekly'  },
  { url: `${BASE}/prep`,                   priority: 0.7, changeFrequency: 'monthly' },
  { url: `${BASE}/blog`,                   priority: 0.8, changeFrequency: 'daily'   },
  { url: `${BASE}/sobre`,                  priority: 0.4, changeFrequency: 'monthly' },
  { url: `${BASE}/contato`,                priority: 0.4, changeFrequency: 'monthly' },
  { url: `${BASE}/termos`,                 priority: 0.3, changeFrequency: 'monthly' },
  { url: `${BASE}/privacidade`,            priority: 0.3, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Posts do blog via Sanity
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogRoutes = posts
      .filter((p: { slug?: { current?: string }; publishedAt?: string }) => p?.slug?.current)
      .map((p: { slug: { current: string }; publishedAt?: string }) => ({
        url: `${BASE}/blog/${p.slug.current}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        priority: 0.7,
        changeFrequency: 'monthly' as const,
      }))
  } catch {
    // Sanity offline — só rotas estáticas
  }

  return [...staticRoutes, ...blogRoutes]
}
