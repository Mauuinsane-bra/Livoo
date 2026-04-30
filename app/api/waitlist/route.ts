// app/api/waitlist/route.ts
// POST /api/waitlist — registra inscrito via Resend Contacts + envia emails de confirmação
// Storage: Resend Contacts API (persistente, não depende de filesystem efêmero)

import { NextRequest, NextResponse } from 'next/server'

// ── Rate limiting (in-memory, por IP) ─────────────────────────────────────────
// Máximo: 3 tentativas por IP em 10 minutos
const RATE_LIMIT_MAX    = 3
const RATE_LIMIT_WINDOW = 10 * 60 * 1000  // 10 min em ms
const ipAttempts = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  // Em Vercel, x-forwarded-for é injetado pela plataforma (confiável).
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim())
    return ips[ips.length - 1] || 'unknown'
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now    = Date.now()
  const record = ipAttempts.get(ip)

  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  record.count++
  return { allowed: true }
}

// ── Validação ─────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const VALID_INTERESTS = [
  'Futebol', 'Automobilismo', 'Shows', 'Cultura',
  'Aventura', 'Gastronomia', 'Praias', 'Intercâmbio',
]
const MAX_NAME_LENGTH  = 100
const MAX_EMAIL_LENGTH = 254

// ── Resend Contacts API — storage persistente ──────────────────────────────────
// Documentação: https://resend.com/docs/api-reference/contacts/create-contact
// Configure RESEND_AUDIENCE_ID em resend.com → Audiences → Create
async function addToResendContacts(
  email: string,
  firstName: string,
  interests: string[],
): Promise<{ ok: boolean; duplicate: boolean }> {
  const apiKey     = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    // Sem configuração de Audience: log de alerta, mas não bloqueia o fluxo
    console.warn('[waitlist] RESEND_API_KEY ou RESEND_AUDIENCE_ID não configurado — contato não persistido no Resend Contacts')
    return { ok: false, duplicate: false }
  }

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      first_name:   firstName,
      unsubscribed: false,
      // Interesses armazenados como campo customizado (Resend não tem campos custom nativos,
      // então incluímos no first_name como sufixo legível ou ignoramos — mantemos separado no email de notificação)
    }),
  })

  // 409 = contato já existe nesta audience
  if (res.status === 409) return { ok: false, duplicate: true }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[waitlist] Resend Contacts API erro:', res.status, body)
    return { ok: false, duplicate: false }
  }

  return { ok: true, duplicate: false }
}

// ── Resend email via fetch nativo ─────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'Go Livoo <onboarding@resend.dev>', to, subject, html }),
  })
}

// ── POST — novo inscrito ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip   = getClientIp(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Muitas tentativas. Aguarde ${rate.retryAfter} segundos.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
      )
    }

    const { name, email, interests } = await req.json()

    // Validação de nome
    if (!name?.trim() || typeof name !== 'string') {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `Nome muito longo (máx ${MAX_NAME_LENGTH} caracteres).` }, { status: 400 })
    }

    // Validação de email
    if (!email?.trim() || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email é obrigatório.' }, { status: 400 })
    }
    if (email.trim().length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    // Validação de interesses — apenas valores permitidos
    let validInterests: string[] = []
    if (Array.isArray(interests)) {
      validInterests = interests
        .filter((i): i is string => typeof i === 'string')
        .filter(i => VALID_INTERESTS.includes(i))
        .slice(0, 10)
    }

    const emailNorm  = email.trim().toLowerCase()
    const firstName  = name.trim().split(' ')[0]

    // ── Persistência via Resend Contacts ──────────────────────────────────────
    const { duplicate } = await addToResendContacts(emailNorm, firstName, validInterests)

    if (duplicate) {
      return NextResponse.json({ error: 'Este email já está na lista de espera.' }, { status: 409 })
    }

    // ── Emails de notificação e confirmação (best-effort) ─────────────────────
    const notifyEmail  = process.env.RESEND_NOTIFY_EMAIL
    if (process.env.RESEND_API_KEY && notifyEmail) {
      const interestsTxt = validInterests.length > 0
        ? validInterests.join(', ')
        : 'Não informado'
      const submittedAt = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

      // 1 — Notificação para admin
      const notifyHtml = `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #D0DCF0">
          <div style="background:#0D1B3E;padding:20px 24px">
            <span style="font-size:20px;font-weight:700;color:#F5A623">Go Livoo.</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.45);margin-left:10px;text-transform:uppercase;letter-spacing:1px">Novo cadastro na Waitlist</span>
          </div>
          <div style="padding:24px">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80;width:110px">Nome</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;font-weight:600;color:#0D1B3E">${escapeHtml(name.trim())}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80">Email</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#1A56DB">${escapeHtml(emailNorm)}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80">Interesses</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#0D1B3E">${escapeHtml(interestsTxt)}</td></tr>
              <tr><td style="padding:8px 0;color:#5A6A80">Cadastrado em</td><td style="padding:8px 0;color:#0D1B3E">${submittedAt} (BRT)</td></tr>
            </table>
          </div>
        </div>`

      // 2 — Confirmação para o usuário
      const confirmHtml = `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #D0DCF0">
          <div style="background:#0D1B3E;padding:32px 28px;text-align:center">
            <div style="font-size:26px;font-weight:700;color:#F5A623;letter-spacing:2px">Go Livoo.</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-top:4px">Vá mais longe por menos</div>
          </div>
          <div style="padding:36px 28px;text-align:center">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0D1B3E">Você está na lista, ${escapeHtml(firstName)}!</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#5A6A80;line-height:1.7">
              Obrigado por se cadastrar. Você será um dos primeiros a saber quando a Go Livoo abrir — e vai ter acesso especial antes de todo mundo.
            </p>
            <div style="background:#FFF8EC;border:1px solid rgba(245,168,0,0.3);border-radius:10px;padding:18px 20px;text-align:left;margin-bottom:24px">
              <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6">
                <strong>O que a Go Livoo faz por você:</strong><br>
                Você descreve a experiência que quer viver — show, evento esportivo, aventura — e a gente monta o pacote completo: voo, hotel, guia e toda a documentação necessária.
              </p>
            </div>
            <p style="margin:0;font-size:12px;color:#5A6A80">Até breve!</p>
          </div>
          <div style="background:#F4F7FF;padding:14px 28px;text-align:center">
            <p style="margin:0;font-size:11px;color:#5A6A80">Go Livoo — Plataforma de Soluções para Viajantes</p>
          </div>
        </div>`

      // Dispara em paralelo, sem bloquear a resposta
      Promise.all([
        sendEmail(notifyEmail, `[Livoo Waitlist] ${escapeHtml(name.trim())} — ${emailNorm}`, notifyHtml),
        sendEmail(emailNorm, 'Você está na lista da Livoo!', confirmHtml),
      ]).catch(err => console.warn('[waitlist] Falha ao enviar emails:', err))
    }

    return NextResponse.json({ ok: true })
  