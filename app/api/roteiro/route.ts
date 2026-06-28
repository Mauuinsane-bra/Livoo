// app/api/roteiro/route.ts
// POST /api/roteiro — gera preview gratuito ou roteiro completo via Claude

import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'
import { buildKiwiUrl } from '@/lib/travelpayouts'
import Anthropic from '@anthropic-ai/sdk'

const rateLimit = createRateLimiter('roteiro', { maxRequests: 10, windowMs: 60_000 })
const MAX_LENGTH = 500

// Opus 4.8 gerando um roteiro premium pode levar mais de 1 min — dá folga
// para a função serverless da Vercel não ser cortada no meio.
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

export interface DayRestaurant {
  name: string
  desc: string
}

export interface DayPlan {
  day: number
  title: string
  activities: DayActivity[]
  /** Curiosidade histórica/cultural única do dia (etimologia, fato escondido). */
  curiosity?: string
  /** Joia escondida "por perto" — lugar fora do circuito turístico óbvio. */
  hiddenGem?: string
  /** Dica de viajante experiente (horário, fila, golpe a evitar, atalho). */
  travelerTip?: string
  /** Restaurantes recomendados com descrição curta. */
  restaurants?: DayRestaurant[]
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
    visaInfo: 'Verifique os requisitos de visto e documentação para brasileiros no site do consulado do destino ou em gov.br/mre. Alguns países exigem visto consular com entrevista (EUA, Canadá, Austrália, Japão, China) — comece o processo com pelo menos 60 dias de antecedência.',
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

  const mobilityHint = opts.mobility === 'a-pe' ? 'O viajante ADORA andar a pe - priorize rotas a pe e distancias curtas.'
    : opts.mobility === 'transporte-publico' ? 'O viajante prefere transporte publico - baseie o roteiro em metro, onibus e trem.'
    : opts.mobility === 'carro' ? 'O viajante prefere carro - inclua estradas cenicas, estacionamento e distancias maiores.'
    : ''

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

Retorne este JSON exato (sem markdown, sem texto extra):
{
  "destination": "nome completo da cidade e país",
  "destinationIATA": "código IATA de 3 letras do aeroporto principal",
  "duration": "${nights > 0 ? `${nights} noites / ${nights + 1} dias` : 'a definir - sugira a duracao ideal'}",
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

// Ferramenta que força o Claude a devolver o roteiro já estruturado (sem
// "pescar JSON" com regex e sem o modelo misturar texto com os dados).
const FULL_ITINERARY_TOOL = {
  name: 'montar_roteiro',
  description: 'Registra o roteiro de viagem completo, dia a dia, com todos os detalhes premium.',
  input_schema: {
    type: 'object' as const,
    properties: {
      dayByDay: {
        type: 'array',
        description: 'Um objeto por dia da viagem, na ordem.',
        items: {
          type: 'object',
          properties: {
            day: { type: 'integer', description: 'Número do dia (1, 2, 3...).' },
            title: { type: 'string', description: 'Título curto e evocativo do dia.' },
            activities: {
              type: 'array',
              description: '4 a 5 atividades com horário, na ordem do dia.',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string', description: 'Horário, ex: "09h", "14h30".' },
                  title: { type: 'string', description: 'Nome da atividade ou lugar real.' },
                  desc: { type: 'string', description: 'Descrição prática de 1-2 frases.' },
                },
                required: ['time', 'title', 'desc'],
              },
            },
            curiosity: { type: 'string', description: 'Uma curiosidade histórica/cultural ÚNICA e verdadeira sobre algo do dia (origem do nome, fato escondido, etimologia). Evite o óbvio de guia turístico.' },
            hiddenGem: { type: 'string', description: 'Uma joia escondida "por perto" — lugar autêntico fora do circuito turístico óbvio, com o porquê de valer a pena.' },
            travelerTip: { type: 'string', description: 'Uma dica de viajante experiente: melhor horário para evitar fila, golpe comum a evitar, atalho, ou como economizar.' },
            restaurants: {
              type: 'array',
              description: '1 a 3 restaurantes reais com descrição curta (o que pedir, faixa, ambiente).',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  desc: { type: 'string' },
                },
                required: ['name', 'desc'],
              },
            },
          },
          required: ['day', 'title', 'activities', 'curiosity', 'hiddenGem', 'travelerTip', 'restaurants'],
        },
      },
      checklist: {
        type: 'array',
        description: 'Seções do checklist de preparação.',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            items: { type: 'array', items: { type: 'string' } },
          },
          required: ['category', 'items'],
        },
      },
    },
    required: ['dayByDay', 'checklist'],
  },
}

async function generateFullItinerary(
  client: Anthropic,
  preview: PreviewData,
  checkIn: string,
  checkOut: string,
  priorities: string[],
  originCity: string = 'São Paulo',
  originIATA: string = 'GRU',
  opts: { flexDates?: boolean; mobility?: string; surprise?: boolean; radius?: number } = {},
): Promise<FullItinerary> {
  const nights = (checkIn && checkOut)
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 7
  const totalDays = nights + 1

  const systemPrompt = `Você é o melhor planejador de viagens do Brasil, criando roteiros PREMIUM dia a dia para viajantes brasileiros. O cliente PAGOU por este roteiro — ele precisa ser melhor do que qualquer guia genérico ou conteúdo de blog.

PADRÃO DE QUALIDADE (cada dia DEVE ter):
- Atividades com lugares REAIS, específicos e horários realistas (nada de "visite o centro").
- Uma CURIOSIDADE única e verdadeira (origem de nome, fato histórico escondido, etimologia) — surpreenda quem já viajou muito; evite o óbvio.
- Uma JOIA ESCONDIDA "por perto": lugar autêntico fora do circuito turístico, com o porquê.
- Uma DICA DE VIAJANTE EXPERIENTE: melhor horário pra evitar fila, golpe comum, atalho, ou como economizar.
- 1 a 3 RESTAURANTES reais com o que pedir e o tipo de ambiente.
Seja concreto e específico. Se não tiver certeza de um fato, escolha outro que conheça — nunca invente nomes de lugares.

REGRAS DE DOCUMENTAÇÃO PARA BRASILEIROS (OBRIGATÓRIO — nunca inventar requisitos):
- VISTO OBRIGATÓRIO: EUA (B1/B2 — NÃO ESTA), Canadá (visto de visitante — NÃO eTA), Austrália (visto de visitante — NÃO eVisitor), Japão, China, Rússia, Índia, Arábia Saudita.
- ESTA/eTA NÃO se aplica a brasileiros. Nunca mencionar ESTA ou eTA para viajantes brasileiros.
- SEM VISTO: UE/Schengen, Reino Unido, América do Sul, México, Turquia, Marrocos, África do Sul, Tailândia, Coreia do Sul, EAU, Israel, Filipinas, Malásia, Indonésia, Nova Zelândia.
- Se não tiver certeza absoluta: "Verifique os requisitos atualizados no consulado ou em gov.br/mre."
- Seguro viagem obrigatório para Espaço Schengen (mín. EUR 30.000). Recomendado para todos.
- Passaporte com validade mínima de 6 meses além da data de retorno.
O checklist de documentos deve refletir EXATAMENTE o que o destino exige de brasileiros.

Use a ferramenta montar_roteiro para registrar o roteiro.`

  const mobilityHint = opts.mobility === 'a-pe' ? 'Priorize rotas a pé e distâncias curtas entre atividades.'
    : opts.mobility === 'transporte-publico' ? 'Baseie o roteiro em metrô, ônibus e trem. Mencione linhas/estações.'
    : opts.mobility === 'carro' ? 'Inclua estradas cênicas, estacionamento e distâncias maiores.'
    : ''
  const surpriseHint = opts.surprise ? 'Inclua pelo menos 1-2 destinos surpresa (vilas, bairros ou cidades pouco conhecidas próximas).' : ''
  const radiusHint = opts.radius && opts.radius > 0 ? `Sugira day trips dentro de ${opts.radius} km do destino principal.` : ''

  const userPrompt = `Monte o roteiro COMPLETO dia a dia para:
- Origem: ${originCity} (${originIATA}), Brasil — viajante BRASILEIRO
- Destino: ${preview.destination} (IATA: ${preview.destinationIATA})
- ${totalDays} dias (${nights} noites)${checkIn ? `, check-in: ${checkIn}` : ''}
- Orçamento: R$ ${preview.totalBudget.toLocaleString('pt-BR')}
- Prioridades: ${priorities.join(', ') || 'equilíbrio geral'}
${mobilityHint ? '- ' + mobilityHint : ''}
${surpriseHint ? '- ' + surpriseHint : ''}
${radiusHint ? '- ' + radiusHint : ''}

Crie EXATAMENTE ${totalDays} dias. Cada dia com 4-5 atividades + curiosidade + joia escondida + dica de viajante + restaurantes. O checklist deve ter: Documentos (visto correto para brasileiros conforme as regras), Saúde (vacinas), Finanças e Tecnologia.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    tools: [FULL_ITINERARY_TOOL],
    tool_choice: { type: 'tool', name: 'montar_roteiro' },
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude não retornou o roteiro estruturado')
  }
  const full = toolUse.input as Pick<FullItinerary, 'dayByDay' | 'checklist'>

  // Links calculados no código — o modelo não fabrica URLs.
  return {
    ...preview,
    dayByDay: full.dayByDay,
    checklist: full.checklist,
    flightLink: buildKiwiUrl(originIATA, preview.destinationIATA, checkIn, checkOut, 1),
    hotelLink: `https://hotellook.com/search?destination=${encodeURIComponent(preview.destination)}&adults=1`,
  }
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
    }

    const { mode, checkIn, checkOut, budgetBRL, previewData } = body
    const destination = sanitizeInput(body.destination ?? '')
    const origin = sanitizeInput(body.origin ?? 'São Paulo')
    const originIATA = (body.originIATA ?? 'GRU').replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() || 'GRU'
    const flexDates = body.flexDates === true
    const mobility = ['a-pe', 'transporte-publico', 'carro'].includes(body.mobility ?? '') ? body.mobility! : ''
    const surprise = body.surprise === true
    const radius = [0, 50, 100, 200, 500].includes(body.radius ?? 0) ? (body.radius ?? 0) : 0
    const suggestMode = body.suggestMode === true
    const expTypes = Array.isArray(body.expTypes) ? body.expTypes.slice(0, 6) : []
    const prefDuration = typeof body.prefDuration === 'string' ? body.prefDuration : ''
    const prefSeason = typeof body.prefSeason === 'string' ? body.prefSeason : ''

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
          hotelLink: `https://hotellook.com/search?destination=${encodeURIComponent(destination)}&adults=1`,
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

    // Full mode
    const basePreview = (previewData as PreviewData) ?? await generatePreview(client, destination, checkIn, checkOut, budgetBRL, priorities, origin, originIATA, { flexDates, mobility, surprise, radius, suggestMode, expTypes, prefDuration, prefSeason })
    const itinerary = await generateFullItinerary(client, basePreview, checkIn, checkOut, priorities, origin, originIATA, { flexDates, mobility, surprise, radius })

    return NextResponse.json({
      success: true,
      mode: 'full',
      itinerary,
    })

  } catch (err: unknown) {
    console.error('[roteiro] erro:', err)
    const message = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
