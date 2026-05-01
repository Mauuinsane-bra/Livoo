// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const addr = (email ?? '').toString().trim()

    if (!addr || !EMAIL_REGEX.test(addr)) {
      return NextResponse.json({ error: 'Por favor, insira um email válido.' }, { status: 400 })
    }

    const NOTIFY = process.env.RESEND_NOTIFY_EMAIL ?? 'contato@golivoo.com.br'

    if (process.env.RESEND_API_KEY) {
      const headers = {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      }
      const from = 'Go Livoo <onboarding@resend.dev>'

      Promise.all([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from,
            to: NOTIFY,
            subject: `[Newsletter] Novo inscrito: ${addr}`,
            html: `<div style="font-family:Arial,sans-serif;padding:20px"><h2>Novo inscrito na newsletter</h2><p><strong>Email:</strong> ${addr}</p></div>`,
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from,
            to: addr,
            subject: 'Você está na lista da Go Livoo!',
            html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;border:1px solid #eee;border-radius:12px"><h2 style="color:#0D1B3E">Boa notícia!</h2><p style="color:#555;line-height:1.7">Você foi inscrito na newsletter da <strong>Go Livoo</strong>. Em breve você vai receber as melhores dicas de viagem, destinos e alertas de preço.</p><p style="color:#888;font-size:12px">Até breve — Equipe Go Livoo</p></div>`,
          }),
        }),
      ]).catch(err => console.warn('[newsletter] Erro ao enviar emails:', err))
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
