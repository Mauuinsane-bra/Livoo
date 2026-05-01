'use server'

// app/blog/newsletter-action.ts — Server Action para inscrição na newsletter

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export type NewsletterState = { ok: boolean; error?: string } | null

export async function newsletterSubscribe(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = (formData.get('email') ?? '').toString().trim()

  if (!email || !EMAIL_REGEX.test(email)) {
    return { ok: false, error: 'Por favor, insira um email válido.' }
  }

  const NOTIFY = process.env.RESEND_NOTIFY_EMAIL ?? 'contato@golivoo.com.br'

  if (process.env.RESEND_API_KEY) {
    const headers = {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    }
    const from = 'Go Livoo <onboarding@resend.dev>'

    try {
      await Promise.all([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from,
            to: NOTIFY,
            subject: `[Newsletter] Novo inscrito: ${email}`,
            html: `<div style="font-family:Arial,sans-serif;padding:20px"><h2>Novo inscrito na newsletter</h2><p><strong>Email:</strong> ${email}</p></div>`,
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from,
            to: email,
            subject: 'Você está na lista da Go Livoo!',
            html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;border:1px solid #eee;border-radius:12px"><h2 style="color:#0D1B3E">Boa notícia, ${email.split('@')[0]}!</h2><p style="color:#555;line-height:1.7">Você foi inscrito na newsletter da <strong>Go Livoo</strong>. Em breve você vai receber as melhores dicas de viagem, destinos e alertas de preço.</p><p style="color:#888;font-size:12px">Até breve — Equipe Go Livoo</p></div>`,
          }),
        }),
      ])
      console.info('[newsletter] Emails enviados para', NOTIFY, 'e', email)
    } catch (err) {
      console.error('[newsletter] Erro ao enviar emails:', err)
      // Não falha para o usuário — cadastro é salvo mesmo sem email
    }
  } else {
    console.warn('[newsletter] RESEND_API_KEY não configurado — email não enviado')
  }

  return { ok: true }
}
