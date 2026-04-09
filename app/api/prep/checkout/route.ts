// app/api/prep/checkout/route.ts
// POST /api/prep/checkout
// Cria uma sessão de checkout Stripe para o Livoo Prep (R$39/viagem)
//
// Env necessárias:
//   STRIPE_SECRET_KEY  — chave secreta do Stripe
//   NEXT_PUBLIC_URL    — URL base da aplicação (ex: https://livoo.com.br)

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body        = await req.json().catch(() => ({}))
  const destination = body.destination     as string | undefined
  const nationality = body.nationality     as string | undefined

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
    const prepUrl = `${baseUrl}/prep?destination=${encodeURIComponent(destination ?? '')}&nationality=${encodeURIComponent(nationality ?? '')}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name:        'Livoo Prep — Checklist Completo',
              description: `Documentação completa para ${destination ?? 'seu destino'}: visto, passaporte, vacinas, restrições e checklist PDF personalizado.`,
              images:      [],
            },
            unit_amount: 3900, // R$39,00 em centavos
          },
          quantity: 1,
        },
      ],
      mode:              'payment',
      success_url:       `${prepUrl}&paid=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:        prepUrl,
      metadata: {
        destination: destination ?? '',
        nationality: nationality ?? '',
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
  } catch (error: unknown) {
    console.error('Erro Stripe checkout:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento.' },
      { status: 500 }
    )
  }
}
