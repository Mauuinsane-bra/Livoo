// lib/deals/email.ts
// Envia o alerta de promoção via Resend (mesmo padrão usado no resto do site).
// Nota: o remetente onboarding@resend.dev só entrega para o e-mail dono da conta Resend
// — o que é ideal aqui, pois a ferramenta é de uso pessoal.

import type { ScanResult, DealAlert } from '@/lib/deals/scanner'

const NAVY = '#0D1B3E'
const GOLD = '#F5A623'

function alertEmail(): string {
  return process.env.DEALS_ALERT_EMAIL || process.env.RESEND_NOTIFY_EMAIL || ''
}

function brl(v: number): string {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}

const TIER_LABEL: Record<DealAlert['tier'], string> = {
  dream: 'SONHO — tarifa rara',
  good: 'Bom preço',
  drop: 'Queda forte',
  wildcard: 'Surpresa',
}

function alertRow(a: DealAlert): string {
  const detail =
    a.tier === 'drop' && a.prevMin
      ? 'antes mín. ' + brl(a.prevMin)
      : a.target
        ? 'alvo ' + brl(a.target)
        : 'surpresa'
  const period = a.returnAt ? a.departAt + ' a ' + a.returnAt : 'a partir de ' + a.departAt

  return [
    '<tr>',
    '<td style="padding:10px 0;border-bottom:1px solid #EEF4FF">',
    '<strong style="color:' + NAVY + '">' + a.name + '</strong>',
    '<span style="color:#5A6A80;font-size:12px"> &middot; ' + TIER_LABEL[a.tier] + '</span><br>',
    '<span style="color:#5A6A80;font-size:12px">' + period + ' &middot; ' + detail + '</span>',
    '</td>',
    '<td style="padding:10px 0;border-bottom:1px solid #EEF4FF;text-align:right">',
    '<strong style="color:' + NAVY + ';font-size:16px">' + brl(a.price) + '</strong><br>',
    '<a href="' + a.link + '" style="color:#1A56DB;font-size:12px">ver passagem</a>',
    '</td>',
    '</tr>',
  ].join('')
}

export async function sendDealAlert(result: ScanResult): Promise<boolean> {
  const to = alertEmail()
  if (!process.env.RESEND_API_KEY || !to) return false
  if (result.alerts.length === 0) return false

  // Prioridade: sonho > queda > surpresa > bom
  const order: Record<DealAlert['tier'], number> = { dream: 0, drop: 1, wildcard: 2, good: 3 }
  const sorted = [...result.alerts].sort((x, y) => order[x.tier] - order[y.tier])
  const hasDream = sorted.some(a => a.tier === 'dream')

  const subject = hasDream
    ? 'Tarifa rara encontrada! ' + sorted.length + ' alerta(s) de passagem'
    : sorted.length + ' alerta(s) de passagem em promocao'

  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #D0DCF0;border-radius:12px;overflow:hidden">',
    '<div style="background:' + NAVY + ';padding:20px 24px">',
    '<span style="font-size:20px;font-weight:700;color:' + GOLD + '">Go Livoo.</span>',
    '<span style="font-size:11px;color:rgba(255,255,255,0.45);margin-left:10px;text-transform:uppercase;letter-spacing:1px">Radar de passagens</span>',
    '</div>',
    '<div style="padding:24px">',
    '<p style="color:#374151;margin:0 0 16px">Encontrei estes precos saindo de ' + result.routes[0]?.dest + ':</p>',
    '<table style="width:100%;border-collapse:collapse">',
    sorted.map(alertRow).join(''),
    '</table>',
    '<p style="color:#94A3B8;font-size:11px;margin:20px 0 0">Precos em cache (Travelpayouts). Confirme o valor ao vivo antes de comprar e, quando possivel, compre direto no site da cia aerea.</p>',
    '</div>',
    '</div>',
  ].join('')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Go Livoo Radar <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  })
  return res.ok
}
