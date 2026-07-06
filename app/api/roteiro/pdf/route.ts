// app/api/roteiro/pdf/route.ts
// POST /api/roteiro/pdf — gera o PDF do roteiro e envia por e-mail (Resend)
// A geração + envio vive em lib/roteiro-email.ts (compartilhada com o envio
// automático pós-pagamento em /api/roteiro).
import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'
import { sendRoteiroPdfEmail } from '@/lib/roteiro-email'
import type { FullItinerary } from '@/lib/roteiro-types'

export const runtime = 'nodejs'
export const maxDuration = 120

const rateLimit = createRateLimiter('roteiro-pdf', { maxRequests: 5, windowMs: 60_000 })
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  try {
    const body = await req.json() as { itinerary?: FullItinerary; email?: string; clientName?: string }
    const email = (body.email ?? '').trim()
    const clientName = sanitizeString(body.clientName ?? '', 60).trim()
    const itinerary = body.itinerary

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 })
    }
    if (!itinerary || !Array.isArray(itinerary.dayByDay) || itinerary.dayByDay.length === 0) {
      return NextResponse.json({ error: 'Roteiro inválido.' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Envio de e-mail não configurado. Adicione RESEND_API_KEY.' },
        { status: 503 },
      )
    }

    await sendRoteiroPdfEmail(itinerary, email, clientName || undefined)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[roteiro/pdf] erro:', err)
    return NextResponse.json({ error: 'Não foi possível enviar o e-mail agora. Tente novamente.' }, { status: 500 })
  }
}
