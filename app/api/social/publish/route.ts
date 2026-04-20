/**
 * POST /api/social/publish
 *
 * Webhook chamado pelo Sanity quando um post é publicado.
 * Fluxo:
 *  1. Valida assinatura do Sanity
 *  2. Verifica se autoPost = true
 *  3. Busca o post completo do Sanity
 *  4. Gera legenda com Claude (Anthropic)
 *  5. Posta no Instagram Business
 *  6. Posta na Página do Facebook
 *
 * Configurar no Sanity:
 *  manage.sanity.io → projeto → API → Webhooks → + Add Webhook
 *  URL: https://livoo-two.vercel.app/api/social/publish
 *  Dataset: production
 *  Trigger on: Create, Update
 *  Filter: _type == "blogPost" && autoPost == true
 *  HTTPS method: POST
 *  Secret: (valor de SANITY_WEBHOOK_SECRET)
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { sanityClient } from '@/lib/sanity'

// ─── Verificação de assinatura do Sanity ─────────────────────────────────────
async function verifySanitySignature(req: NextRequest, body: string): Promise<boolean> {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) return true // sem secret configurado: aceitar (dev)

  const signature = req.headers.get('sanity-webhook-signature')
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const [, ts, v1] = signature.split(',').reduce((acc, part) => {
    const [k, v] = part.split('=')
    acc[k === 't' ? 1 : k === 'v1' ? 2 : 0] = v
    return acc
  }, ['', '', ''])

  const data = encoder.encode(`${ts}.${body}`)
  const sig = Buffer.from(v1, 'hex')
  return crypto.subtle.verify('HMAC', key, sig, data)
}

// ─── Gerar legenda com Claude ─────────────────────────────────────────────────
async function generateCaption(post: {
  title: string
  excerpt: string
  category: string
  slug: string
}): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `Você é o social media da Go Livoo, uma plataforma brasileira para quem viaja para experiências únicas (shows, corridas de F1, festivais, rally etc).

Crie uma legenda para o Instagram sobre este artigo do blog:

Título: ${post.title}
Categoria: ${post.category}
Resumo: ${post.excerpt}
Link: https://golivoo.com.br/blog/${post.slug}

Regras:
- Máximo 2200 caracteres (limite do Instagram)
- Tom empolgante mas autêntico, sem exageros
- Fale para quem AMa viajar para experiências específicas
- Inclua 3-5 emojis relevantes (não exagere)
- Termine com CTA: "Link na bio para ler o guia completo."
- Inclua 8-12 hashtags relevantes no final (misture grande e nicho)
- NÃO inclua o URL no corpo — só mencione "link na bio"

Escreva apenas a legenda, sem explicações adicionais.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0]
  return text.type === 'text' ? text.text : ''
}

// ─── Postar no Instagram ──────────────────────────────────────────────────────
async function postToInstagram(caption: string, imageUrl: string): Promise<boolean> {
  const igId = process.env.META_INSTAGRAM_ID
  const token = process.env.META_ACCESS_TOKEN
  if (!igId || !token) {
    console.info('[Go Livoo] META_INSTAGRAM_ID ou META_ACCESS_TOKEN não configurado — pulando Instagram')
    return false
  }

  // 1. Criar container de mídia
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${igId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: token,
      }),
    }
  )
  const container = await containerRes.json()
  if (!container.id) {
    console.error('[Go Livoo] Instagram media container falhou:', container)
    return false
  }

  // 2. Publicar o container
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${igId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: token,
      }),
    }
  )
  const published = await publishRes.json()
  if (published.id) {
    console.info('[Go Livoo] Postado no Instagram:', published.id)
    return true
  }
  console.error('[Go Livoo] Instagram publish falhou:', published)
  return false
}

// ─── Postar no Facebook ───────────────────────────────────────────────────────
async function postToFacebook(caption: string, imageUrl: string, articleUrl: string): Promise<boolean> {
  const pageId = process.env.META_PAGE_ID
  const token = process.env.META_ACCESS_TOKEN
  if (!pageId || !token) {
    console.info('[Go Livoo] META_PAGE_ID ou META_ACCESS_TOKEN não configurado — pulando Facebook')
    return false
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/photos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message: `${caption}\n\n🔗 ${articleUrl}`,
        access_token: token,
      }),
    }
  )
  const data = await res.json()
  if (data.id) {
    console.info('[Go Livoo] Postado no Facebook:', data.id)
    return true
  }
  console.error('[Go Livoo] Facebook post falhou:', data)
  return false
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.text()

  const valid = await verifySanitySignature(req, body)
  if (!valid) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  // Sanity envia _id do documento no webhook
  const docId: string = payload._id || payload.documentId
  if (!docId) {
    return NextResponse.json({ error: 'Sem _id no payload' }, { status: 400 })
  }

  // Buscar documento completo do Sanity
  const post = await sanityClient.fetch(
    `*[_id == $id][0]{
      title,
      "slug": slug.current,
      excerpt,
      category,
      autoPost,
      coverImage { asset->{ url } }
    }`,
    { id: docId }
  )

  if (!post) {
    return NextResponse.json({ error: 'Post não encontrado no Sanity' }, { status: 404 })
  }

  if (!post.autoPost) {
    return NextResponse.json({ skipped: true, reason: 'autoPost desativado neste post' })
  }

  // URL da imagem de capa (necessária para o Instagram)
  const imageUrl: string = post.coverImage?.asset?.url
  if (!imageUrl) {
    return NextResponse.json({ error: 'Post sem imagem de capa — necessária para Instagram' }, { status: 400 })
  }

  // Gerar legenda com Claude
  const caption = await generateCaption({
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    slug: post.slug,
  })

  if (!caption) {
    return NextResponse.json({ error: 'Falha ao gerar legenda com Claude' }, { status: 500 })
  }

  const articleUrl = `https://golivoo.com.br/blog/${post.slug}`

  // Postar em paralelo
  const [igOk, fbOk] = await Promise.all([
    postToInstagram(caption, imageUrl),
    postToFacebook(caption, imageUrl, articleUrl),
  ])

  return NextResponse.json({
    success: true,
    instagram: igOk,
    facebook: fbOk,
    caption,
  })
}
