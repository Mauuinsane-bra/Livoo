// app/api/waitlist/route.ts
// POST /api/waitlist — registra inscrito e envia emails via Resend (fetch nativo)
// Storage: arquivo JSON local (sem Supabase por ora)

import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// ── Rate limiting (in-memory, por IP) ─────────────────
// Máximo: 3 tentativas por IP em 10 minutos
const RATE_LIMIT_MAX      = 3
const RATE_LIMIT_WINDOW   = 10 * 60 * 1000  // 10 min em ms
const ipAttempts = new Map<string, { count: number; resetAt: number }>()

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

// ── Storage JSON ───────────────────────────────────────
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

function readList(): Array<Record<string, unknown>> {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeList(entries: Array<Record<string, unknown>>) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

// ── Resend via fetch nativo ────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'Livoo <onboarding@resend.dev>', to, subject, html }),
  })
}

// ── POST — novo inscrito ───────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              ?? req.headers.get('x-real-ip')
              ?? 'unknown'

    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Muitas tentativas. Aguarde ${rate.retryAfter} segundos.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } }
      )
    }

    const { name, email, interests } = await req.json()

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const list = readList()
    const emailNorm = email.trim().toLowerCase()

    if (list.some(e => e.email === emailNorm)) {
      return NextResponse.json({ error: 'Este email já está na lista de espera.' }, { status: 409 })
    }

    // Salva localmente
    list.push({
      name: name.trim(),
      email: emailNorm,
      interests: interests ?? [],
      createdAt: new Date().toISOString(),
    })
    writeList(list)

    // Emails (best-effort — não quebra o fluxo se falhar)
    if (process.env.RESEND_API_KEY) {
      const firstName   = name.trim().split(' ')[0]
      const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'casagrande_mauricio@hotmail.com'
      const interestsTxt = Array.isArray(interests) && interests.length > 0
        ? interests.join(', ')
        : 'Não informado'
      const submittedAt = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

      // 1️⃣  Notificação para Mauricio
      const notifyHtml = `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #D0DCF0">
          <div style="background:#0D1B3E;padding:20px 24px">
            <span style="font-size:20px;font-weight:700;color:#F5A623">Go Livoo.</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.45);margin-left:10px;text-transform:uppercase;letter-spacing:1px">Novo cadastro na Waitlist</span>
          </div>
          <div style="padding:24px">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80;width:110px">Nome</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;font-weight:600;color:#0D1B3E">${name.trim()}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80">Email</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#1A56DB">${emailNorm}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#5A6A80">Interesses</td><td style="padding:8px 0;border-bottom:1px solid #EEF4FF;color:#0D1B3E">${interestsTxt}</td></tr>
              <tr><td style="padding:8px 0;color:#5A6A80">Cadastrado em</td><td style="padding:8px 0;color:#0D1B3E">${submittedAt} (BRT)</td></tr>
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:#5A6A80">Total na lista: <strong>${list.length}</strong> inscritos</p>
          </div>
        </div>`

      // 2️⃣  Confirmação para o usuário
      const confirmHtml = `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #D0DCF0">
          <div style="background:#0D1B3E;padding:32px 28px;text-align:center">
            <div style="font-size:26px;font-weight:700;color:#F5A623;letter-spacing:2px">Go Livoo.</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-top:4px">Vá mais longe por menos</div>
          </div>
          <div style="padding:36px 28px;text-align:center">
            <div style="font-size:40px;margin-bottom:16px">✓</div>
            <h2 style="margin:0 0 12px;font-size:20px;color:#0D1B3E">Você está na lista, ${firstName}!</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#5A6A80;line-height:1.7">
              Obrigado por se cadastrar. Você será um dos primeiros a saber quando a Go Livoo abrir — e vai ter acesso especial antes de todo mundo.
            </p>
            <div style="background:#FFF8EC;border:1px solid rgba(245,166,35,0.3);border-radius:10px;padding:18px 20px;text-align:left;margin-bottom:24px">
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
        sendEmail(notifyEmail, `[Livoo Waitlist] ${name.trim()} — ${emailNorm}`, notifyHtml),
        sendEmail(emailNorm, 'Você está na lista da Livoo!', confirmHtml),
      ]).catch(err => console.warn('[waitlist] Falha ao enviar emails:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[waitlist] Erro:', err)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}

// GET — lista inscritos (uso interno)
export async function GET() {
  const entries = readList()
  return NextResponse.json({ total: entries.length, entries })
}
