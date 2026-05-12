// app/robots.ts — gerado automaticamente pelo Next.js App Router
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://livoo-two.vercel.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/', '/entrar/', '/cadastro/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
