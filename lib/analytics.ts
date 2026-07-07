// lib/analytics.ts
// Eventos de funil via GA4 (gtag já carregado no app/layout.tsx).
// Uso: track('roteiro_form_submit', { destination: 'Lisboa' })
//
// Funil do produto pago (ver relatório no GA4 → Engajamento → Eventos):
//   home_hero_cta            → clique no CTA do hero da homepage
//   roteiro_form_submit      → enviou o formulário do roteiro
//   roteiro_preview_shown    → preview gerado com sucesso
//   roteiro_pay_click        → clicou em "Desbloquear roteiro completo"
//   roteiro_checkout_redirect→ foi redirecionado ao Stripe
//   roteiro_paid_generated   → voltou pago e o roteiro completo foi gerado
//   roteiro_error            → falha em alguma etapa (param: stage)

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  try {
    w.gtag?.('event', event, params)
  } catch {
    // analytics nunca pode quebrar a página
  }
}
