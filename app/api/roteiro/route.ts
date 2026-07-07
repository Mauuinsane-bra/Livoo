// app/api/roteiro/route.ts
// POST /api/roteiro — gera preview gratuito ou roteiro completo via Claude.
//
// Segurança (12/mai correção do furo do paywall): o modo 'full' agora EXIGE
// verificação server-side da sessão Stripe (payment_status === 'paid').
// O antigo ?paid=true da URL era apenas cosmético — qualquer pessoa chamava a
// API direto e gerava o produto pago de graça, às custas da conta Anthropic.
//
// Motor v2 (lib/roteiro-engine.ts): arquiteto (Sonnet) → escritores por dia em
// paralelo (Opus 4.8) → revisor (Haiku), com preço real de voo no orçamento.

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'
import { buildKiwiUrl } from '@/lib/travelpayouts'
import { generateFullItineraryV2, buildMobilityHint } from '@/lib/roteiro-engine'
import type { PreviewData, FullItinerary } from '@/lib/roteiro-types'
import Anthropic from '@anthropic-ai/sdk'

// Re-export para compatibilidade com imports existentes (ex: roteiro/page.tsx, pdf route)
export type {
  BudgetCategory,
  HighlightItem,
  DayActivity,
  DayRestaurant,
  DayPlan,
  ChecklistSection,
  PreviewData,
  FullItinerary,
} from '@/lib/roteiro-types'

const rateLimit = createRateLimiter('roteiro', { maxRequests: 10, windowMs: 60_000 })
const MAX_LENGTH = 500

// O pipeline completo (esqueleto + N dias em paralelo + revisão + PDF) pode
// levar alguns minutos — dá folga para a função serverless da Vercel.
export const maxDuration = 300
export const runtime = 'nodejs'

function sanitizeInput(s: string) {
  let clean = sanitizeString(s, MAX_LENGTH)
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /you\s+are\s+now\s+/gi,
    /system\s*:\s*/gi,
    /forget\s+(everything|all|your)\s*/gi,
    /override\s+(your|the)\s+(instructions?|rules?|prompt)/gi,
  ]
  for (const p of injectionPatterns) clean = clean.replace(p, '')
  return clean.trim()
}

// ── Verificação de pagamento (Stripe, server-side) ─────────────────────────

interface PaymentCheck {
  ok: boolean
  email?: string
  error?: string
}

async function verifyPaidSession(sessionId: string, destination: string): Promise<PaymentCheck> {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return { ok: false, error: 'Pagamento não confirmado. Se você acabou de pagar, aguarde alguns segundos e recarregue a página.' }
    }
    // Janela de 48h: a mesma sessão pode regerar o MESMO roteiro (refresh,
    // falha de geração), mas não vira passe permanente.
    if (session.created * 1000 < Date.now() - 48 * 3600 * 1000) {
      return { ok: false, error: 'Esta sessão de pagamento expirou. Entre em contato: contato@golivoo.com.br.' }
    }
    // A sessão paga vale para o destino que foi pago — não para N destinos.
    const paidDest = (session.metadata?.destination ?? '').trim().toLowerCase()
    if (paidDest && paidDest !== destination.trim().toLowerCase()) {
      return { ok: false, error: 'Este pagamento é de outro roteiro. Gere um novo roteiro para este destino.' }
    }
    return { ok: true, email: session.customer_details?.email ?? undefined }
  } catch (err) {
    console.error('[roteiro] verificação Stripe falhou:', err)
    return { ok: false, error: 'Não foi possível confirmar o pagamento. Tente novamente.' }
  }
}

// ── Demo data ──────────────────────────────────────────────────────────────

function buildDemoPreview(destination: string, budget: number): PreviewData {
  return {
    destination: destination || 'Lisboa, Portugal',
    destinationIATA: 'LIS',
    duration: '7 dias',
    totalBudget: budget || 8000,
    budgetBreakdown: [
      { category: 'Voos', estimated: Math.round((budget || 8000) * 0.35), percentage: 35, tip: 'Voos GRU→destino ida e volta, com antecedência de 60 dias' },
      { category: 'Hospedagem', estimated: Math.round((budget || 8000) * 0.25), percentage: 25, tip: 'Hotel 3★ bem localizado, 7 noites com café incluído' },
      { category: 'Alimentação', estimated: Math.round((budget || 8000) * 0.15), percentage: 15, tip: 'Restaurantes locais + mercados + 2 jantares especiais' },
      { category: 'Transporte local', estimated: Math.round((budget || 8000) * 0.08), percentage: 8, tip: 'Metro, passes turísticos e 2 táxis' },
      { category: 'Experiências', estimated: Math.round((budget || 8000) * 0.12), percentage: 12, tip: 'Museus, day trips e passeios guiados' },
      { category: 'Reserva', estimated: Math.round((budget || 8000) * 0.05), percentage: 5, tip: 'Para imprevistos e compras de última hora' },
    ],
    highlights: [
      { day: 'Dia 1', title: 'Chegada e primeiros passos', desc: 'Chegada, check-in e passeio pelo centro histórico para se ambientar com a cidade.' },
      { day: 'Dia 3', title: 'Atração principal da região', desc: 'O dia mais esperado do roteiro — visita ao ponto turístico mais emblemático do destino.' },
      { day: 'Dia 6', title: 'Experiência local autêntica', desc: 'Gastronomia, cultura e um momento de imersão que você não vai esquecer.' },
    ],
    visaInfo: 'Verifique os requisitos de visto e documentação para brasileiros no site do consulado do destino ou em gov.br/mre. Alguns países exigem visto consular com entrevista (EUA, Canadá, Austrália, Japão, China) — comece o processo com pelo menos 60 dias de antecedência.',
    bestTime: 'O melhor período depende de clima, eventos locais e temporada — considere viajar fora do pico para preços menores.',
  }
}

// ── Claude — preview ───────────────────────────────────────────────────────

// Ferramenta que força o preview a vir estruturado (sem JSON.parse frágil).
const PREVIEW_TOOL = {
  name: 'montar_preview',
  description: 'Registra o preview do roteiro (estimativa de orçamento, destaques e documentação).',
  input_schema: {
    type: 'object' as const,
    properties: {
      destination: { type: 'string', description: 'Nome completo da cidade e país.' },
      destinationIATA: { type: 'string', description: 'Código IATA de 3 letras do aeroporto principal.' },
      duration: { type: 'string', description: 'Ex: "7 noites / 8 dias".' },
      totalBudget: { type: 'number', description: 'Orçamento total em BRL.' },
      budgetBreakdown: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            estimated: { type: 'number' },
            percentage: { type: 'number' },
            tip: { type: 'string' },
          },
          required: ['category', 'estimated', 'percentage', 'tip'],
        },
      },
      highlights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'string' },
            title: { type: 'string' },
            desc: { type: 'string' },
          },
          required: ['day', 'title', 'desc'],
        },
      },
      visaInfo: { type: 'string', description: 'Requisito de visto/documentação preciso para brasileiros.' },
      bestTime: { type: 'string', description: 'Melhor época para visitar e por quê.' },
    },
    required: ['destination', 'destinationIATA', 'duration', 'totalBudget', 'budgetBreakdown', 'highlights', 'visaInfo', 'bestTime'],
  },
}

async function generatePreview(
  client: Anthropic,
  destination: string,
  checkIn: string,
  checkOut: string,
  budgetBRL: number,
  priorities: string[],
  originCity: string = 'São Paulo',
  originIATA: string = 'GRU',
  opts: { flexDates?: boolean; mobility?: string; surprise?: boolean; radius?: number; suggestMode?: boolean; expTypes?: string[]; prefDuration?: string; prefSeason?: string } = {},
): Promise<PreviewData> {
  const nights = (checkIn && checkOut)
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const systemPrompt = `Você é um especialista em viagens para brasileiros.
Responda SEMPRE em JSON válido, sem texto fora do JSON.
Seja preciso com valores em BRL e realista com estimativas de custo.

REGRAS DE DOCUMENTAÇÃO PARA BRASILEIROS (OBRIGATÓRIO — nunca inventar requisitos):
- VISTO OBRIGATÓRIO (processo consular, entrevista, semanas/meses de espera):
  EUA (B1/B2, US$185, entrevista no consulado), Canadá (eTA NÃO se aplica a brasileiros — precisa de visto de visitante), Austrália (eVisitor NÃO se aplica — precisa de visto de visitante), Japão (visto de curta duração), China (visto L de turista), Rússia, Índia (e-Visa disponível), Arábia Saudita (e-Visa disponível).
- ESTA (Electronic System for Travel Authorization): programa EXCLUSIVO para cidadãos de países no Visa Waiver Program (ex: Portugal, Espanha, França, Alemanha, Japão, Austrália, Reino Unido). Brasil NÃO participa do ESTA. NUNCA mencionar ESTA para brasileiros.
- eTA Canadá: EXCLUSIVO para cidadãos de países isentos de visto (ex: europeus). Brasil NÃO é isento. Brasileiros precisam de VISTO CONSULAR para o Canadá.
- SEM VISTO para brasileiros (turismo até 90 dias): toda a União Europeia/Espaço Schengen, Reino Unido (até 6 meses), Argentina, Chile, Uruguai, Paraguai, Colômbia, Peru, Equador, México, Turquia, Marrocos, África do Sul, Tailândia (até 90 dias), Coreia do Sul (até 90 dias), Emirados Árabes (até 90 dias), Israel, Filipinas, Malásia, Indonésia, Nova Zelândia (até 90 dias com NZeTA).
- REGRA ABSOLUTA: se não tiver 100% de certeza sobre o requisito de visto para um destino específico, escrever: "Verifique os requisitos atualizados no site do consulado ou em gov.br/mre antes de viajar." Nunca chutar.
- Passaporte: validade mínima de 6 meses além da data de retorno é exigência padrão.
- Seguro viagem: obrigatório para Espaço Schengen (cobertura mínima EUR 30.000). Recomendado para todos os destinos.`

  const mobilityHint = buildMobilityHint(opts.mobility)

  const surpriseHint = opts.surprise ? 'INCLUA cidades/vilas menos conhecidas proximas ao destino (ex: vilarejos medievais, praias escondidas, cidades historicas fora do circuito turistico).' : ''

  const radiusHint = opts.radius && opts.radius > 0 ? `O viajante quer explorar num RAIO de ${opts.radius} km do destino - sugira day trips e cidades satelite dentro desse raio.` : ''

  const suggestHint = opts.suggestMode ? `O viajante NAO sabe para onde ir. Baseado no perfil abaixo, ESCOLHA o melhor destino e gere o preview para ele:
- Tipos de experiencia desejada: ${(opts.expTypes ?? []).join(', ') || 'qualquer'}
- Duracao preferida: ${opts.prefDuration || 'qualquer'}
- Epoca do ano preferida: ${opts.prefSeason || 'qualquer'}
Escolha UM destino internacional que melhor combine com esse perfil. Explique no bestTime por que esse destino foi escolhido.` : ''

  const dateInfo = opts.flexDates
    ? 'O viajante NAO tem datas definidas. SUGIRA a melhor epoca para visitar esse destino (considere clima, eventos, precos) e proponha duracao ideal.'
    : `Check-in: ${checkIn} | Check-out: ${checkOut} (${nights} noites)`

  const userPrompt = `Crie um preview de roteiro para:
- Origem: ${originCity} (${originIATA}), Brasil
- Destino: ${destination}
- ${dateInfo}
- Orçamento total: R$ ${budgetBRL.toLocaleString('pt-BR')}
- Prioridades: ${priorities.join(', ') || 'equilíbrio geral'}
- O viajante é BRASILEIRO saindo de ${originCity}. A informação de visto/documentação DEVE ser específica para cidadãos brasileiros.
${mobilityHint ? '- ' + mobilityHint : ''}
${surpriseHint ? '- ' + surpriseHint : ''}
${radiusHint ? '- ' + radiusHint : ''}
${suggestHint}

Use a ferramenta montar_preview para registrar o preview:
- duration: ${nights > 0 ? `${nights} noites / ${nights + 1} dias` : 'a definir — sugira a duração ideal'}
- budgetBreakdown: 6 categorias na ordem Voos, Hospedagem, Alimentação, Transporte local, Experiências, Reserva. Os "percentage" devem somar 100 e os "estimated" devem somar exatamente ${budgetBRL}.
- highlights: 3 dias-destaque (ex: Dia 1, Dia ${Math.round((nights + 1) / 2)}, Dia ${nights + 1}), cada um com título curto e descrição de 1-2 frases.
- visaInfo: requisito de visto preciso para BRASILEIROS conforme as REGRAS DE DOCUMENTAÇÃO.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    tools: [PREVIEW_TOOL],
    tool_choice: { type: 'tool', name: 'montar_preview' },
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude não retornou o preview estruturado')
  }
  return toolUse.input as PreviewData
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  try {
    const body = await req.json() as {
      origin?: string
      originIATA?: string
      destination: string
      checkIn: string
      checkOut: string
      flexDates?: boolean
      budgetBRL: number
      priorities: string[]
      mobility?: string
      surprise?: boolean
      radius?: number
      suggestMode?: boolean
      expTypes?: string[]
      prefDuration?: string
      prefSeason?: string
      mode: 'preview' | 'full'
      previewData?: PreviewData
      sessionId?: string
    }

    const { mode, checkIn, checkOut, budgetBRL, previewData } = body
    const destination = sanitizeInput(body.destination ?? '')
    const origin = sanitizeInput(body.origin ?? 'São Paulo')
    const originIATA = (body.originIATA ?? 'GRU').replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() || 'GRU'
    const flexDates = body.flexDates === true
    // Mobilidade aceita combinação em CSV (ex: 'a-pe,carro')
    const MOBILITY_VALUES = ['a-pe', 'transporte-publico', 'carro']
    const mobility = (body.mobility ?? '').split(',').map(s => s.trim()).filter(m => MOBILITY_VALUES.includes(m)).join(',')
    const surprise = body.surprise === true
    const radius = [0, 50, 100, 200, 500].includes(body.radius ?? 0) ? (body.radius ?? 0) : 0
    const suggestMode = body.suggestMode === true
    const expTypes = Array.isArray(body.expTypes) ? body.expTypes.slice(0, 6) : []
    const prefDuration = typeof body.prefDuration === 'string' ? body.prefDuration : ''
    const prefSeason = typeof body.prefSeason === 'string' ? body.prefSeason : ''
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 200) : ''

    if (!suggestMode && (!destination || destination.length < 2)) {
      return NextResponse.json({ error: 'Informe o destino.' }, { status: 400 })
    }
    if (!flexDates && (!checkIn || !checkOut)) {
      return NextResponse.json({ error: 'Informe as datas.' }, { status: 400 })
    }
    if (!budgetBRL || budgetBRL < 500) {
      return NextResponse.json({ error: 'Informe um orçamento válido (mínimo R$500).' }, { status: 400 })
    }

    const priorities = Array.isArray(body.priorities) ? body.priorities.slice(0, 5) : []

    // Demo mode se não tiver ANTHROPIC_API_KEY
    if (!process.env.ANTHROPIC_API_KEY) {
      if (mode === 'preview') {
        return NextResponse.json({
          success: true,
          mode: 'preview',
          preview: buildDemoPreview(destination, budgetBRL),
          isDemoMode: true,
        })
      }
      // full mode demo: preview + itinerário básico
      const demoPreview = buildDemoPreview(destination, budgetBRL)
      return NextResponse.json({
        success: true,
        mode: 'full',
        itinerary: {
          ...demoPreview,
          dayByDay: [
            {
              day: 1,
              title: 'Chegada e primeiros passos',
              activities: [
                { time: '14h', title: 'Chegada e check-in', desc: 'Desembarque, transfer do aeroporto e check-in no hotel.', link: '' },
                { time: '16h', title: 'Passeio pelo centro histórico', desc: 'Primeira caminhada pelo centro para se ambientar com a cidade.', link: '' },
                { time: '19h', title: 'Jantar em restaurante local', desc: 'Primeira experiência gastronômica no destino.', link: '' },
              ],
              curiosity: 'Curiosidades históricas e culturais únicas de cada dia aparecem aqui quando o roteiro é gerado.',
              hiddenGem: 'Joias escondidas "por perto" — lugares fora do circuito turístico — aparecem aqui.',
              travelerTip: 'Dicas de viajante experiente (horários, filas, economia) aparecem aqui.',
              restaurants: [
                { name: 'Restaurante recomendado', desc: 'Restaurantes reais com o que pedir e o ambiente aparecem aqui no roteiro completo.' },
              ],
            },
          ],
          flightLink: buildKiwiUrl(originIATA, demoPreview.destinationIATA, checkIn || '2026-01-01', checkOut || '2026-01-08', 1),
          hotelLink: '/hoteis',
          checklist: [
            { category: 'Documentos', items: ['Passaporte valido por 6 meses', 'Seguro viagem'] },
            { category: 'Financas', items: ['Cartao internacional', 'Dinheiro local para emergencias'] },
          ],
        },
        isDemoMode: true,
      })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    if (mode === 'preview') {
      const preview = await generatePreview(client, destination, checkIn, checkOut, budgetBRL, priorities, origin, originIATA, { flexDates, mobility, surprise, radius, suggestMode, expTypes, prefDuration, prefSeason })

      // Salvar no Supabase (nao bloquear em caso de erro)
      try {
        const { createClient } = await import('@supabase/supabase-js')
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
          await supabase.from('itineraries').insert({
            destination,
            check_in: checkIn || null,
            check_out: checkOut || null,
            budget_brl: budgetBRL,
            priorities,
            preview_data: preview,
            status: 'preview',
          })
        }
      } catch (dbErr) {
        console.warn('[roteiro] Supabase save failed (non-blocking):', dbErr)
      }

      return NextResponse.json({
        success: true,
        mode: 'preview',
        preview,
      })
    }

    // ── Full mode — exige pagamento verificado no Stripe ──────────────────
    let customerEmail: string | undefined

    if (process.env.STRIPE_SECRET_KEY) {
      if (!sessionId) {
        return NextResponse.json(
          { error: 'O roteiro completo é liberado após o pagamento. Gere o preview e desbloqueie por R$ 29,90.' },
          { status: 402 },
        )
      }
      const payment = await verifyPaidSession(sessionId, destination)
      if (!payment.ok) {
        return NextResponse.json({ error: payment.error }, { status: 402 })
      }
      customerEmail = payment.email
    } else if (process.env.NODE_ENV === 'production') {
      // Produção sem Stripe configurado: não há como verificar pagamento —
      // não entregar o produto pago de graça.
      return NextResponse.json(
        { error: 'Pagamento indisponível no momento. Tente novamente mais tarde.' },
        { status: 503 },
      )
    }

    const basePreview = (previewData as PreviewData) ?? await generatePreview(client, destination, checkIn, checkOut, budgetBRL, priorities, origin, originIATA, { flexDates, mobility, surprise, radius, suggestMode, expTypes, prefDuration, prefSeason })
    const itinerary: FullItinerary = await generateFullItineraryV2(client, basePreview, checkIn, checkOut, priorities, origin, originIATA, { flexDates, mobility, surprise, radius })

    // Envio automático do PDF para o e-mail do pagamento (best-effort:
    // falha de e-mail não pode negar o roteiro que o cliente pagou)
    let pdfSentTo: string | null = null
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        const { sendRoteiroPdfEmail } = await import('@/lib/roteiro-email')
        await sendRoteiroPdfEmail(itinerary, customerEmail)
        pdfSentTo = customerEmail
      } catch (mailErr) {
        console.error('[roteiro] envio automático de PDF falhou (não-bloqueante):', mailErr)
      }
    }

    return NextResponse.json({
      success: true,
      mode: 'full',
      itinerary,
      pdfSentTo,
    })

  } catch (err: unknown) {
    // Log completo no servidor; mensagem genérica para o cliente
    // (mensagens internas de API não devem vazar para a UI).
    console.error('[roteiro] erro:', err)
    return NextResponse.json(
      { error: 'Não foi possível gerar o roteiro agora. Tente novamente em instantes.' },
      { status: 500 },
    )
  }
}
