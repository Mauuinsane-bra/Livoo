'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CATS = [
  { label: 'Tudo', slug: '', count: 248 },
  { label: 'Destinos', slug: 'destinos', count: 62 },
  { label: 'Eventos', slug: 'eventos', count: 38 },
  { label: 'Guias', slug: 'guias', count: 54 },
  { label: 'Econômico', slug: 'economico', count: 41 },
  { label: 'Família', slug: 'familia', count: 29 },
  { label: 'Solo', slug: 'solo', count: 24 },
]

export default function BlogSubnav() {
  const pathname = usePathname()

  return (
    <nav className="blog-subnav">
      <div className="inner">
        <Link href="/blog" className="brand">
          Blog da <span className="d">Go Livoo</span>
        </Link>
        <div className="cats">
          {CATS.map(c => {
            const href = c.slug ? `/blog/categoria/${c.slug}` : '/blog'
            const isOn = c.slug
              ? pathname.startsWith(`/blog/categoria/${c.slug}`)
              : pathname === '/blog'
            return (
              <Link key={c.slug} href={href} className={isOn ? 'on' : ''}>
                {c.label} <span className="n">{c.count}</span>
              </Link>
            )
          })}
        </div>
        <span className="chip">
          <span className="dot" />
          3 posts novos essa semana
        </span>
      </div>
    </nav>
  )
}
