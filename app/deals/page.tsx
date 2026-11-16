// app/deals/page.tsx
// Painel privado do radar de passagens (uso pessoal). Gate por senha (cookie), sem Clerk.
// Mostra o preço em cache mais barato por rota vs. os alvos configurados.

import { cookies } from 'next/headers'
import { runScan, type RouteStatus } from '@/lib/deals/scanner'
import type { WildcardHit } from '@/lib/deals/travelpayouts-deals'
import DealsLogin from './DealsLogin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const NAVY = '#0D1B3E'

function brl(v: number): string {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}

function statusColor(r: RouteStatus): string {
  if (r.price === null) return '#94A3B8'
  if (r.price <= r.dream) return '#059669'
  if (r.price <= r.good) return '#1A56DB'
  return '#B45309'
}

function statusLabel(r: RouteStatus): string {
  if (r.price === null) return 'sem cache'
  if (r.price <= r.dream) return 'SONHO'
  if (r.price <= r.good) return 'bom'
  const over = Math.round(((r.price - r.dream) / r.dream) * 100)
  return '+' + over + '% do alvo'
}

export default async function DealsPage() {
  const jar = await cookies()
  const pw = process.env.DEALS_PAGE_PASSWORD
  const authed = !!pw && jar.get('deals_auth')?.value === pw

  if (!authed) {
    return <DealsLogin configured={!!pw} />
  }

  const result = await runScan({ persist: false }).catch(() => null)

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: 24, color: NAVY, margin: '0 0 4px' }}>Radar de passagens</h1>
      <p style={{ fontSize: 13, color: '#5A6A80', margin: '0 0 24px' }}>
        Saindo de GRU &middot; janela mar&ndash;mai/2027 &middot; menor preco em cache ida e volta.
      </p>

      {!result && (
        <p style={{ color: '#DC2626' }}>Falha ao consultar a API agora. Tente recarregar.</p>
      )}

      {result && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#5A6A80', fontSize: 12 }}>
                <th style={{ padding: '8px 0' }}>Destino</th>
                <th style={{ padding: '8px 0' }}>Alvo sonho / bom</th>
                <th style={{ padding: '8px 0' }}>Menor cache</th>
                <th style={{ padding: '8px 0' }}>Status</th>
                <th style={{ padding: '8px 0' }}></th>
              </tr>
            </thead>
            <tbody>
              {result.routes.map((r: RouteStatus) => (
                <tr key={r.dest} style={{ borderTop: '1px solid #EEF4FF' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: NAVY }}>
                    {r.name} <span style={{ color: '#94A3B8', fontWeight: 400 }}>({r.dest})</span>
                  </td>
                  <td style={{ padding: '12px 0', color: '#5A6A80' }}>
                    {brl(r.dream)} / {brl(r.good)}
                  </td>
                  <td style={{ padding: '12px 0', fontWeight: 700, color: NAVY }}>
                    {r.price === null ? '—' : brl(r.price)}
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ color: statusColor(r), fontWeight: 600, fontSize: 12 }}>{statusLabel(r)}</span>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}>
                    {r.link && (
                      <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1A56DB', fontSize: 12 }}>
                        ver
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.wildcard.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 16, color: NAVY, margin: '0 0 8px' }}>Surpresas (outros destinos baratos de GRU)</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14 }}>
                {result.wildcard.map((w: WildcardHit) => (
                  <li key={w.dest} style={{ padding: '6px 0', borderTop: '1px solid #EEF4FF', color: '#5A6A80' }}>
                    <strong style={{ color: NAVY }}>{w.dest}</strong> {brl(w.price)} &middot;{' '}
                    <a href={w.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1A56DB' }}>ver</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!result.storeUsed && (
            <p style={{ marginTop: 24, fontSize: 12, color: '#B45309', background: '#FFF8EC', padding: 10, borderRadius: 8 }}>
              Histórico de precos inativo (Supabase nao configurado): alertas por alvo funcionam,
              mas o alerta de queda relativa so liga depois de criar a tabela deal_price_history.
            </p>
          )}

          <p style={{ marginTop: 24, fontSize: 11, color: '#94A3B8' }}>
            Precos em cache da Travelpayouts. Confirme ao vivo antes de comprar; quando possivel, compre direto na cia aerea.
          </p>
        </>
      )}
    </div>
  )
}
