'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BirdAzulNavy from '../../components/BirdAzulNavy'

const CATS = [
  { label: 'Tudo', slug: '' },
  { label: 'Copa 2026', slug: 'copa-do-mundo' },
  { label: 'Destinos', slug: 'destinos' },
  { label: 'Eventos', slug: 'eventos' },
  { label: 'Guias', slug: 'guias' },
]

export default function BlogSubnav() {
  const pathname = usePathname()

  return (
    <nav className="blog-subnav">
      <div className="inner">
        <Link href="/blog" className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BirdAzulNavy size={34} />
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
                {c.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
