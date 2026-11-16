// app/api/deals/scan/route.ts
// Endpoint da varredura diária. Chamado pelo Vercel Cron (ver vercel.json).
// Protegido por segredo — NÃO depende do Clerk (cujo middleware não está ativo no projeto).

import { NextRequest, NextResponse } from 'next/server'
import { runScan } from '@/lib/deals/scanner'
import { sendDealAlert } from '@/lib/deals/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(req: NextRequest): boolean {
  const secret = process.env.DEALS_CRON_SECRET || process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('authorization') || ''
  return header === 'Bearer ' + secret
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  }

  const result = await runScan({ persist: true })
  const emailed = await sendDealAlert(result).catch(() => false)

  return NextResponse.json({
    ok: true,
    scannedAt: result.scannedAt,
    routesWithPrice: result.routes.filter(r => r.price !== null).length,
    alerts: result.alerts.length,
    wildcard: result.wildcard.length,
    emailed,
    storeUsed: result.storeUsed,
  })
}
