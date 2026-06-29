// app/api/roteiro/pdf/route.ts
// POST /api/roteiro/pdf — gera o PDF do roteiro e envia por e-mail (Resend)
import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'
import { buildRoteiroPdf } from '@/lib/roteiro-pdf'
import type { FullItinerary } from '@/app/api/roteiro/route'

export const runtime = 'nodejs'
export const maxDuration = 120

const rateLimit = createRateLimiter('roteiro-pdf', { maxRequests: 5, windowMs: 60_000 })
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function slugify(s: string): string {
  return (s || 'roteiro')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'roteiro'
}

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

    // Gera o PDF
    const pdf = await buildRoteiroPdf(itinerary, { clientName: clientName || undefined })
    const filename = `Roteiro_${slugify(itinerary.destination)}_GoLivoo.pdf`

    // Envia via Resend (mesmo padrão fetch usado em /api/waitlist)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Go Livoo <onboarding@resend.dev>',
        to: [email],
        subject: `Seu roteiro Go Livoo — ${itinerary.destination}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#0F2340;line-height:1.6">
            <h2 style="margin:0 0 8px">Seu roteiro para ${itinerary.destination} chegou! ✈️</h2>
            <p style="color:#374151">Olá${clientName ? ' ' + clientName : ''}, seu roteiro personalizado da Go Livoo está em anexo neste e-mail, em PDF — pronto para imprimir ou levar no celular.</p>
            <p style="color:#374151">${itinerary.duration}${itinerary.totalBudget ? ` · orçamento estimado R$ ${itinerary.totalBudget.toLocaleString('pt-BR')}` : ''}.</p>
            <p style="color:#64748B;font-size:13px">Quando quiser, a Go Livoo resolve voos, hotéis e documentação por você em golivoo.com.br.</p>
          </div>
        `,
        attachments: [{ filename, content: pdf.toString('base64') }],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[roteiro/pdf] Resend falhou:', res.status, detail)
      return NextResponse.json({ error: 'Não foi possível enviar o e-mail agora. Tente novamente.' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[roteiro/pdf] erro:', err)
    return NextResponse.json({ error: 'Erro ao gerar o PDF.' }, { status: 500 })
  }
}
