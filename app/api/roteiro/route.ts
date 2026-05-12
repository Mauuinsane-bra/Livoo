// app/api/roteiro/route.ts
// POST /api/roteiro — gera preview gratuito ou roteiro completo via Claude

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'
import Anthropic from '@anthropic-ai/sdk'

const rateLimit = createRateLimiter('roteiro', { maxRequests: 10, windowMs: 60_000 })
const MAX_LENGTH = 500

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

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface BudgetCategory {
  category: string
  estimated: number
  percentage: number
  tip: string
}

export interface HighlightItem {
  day: string
  title: string
  desc: string
}

export interface DayActivity {
  time: string
  title: string
  desc: string
  link?: string
}

export interface DayPlan {
  day: number
  title: string
  activities: DayActivity[]
}

export interface ChecklistSection {
  category: string
  items: string[]
}

export interface PreviewData {
  destination: string
  destinationIATA: string
  duration: string
  totalBudget: number
  budgetBreakdown: BudgetCategory[]
  highlights: HighlightItem[]
  visaInfo: string
  bestTime: string
}

export interface FullItinerary extends PreviewData {
  dayByDay: DayPlan[]
  flightLink: string
  hotelLink: string
  checklist: ChecklistSection[]
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
    visaInfo: 'Verifique os requisitos de visto para o destino com pelo menos 60 dias de antecedência — prazos variam por país e podem exigir agendamento consular.',
    bestTime: 'O melhor período depende de clima, eventos locais e temporada — considere viajar fora do pico para preços menores.',
  }
}

// ── Claude — preview ───────────────────────────────────────────────────────

async function generatePreview(
  client: Anthropic,
  destination: string,
  checkIn: string,
  checkOut: string,
  budgetBRL: number,
  priorities: string[],
): Promise<PreviewData> {
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  const systemPrompt = `Você é um especialista em viagens para brasileiros.
Responda SEMPRE em JSON válido, sem texto fora do JSON.
Seja preciso com valores em BRL e realista com estimativas de custo.`

  const userPrompt = `Crie um preview de roteiro para:
- Destino: ${destination}
- Check-in: ${checkIn} | Check-out: ${checkOut} (${nights} noites)
- Orçamento total: R$ ${budgetBRL.toLocaleString('pt-BR')}
- Prioridades: ${priorities.join(', ') || 'equilíbrio geral'}

Retorne este JSON exato (sem markdown, sem texto extra):
{
  "destination": "nome completo da cidade e país",
  "destinationIATA": "código IATA de 3 letras do aeroporto principal",
  "duration": "${nights} noites / ${nights + 1} dias",
  "totalBudget": ${budgetBRL},
  "budgetBreakdown": [
    {"category":"Voos","estimated":0,"percentage":0,"tip":"dica específica para este destino"},
    {"category":"Hospedagem","estimated":0,"percentage":0,"tip":"dica de bairro ou tipo de hotel"},
    {"category":"Alimentação","estimated":0,"percentage":0,"tip":"o que comer e onde"},
    {"category":"Transporte local","estimated":0,"percentage":0,"tip":"como se locomover"},
    {"category":"Experiências","estimated":0,"percentage":0,"tip":"o que não perder"},
    {"category":"Reserva","estimated":0,"percentage":0,"tip":"para imprevistos"}
  ],
  "highlights": [
    {"day":"Dia 1","title":"título curto","desc":"descrição de 1-2 frases do que fazer neste dia"},
    {"day":"Dia ${Math.round((nights + 1) / 2)}","title":"título curto","desc":"descrição de 1-2 frases"},
    {"day":"Dia ${nights + 1}","title":"título curto","desc":"descrição de 1-2 frases"}
  ],
  "visaInfo": "informação precisa sobre necessidade de visto para brasileiros",
  "bestTime": "melhor época para visitar e por quê"
}
Os percentuais devem somar 100. Os estimated devem somar exatamente ${budgetBRL}.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude retornou formato inválido')
  return JSON.parse(jsonMatch[0]) as PreviewData
}

// ── Claude — itinerário completo ───────────────────────────────────────────

async function generateFullItinerary(
  client: Anthropic,
  preview: PreviewData,
  checkIn: string,
  checkOut: string,
  priorities: string[],
): Promise<FullItinerary> {
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalDays = nights + 1

  const systemPrompt = `Você é um especialista em viagens para brasileiros, criando roteiros detalhados dia a dia.
Responda SEMPRE em JSON válido, sem texto fora do JSON.
Seja específico: mencione lugares reais, restaurantes conhecidos, horários realistas.`

  const userPrompt = `Crie o roteiro COMPLETO dia a dia para:
- Destino: ${preview.destination} (IATA: ${preview.destinationIATA})
- ${totalDays} dias (${nights} noites), check-in: ${checkIn}
- Orçamento: R$ ${preview.totalBudget.toLocaleString('pt-BR')}
- Prioridades: ${priorities.join(', ') || 'equilíbrio geral'}

Retorne este JSON exato (sem markdown):
{
  "dayByDay": [
    {
      "day": 1,
      "title": "título do dia",
      "activities": [
        {"time":"09h","title":"nome da atividade","desc":"descrição de 1-2 frases com detalhes práticos","link":""},
        {"time":"12h","title":"nome da atividade","desc":"descrição...","link":""},
        {"time":"15h","title":"nome da atividade","desc":"descrição...","link":""},
        {"time":"19h","title":"nome da atividade","desc":"descrição...","link":""}
      ]
    }
  ],
  "flightLink": "https://br.trip.com/flights/showfarefirst?dcity=gru&acity=${preview.destinationIATA.toLowerCase()}&triptype=rt&class=y&quantity=1&locale=pt-BR&curr=BRL",
  "hotelLink": "https://hotellook.com/search?destination=${encodeURIComponent(preview.destination)}&adults=1",
  "checklist": [
    {"category":"Documentos","items":["Passaporte válido","Seguro viagem obrigatório"]},
    {"category":"Saúde","items":["Vacinas recomendadas para o destino"]},
    {"category":"Finanças","items":["Cartão com zero IOF para o exterior","Dinheiro local para emergências"]},
    {"category":"Tecnologia","items":["Chip internacional ou eSIM","Adaptador de tomada se necessário"]}
  ]
}
Crie exatamente ${totalDays} dias no array dayByDay. Cada dia deve ter 4 atividades com horários reais.
Para links de atividades específicas (museus, restaurantes), use string vazia se não souber o link exato.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude retornou formato inválido')
  const full = JSON.parse(jsonMatch[0]) as Pick<FullItinerary, 'dayByDay' | 'flightLink' | 'hotelLink' | 'checklist'>

  return { ...preview, ...full }
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req)
  if (blocked) return blocked

  try {
    const body = await req.json() as {
      destination: string
      checkIn: string
      checkOut: string
      budgetBRL: number
      priorities: string[]
      mode: 'preview' | 'full'
      previewData?: PreviewData
    }

    const { mode, checkIn, checkOut, budgetBRL, previewData } = body
    const destination = sanitizeInput(body.destination ?? '')

    if (!destination || destination.length < 2) {
      return NextResponse.json({ error: 'Informe o destino.' }, { status: 400 })
    }
    if (!checkIn || !checkOut) {
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
            },
          ],
          flightLink: `https://br.trip.com/flights/showfarefirst?dcity=gru&acity=lis&triptype=rt&class=y&quantity=1&locale=pt-BR&curr=BRL`,
          hotelLink: `https://hotellook.com/search?destination=${encodeURIComponent(destination)}&adults=1`,
          checklist: [
            { category: 'Documentos', items: ['Passaporte válido por 6 meses', 'Seguro viagem'] },
            { category: 'Finanças', items: ['Cartão internacional', 'Dinheiro local para emergências'] },
          ],
        },
        isDemoMode: true,
      })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    if (mode === 'preview') {
      const preview = await generatePreview(client, destination, checkIn, checkOut, budgetBRL, priorities)

      // Salvar no Supabase (não bloquear em caso de erro)
      try {
        const { saveItinerary } = await import('@/lib/supabase')
        await saveItinerary({ prompt: `${destination} ${checkIn} ${checkOut}`, parsed_data: { preview, mode: 'preview' } })
      } catch { /* silencioso */ }

      return NextResponse.json({ success: true, mode: 'preview', preview })
    }

    // mode === 'full' — só chamado pós-pagamento
    const basePreview = previewData ?? await generatePreview(client, destination, checkIn, checkOut, budgetBRL, priorities)
    const itinerary = await generateFullItinerary(client, basePreview, checkIn, checkOut, priorities)

    // Salvar roteiro completo
    try {
      const { saveItinerary } = await import('@/lib/supabase')
      await saveItinerary({ prompt: `FULL:${destination} ${checkIn} ${checkOut}`, parsed_data: { itinerary } })
    } catch { /* silencioso */ }

    return NextResponse.json({ success: true, mode: 'full', itinerary })

  } catch (err) {
    console.error('[roteiro] erro:', err)
    return NextResponse.json({ error: 'Erro ao gerar roteiro. Tente novamente.' }, { status: 500 })
  }
}
