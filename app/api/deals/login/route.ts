// app/api/deals/login/route.ts
// Gate simples por senha para a página /deals (uso pessoal, independente do Clerk).
// A senha fica em DEALS_PAGE_PASSWORD. Em caso de acerto, grava cookie httpOnly.

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const pw = process.env.DEALS_PAGE_PASSWORD
  if (!pw) {
    return NextResponse.json({ error: 'gate nao configurado' }, { status: 503 })
  }

  let body: { password?: string } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  if (body.password !== pw) {
    return NextResponse.json({ error: 'senha incorreta' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('deals_auth', pw, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  })
  return res
}
