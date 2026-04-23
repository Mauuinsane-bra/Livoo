// app/api/sanity-check/route.ts — diagnóstico temporário da conexão Sanity
import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug') ?? ''

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0tdmg2yt'

    // Lista todos os posts (mesmo que seja 0)
    const allPosts = await sanityClient.fetch<{ _id: string; title: string; slug: string }[]>(
      `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, "slug": slug.current, publishedAt }`
    )

    // Busca por slug específico se fornecido
    let bySlug = null
    if (slug) {
      bySlug = await sanityClient.fetch(
        `*[_type == "blogPost" && slug.current == $slug][0] { _id, title, "slug": slug.current }`,
        { slug }
      )
    }

    return NextResponse.json({
      ok: true,
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      totalPosts: allPosts.length,
      allPosts,
      slugQueried: slug || '(nenhum)',
      bySlug,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
