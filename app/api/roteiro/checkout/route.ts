// app/api/roteiro/checkout/route.ts
// POST /api/roteiro/checkout
// Cria sessao Stripe para desbloquear roteiro completo (R$29,90)

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('roteiro-checkout', { maxRequests: 5, windowMs: 60_000 })

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  const body = await req.json().catch(() => ({}))

  const {
    origin = '',
    originIATA = 'GRU',
    destination = '',
    checkIn = '',
    checkOut = '',
    flexDates = false,
    budgetBRL = 0,
    priorities = [],
    mobility = '',
    surprise = false,
    radius = 0,
    previewData = null,
  } = body as {
    origin: string
    originIATA: string
    destination: string
    checkIn: string
    checkOut: string
    flexDates: boolean
    budgetBRL: number
    priorities: string[]
    mobility: string
    surprise: boolean
    radius: number
    previewData: unknown
  }

  if (!destination || (!flexDates && (!checkIn || !checkOut))) {
    return NextResponse.json({ error: 'Dados do roteiro incompletos.' }, { status: 400 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Pagamento nao configurado. Adicione STRIPE_SECRET_KEY.' },
      { status: 503 }
    )
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

    const params = new URLSearchParams({
      paid: 'true',
      origin,
      originIATA,
      destination,
      checkIn,
      checkOut,
      flexDates: String(flexDates),
      budgetBRL: String(budgetBRL),
      priorities: (priorities as string[]).join(','),
      mobility,
      surprise: String(surprise),
      radius: String(radius),
    })

    const descPeriod = checkIn && checkOut ? `de ${checkIn} a ${checkOut}` : 'com datas flexiveis'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: 2990,
            product_data: {
              name: 'Roteiro completo - ' + destination,
              description: 'Plano dia a dia ' + descPeriod + ' com PDF por e-mail, links de reserva e checklist',
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // {CHECKOUT_SESSION_ID} é um placeholder literal que o Stripe substitui
      // pelo ID real da sessão — a API /api/roteiro verifica esse ID
      // server-side antes de gerar o roteiro completo (correção do paywall).
      success_url: baseUrl + '/roteiro?' + params.toString() + '&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: baseUrl + '/roteiro?destination=' + encodeURIComponent(destination) + '&checkIn=' + checkIn + '&checkOut=' + checkOut + '&budgetBRL=' + budgetBRL,
      metadata: {
        destination,
        checkIn,
        checkOut,
        budgetBRL: String(budgetBRL),
        priorities: (priorities as string[]).join(','),
        previewData: previewData ? JSON.stringify(previewData).slice(0, 500) : '',
      },
      payment_intent_data: {
        description: 'Go Livoo - Roteiro ' + destination,
      },
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('[roteiro/checkout] erro Stripe:', err)
    return NextResponse.json({ error: 'Erro ao criar sessao de pagamento.' }, { status: 500 })
  }
}
