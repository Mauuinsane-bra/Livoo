// app/api/prep/checkout/route.ts
// POST /api/prep/checkout
// Cria uma sessão de checkout Stripe para Documentação Completa (R$39/viagem)

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, isValidCountryCode, sanitizeString } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('checkout', { maxRequests: 5, windowMs: 60_000 })

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const body        = await req.json().catch(() => ({}))
  const destination = typeof body.destination === 'string' ? sanitizeString(body.destination, 50) : ''
  const nationality = typeof body.nationality === 'string' ? sanitizeString(body.nationality, 10) : ''

  // Validação básica
  if (destination && destination.length > 2 && !isValidCountryCode(destination.slice(0, 2))) {
    // Aceita nomes de países também, só valida se parecer código
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Pagamento não configurado. Adicione STRIPE_SECRET_KEY no .env.local.' },
      { status: 503 }
    )
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

    // Usar metadata do Stripe em vez de query params na URL de sucesso
    // para evitar vazamento de dados pessoais em URLs/logs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name:        'Documentação Completa — Checklist de Viagem',
              description: `Documentação completa: visto, passaporte, vacinas, restrições e checklist PDF personalizado.`,
              images:      [],
            },
            unit_amount: 3900, // R$39,00 em centavos
          },
          quantity: 1,
        },
      ],
      mode:              'payment',
      success_url:       `${baseUrl}/prep?paid=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:        `${baseUrl}/prep`,
      metadata: {
        destination: destination,
        nationality: nationality,
        product:     'livoo_prep',
      },
      locale: 'pt-BR',
      custom_text: {
        submit: {
          message: 'Após o pagamento, você receberá acesso imediato ao checklist completo e PDF para download.',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    console.error('Erro ao criar sessão de pagamento')
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento.' },
      { status: 500 }
    )
  }
}
