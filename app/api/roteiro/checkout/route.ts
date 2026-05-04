// app/api/roteiro/checkout/route.ts
// POST /api/roteiro/checkout
// Cria sessão Stripe para desbloquear roteiro completo (R$19,90)

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('roteiro-checkout', { maxRequests: 5, windowMs: 60_000 })

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const body = await req.json().catch(() => ({}))

  const {
    destination = '',
    checkIn = '',
    checkOut = '',
    budgetBRL = 0,
    priorities = [],
    previewData = null,
  } = body as {
    destination: string
    checkIn: string
    checkOut: string
    budgetBRL: number
    priorities: string[]
    previewData: unknown
  }

  if (!destination || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'Dados do roteiro incompletos.' }, { status: 400 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Pagamento não configurado. Adicione STRIPE_SECRET_KEY.' },
      { status: 503 }
    )
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

    // Passar parâmetros do roteiro via query string na URL de sucesso
    // (não contém dados sensíveis — só parâmetros de busca)
    const params = new URLSearchParams({
      paid: 'true',
      destination,
      checkIn,
      checkOut,
      budgetBRL: String(budgetBRL),
      priorities: (priorities as string[]).join(','),
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: 1990, // R$19,90 em centavos
            product_data: {
              name: `Roteiro completo — ${destination}`,
              description: `Plano dia a dia de ${checkIn} a ${checkOut} com links de reserva e checklist de documentação`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/roteiro?${params.toString()}`,
      cancel_url: `${baseUrl}/roteiro?destination=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&budgetBRL=${budgetBRL}&priorities=${(priorities as string[]).join(',')}`,
      metadata: {
        destination,
        checkIn,
        checkOut,
        budgetBRL: String(budgetBRL),
        priorities: (priorities as string[]).join(','),
        previewData: previewData ? JSON.stringify(previewData).slice(0, 500) : '',
      },
      payment_intent_data: {
        description: `Go Livoo — Roteiro ${destination} ${checkIn}→${checkOut}`,
      },
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('[roteiro/checkout] erro Stripe:', err)
    return NextResponse.json({ error: 'Erro ao criar sessão de pagamento.' }, { status: 500 })
  }
}
