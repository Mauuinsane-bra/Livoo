// lib/roteiro-email.ts
// Gera o PDF do roteiro e envia por e-mail via Resend.
// Usado em dois lugares: envio automático pós-pagamento (/api/roteiro, mode full)
// e envio manual pelo card "Receba em PDF" (/api/roteiro/pdf).
//
// ⚠️ Enquanto o domínio golivoo.com.br não for verificado no Resend, o
// remetente onboarding@resend.dev só entrega para o e-mail dono da conta Resend.

import { buildRoteiroPdf } from '@/lib/roteiro-pdf'
import type { FullItinerary } from '@/lib/roteiro-types'

function slugify(s: string): string {
  return (s || 'roteiro')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'roteiro'
}

export async function sendRoteiroPdfEmail(
  itinerary: FullItinerary,
  email: string,
  clientName?: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não configurada')
  }

  const pdf = await buildRoteiroPdf(itinerary, { clientName: clientName || undefined })
  const filename = `Roteiro_${slugify(itinerary.destination)}_GoLivoo.pdf`

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
    throw new Error(`Resend falhou: ${res.status} ${detail}`)
  }
}
