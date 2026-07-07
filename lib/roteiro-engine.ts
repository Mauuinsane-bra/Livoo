// lib/roteiro-engine.ts
// Motor v2 do roteiro pago — pipeline em 4 etapas em vez de uma chamada única:
//
//   0. Enriquecimento (código): preço REAL do voo via Travelpayouts entra no
//      orçamento — o modelo não chuta mais o valor de "Voos".
//   1. Arquiteto (Sonnet 5): esqueleto da viagem — região/bairro por dia,
//      âncoras reais, lógica geográfica, reservas antecipadas, checklist.
//   2. Escritores (Opus 4.8, em paralelo): UMA chamada POR DIA. Cada dia recebe
//      a atenção plena do modelo → o dia 8 sai tão rico quanto o dia 1
//      (a chamada única sofria "fadiga" nos dias finais).
//   3. Revisor (Haiku): checa duplicatas entre dias, incoerência geográfica e
//      dias rasos; dias reprovados voltam para o escritor com o feedback.
//
// Custo típico (7 dias): ~R$1,20–1,60/roteiro. Margem no preço R$29,90: ~90%.

import Anthropic from '@anthropic-ai/sdk'
import { searchFlights, buildKiwiUrl } from '@/lib/travelpayouts'
import type {
  ChecklistSection,
  DayPlan,
  FullItinerary,
  PreviewData,
} from '@/lib/roteiro-types'

const ARCHITECT_MODEL = 'claude-sonnet-5'
const WRITER_MODEL = 'claude-opus-4-8'
const REVIEWER_MODEL = 'claude-haiku-4-5-20251001'

// Quantas chamadas de escritor rodam ao mesmo tempo (evita estourar rate limit)
const WRITER_CONCURRENCY = 4
// No máximo N dias voltam para reescrita após o revisor (limita custo/tempo)
const MAX_REPAIRS = 3

export interface EngineOpts {
  flexDates?: boolean
  /** CSV de modos: 'a-pe', 'transporte-publico', 'carro' — pode combinar ('a-pe,carro'). */
  mobility?: string
  surprise?: boolean
  radius?: number
}

/**
 * Transforma o CSV de modos de locomoção em instrução para o modelo.
 * Suporta combinações (ex: a pé + carro → mesclar com bom senso).
 */
export function buildMobilityHint(mobility: string | undefined): string {
  const modes = (mobility ?? '').split(',').filter(Boolean)
  if (modes.length === 0) return ''
  const parts: string[] = []
  if (modes.includes('a-pe')) parts.push('adora andar a pé (priorize trechos caminháveis e distâncias curtas dentro de cada região)')
  if (modes.includes('transporte-publico')) parts.push('usa transporte público (cite linhas e estações de metrô/ônibus/trem)')
  if (modes.includes('carro')) parts.push('terá carro disponível (estradas cênicas e distâncias maiores são bem-vindas; mencione estacionamento)')
  const joined = parts.join('; ')
  if (modes.length > 1) {
    const longHaul = modes.includes('carro') ? 'carro' : 'transporte público'
    return `O viajante quer MESCLAR modos de locomoção: ${joined}. Combine com bom senso — a pé dentro de cada bairro, ${longHaul} nos deslocamentos longos e day trips.`
  }
  return `O viajante ${joined}.`
}

// ── Etapa 0 — preço real do voo ────────────────────────────────────────────

/**
 * Busca o menor preço real GRU/origem → destino (ida e volta) via Travelpayouts.
 * Nunca lança: retorna null se a API falhar/demorar — o roteiro segue com a
 * estimativa do preview.
 */
export async function fetchRealFlightPrice(
  originIATA: string,
  destinationIATA: string,
  checkIn: string,
  checkOut: string,
): Promise<number | null> {
  if (!process.env.TRAVELPAYOUTS_TOKEN || !originIATA || !destinationIATA) return null
  const date = checkIn && checkIn.length === 10 ? checkIn : ''
  if (!date) return null
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000))
    const search = searchFlights({
      origin: originIATA,
      destination: destinationIATA,
      date,
      returnDate: checkOut && checkOut.length === 10 ? checkOut : undefined,
      currency: 'brl',
    }).then((results) => (results.length > 0 ? results[0].price : null))
    return await Promise.race([search, timeout])
  } catch (err) {
    console.warn('[roteiro-engine] preço real de voo indisponível:', err)
    return null
  }
}

/**
 * Substitui a categoria "Voos" do orçamento pelo preço real encontrado e
 * redistribui a diferença proporcionalmente nas demais categorias, mantendo o
 * total. Só aplica se o preço real for plausível (abaixo de 70% do orçamento).
 */
export function applyRealFlightPrice(preview: PreviewData, flightPriceBRL: number | null): PreviewData {
  if (!flightPriceBRL || flightPriceBRL <= 0) return preview
  if (flightPriceBRL >= preview.totalBudget * 0.7) return preview

  const breakdown = preview.budgetBreakdown.map((c) => ({ ...c }))
  const voosIdx = breakdown.findIndex((c) => c.category.toLowerCase().includes('voo'))
  if (voosIdx === -1) return preview

  const oldVoos = breakdown[voosIdx].estimated
  const newVoos = Math.round(flightPriceBRL)
  const delta = oldVoos - newVoos
  if (delta === 0) return preview

  breakdown[voosIdx].estimated = newVoos
  breakdown[voosIdx].tip = 'Menor preço real encontrado hoje (ida e volta, por pessoa) — reserve pelo link de voos do roteiro.'

  // Redistribui a diferença proporcionalmente entre as outras categorias
  const others = breakdown.filter((_, i) => i !== voosIdx)
  const othersTotal = others.reduce((s, c) => s + c.estimated, 0)
  if (othersTotal > 0) {
    let distributed = 0
    others.forEach((c, i) => {
      const share = i === others.length - 1
        ? delta - distributed // último absorve o arredondamento
        : Math.round(delta * (c.estimated / othersTotal))
      c.estimated = Math.max(0, c.estimated + share)
      distributed += share
    })
  }

  // Recalcula percentuais para somarem 100
  const total = breakdown.reduce((s, c) => s + c.estimated, 0) || 1
  let pctSum = 0
  breakdown.forEach((c, i) => {
    if (i === breakdown.length - 1) {
      c.percentage = Math.max(0, 100 - pctSum)
    } else {
      c.percentage = Math.round((c.estimated / total) * 100)
      pctSum += c.percentage
    }
  })

  return { ...preview, budgetBreakdown: breakdown }
}

// ── Regras de documentação (compartilhadas entre etapas) ───────────────────

const VISA_RULES = `REGRAS DE DOCUMENTAÇÃO PARA BRASILEIROS (OBRIGATÓRIO — nunca inventar requisitos):
- VISTO OBRIGATÓRIO: EUA (B1/B2 — NÃO ESTA), Canadá (visto de visitante — NÃO eTA), Austrália (visto de visitante — NÃO eVisitor), Japão, China, Rússia, Índia, Arábia Saudita.
- ESTA/eTA NÃO se aplica a brasileiros. Nunca mencionar ESTA ou eTA para viajantes brasileiros.
- SEM VISTO (turismo): UE/Schengen, Reino Unido, América do Sul, México, Turquia, Marrocos, África do Sul, Tailândia, Coreia do Sul, EAU, Israel, Filipinas, Malásia, Indonésia, Nova Zelândia (com NZeTA).
- Se não tiver certeza absoluta: "Verifique os requisitos atualizados no consulado ou em gov.br/mre."
- Seguro viagem obrigatório para Espaço Schengen (mín. EUR 30.000). Recomendado para todos.
- Passaporte com validade mínima de 6 meses além da data de retorno.`

// ── Etapa 1 — Arquiteto ────────────────────────────────────────────────────

interface DaySkeleton {
  day: number
  area: string
  theme: string
  anchors: string[]
  isDayTrip: boolean
  logistics: string
}

interface ArchitectPlan {
  days: DaySkeleton[]
  reservations: string[]
  checklist: ChecklistSection[]
}

const ARCHITECT_TOOL = {
  name: 'montar_esqueleto',
  description: 'Registra o esqueleto estrutural da viagem, dia a dia, antes da escrita detalhada.',
  input_schema: {
    type: 'object' as const,
    properties: {
      days: {
        type: 'array',
        description: 'Um item por dia da viagem, na ordem.',
        items: {
          type: 'object',
          properties: {
            day: { type: 'integer' },
            area: { type: 'string', description: 'Bairro/região REAL onde o dia se concentra (ex: "Alfama e Castelo", "Sintra"). Dias vizinhos devem ser geograficamente coerentes — sem zigue-zague pela cidade.' },
            theme: { type: 'string', description: 'Tema do dia em poucas palavras (ex: "Centro histórico e miradouros").' },
            anchors: { type: 'array', items: { type: 'string' }, description: '3 a 5 lugares REAIS e específicos que ancoram o dia. NUNCA repetir um lugar já usado em outro dia.' },
            isDayTrip: { type: 'boolean', description: 'true se o dia é um bate-volta fora da cidade base.' },
            logistics: { type: 'string', description: '1 frase sobre deslocamento do dia (a pé/metrô/trem/carro, tempo aproximado).' },
          },
          required: ['day', 'area', 'theme', 'anchors', 'isDayTrip', 'logistics'],
        },
      },
      reservations: {
        type: 'array',
        items: { type: 'string' },
        description: 'O que precisa ser reservado com antecedência (atrações com fila/esgotam, restaurantes concorridos, trens).',
      },
      checklist: {
        type: 'array',
        description: 'Checklist de preparação: Documentos (visto correto para BRASILEIROS conforme as regras), Saúde, Finanças, Tecnologia.',
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
    required: ['days', 'reservations', 'checklist'],
  },
}

async function generateArchitectPlan(
  client: Anthropic,
  preview: PreviewData,
  totalDays: number,
  checkIn: string,
  priorities: string[],
  originCity: string,
  opts: EngineOpts,
): Promise<ArchitectPlan> {
  const mobilityHint = buildMobilityHint(opts.mobility)
  const surpriseHint = opts.surprise ? 'Inclua 1-2 dias (ou meios-dias) em vilas/cidades pouco conhecidas próximas — o fator surpresa é desejado.' : ''
  const radiusHint = opts.radius && opts.radius > 0 ? `Considere day trips num raio de ${opts.radius} km.` : ''

  const response = await client.messages.create({
    model: ARCHITECT_MODEL,
    max_tokens: 4000,
    system: `Você é o arquiteto de roteiros da Go Livoo. Sua função é desenhar o ESQUELETO de uma viagem premium — a lógica geográfica e o ritmo — que depois será escrito em detalhe por outra etapa.

Princípios:
- COERÊNCIA GEOGRÁFICA é a regra número 1: cada dia se concentra numa região; dias vizinhos ficam próximos; nada de cruzar a cidade duas vezes no mesmo dia.
- Ritmo realista: alternar dias intensos e leves; day trips no meio da viagem, nunca no dia da chegada ou da partida.
- Âncoras REAIS e específicas, sem repetição entre dias.
- Dia 1 considera chegada/check-in; último dia considera partida.

${VISA_RULES}

Use a ferramenta montar_esqueleto.`,
    messages: [{
      role: 'user',
      content: `Desenhe o esqueleto de ${totalDays} dias em ${preview.destination}:
- Viajante BRASILEIRO saindo de ${originCity}${checkIn ? `, chegando em ${checkIn}` : ''}
- Orçamento total: R$ ${preview.totalBudget.toLocaleString('pt-BR')}
- Prioridades: ${priorities.join(', ') || 'equilíbrio geral'}
${mobilityHint ? '- ' + mobilityHint : ''}
${surpriseHint ? '- ' + surpriseHint : ''}
${radiusHint ? '- ' + radiusHint : ''}

Crie EXATAMENTE ${totalDays} dias. O checklist de Documentos deve refletir exatamente o que ${preview.destination} exige de brasileiros.`,
    }],
    tools: [ARCHITECT_TOOL],
    tool_choice: { type: 'tool', name: 'montar_esqueleto' },
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Arquiteto não retornou o esqueleto estruturado')
  }
  return toolUse.input as ArchitectPlan
}

// ── Etapa 2 — Escritor (um dia por chamada, Opus 4.8) ──────────────────────

const DAY_WRITER_TOOL = {
  name: 'escrever_dia',
  description: 'Registra o conteúdo premium completo de UM dia do roteiro.',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: { type: 'string', description: 'Título curto e evocativo do dia.' },
      activities: {
        type: 'array',
        description: '4 a 5 atividades com horário, na ordem do dia.',
        items: {
          type: 'object',
          properties: {
            time: { type: 'string', description: 'Horário, ex: "09h", "14h30".' },
            title: { type: 'string', description: 'Nome da atividade ou lugar real.' },
            desc: { type: 'string', description: 'Descrição RICA de 4 a 6 frases (um parágrafo cheio): o que é o lugar, por que vale, o que ver/fazer ali especificamente, quanto tempo reservar, e um detalhe prático (melhor horário, ingresso, como chegar). Guia premium, não bullet seco.' },
          },
          required: ['time', 'title', 'desc'],
        },
      },
      curiosity: { type: 'string', description: 'Parágrafo denso (4-6 frases) com uma curiosidade histórica/cultural ÚNICA e verdadeira sobre algo do dia — etimologia, fato escondido, lenda, evento histórico. Conte como uma boa história; surpreenda quem já viajou muito.' },
      hiddenGem: { type: 'string', description: 'Parágrafo (3-5 frases) sobre uma joia escondida "por perto": lugar autêntico fora do circuito, como chegar a partir do roteiro do dia, por que vale.' },
      travelerTip: { type: 'string', description: 'Parágrafo (3-5 frases) com dica de viajante experiente e específica: horário para evitar fila, golpe comum, atalho, como economizar, o que reservar antes.' },
      restaurants: {
        type: 'array',
        description: '2 a 3 restaurantes REAIS na região do dia.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nome real do restaurante.' },
            desc: { type: 'string', description: '2-4 frases: cozinha, o prato para pedir, ambiente, faixa de preço, por que vale.' },
          },
          required: ['name', 'desc'],
        },
      },
    },
    required: ['title', 'activities', 'curiosity', 'hiddenGem', 'travelerTip', 'restaurants'],
  },
}

// Trecho-exemplo do padrão-ouro (roteiro de Lisboa feito à mão) — calibra o
// tom e a densidade da prosa que o escritor deve entregar.
const STYLE_EXEMPLAR = `EXEMPLO DO PADRÃO DE QUALIDADE (trecho real de um roteiro nota 10):
"O nome Alfama vem do árabe al-hamma — 'os banhos quentes' — uma lembrança dos oito séculos em que Lisboa foi cidade moura. É o único bairro que sobreviveu quase intacto ao terramoto de 1755, e por isso as ruas ainda seguem o traçado medieval: becos que terminam em escadarias, roupa estendida entre janelas, e o fado escapando das tascas ao entardecer. Suba sem pressa até o Miradouro de Santa Luzia — os azulejos do muro contam a conquista de Lisboa em 1147 — e reserve uns 40 minutos só para se perder; em Alfama, errar o caminho é o caminho."
Esse é o nível: contexto histórico + sensação do lugar + detalhe prático, em prosa fluida.`

function buildWriterSystem(destination: string): string {
  return `Você escreve UM dia de um roteiro de viagem PREMIUM da Go Livoo para ${destination}. O cliente PAGOU por este roteiro — cada dia precisa ser melhor do que qualquer blog gratuito.

PROFUNDIDADE (regra mais importante): parágrafos DENSOS e envolventes, nunca frases curtas ou bullets secos. Cada descrição tem contexto, história, sensação do lugar e detalhe prático. Conteúdo raso é falha grave.

${STYLE_EXEMPLAR}

REGRAS:
- Lugares e restaurantes REAIS e específicos. Se não tiver certeza de um fato, escolha outro que conheça — nunca invente nomes.
- Respeite o esqueleto do dia (região e âncoras) — ele garante a coerência geográfica da viagem.
- NÃO use lugares/restaurantes reservados para outros dias (lista fornecida).
- Horários realistas, na ordem do dia.

Use a ferramenta escrever_dia.`
}

interface WriterContext {
  destination: string
  skeleton: ArchitectPlan
  priorities: string[]
  mobility: string
  totalDays: number
}

async function writeDay(
  client: Anthropic,
  ctx: WriterContext,
  day: DaySkeleton,
  feedback?: string,
): Promise<DayPlan> {
  const otherAnchors = ctx.skeleton.days
    .filter((d) => d.day !== day.day)
    .flatMap((d) => d.anchors)
  const prev = ctx.skeleton.days.find((d) => d.day === day.day - 1)
  const next = ctx.skeleton.days.find((d) => d.day === day.day + 1)

  const mobilityHint = buildMobilityHint(ctx.mobility)

  const userPrompt = `Escreva o DIA ${day.day} de ${ctx.totalDays} em ${ctx.destination}.

ESQUELETO DESTE DIA (siga-o):
- Região: ${day.area}
- Tema: ${day.theme}
- Âncoras do dia: ${day.anchors.join('; ')}
- Deslocamento: ${day.logistics}${day.isDayTrip ? '\n- Este dia é um BATE-VOLTA fora da cidade base.' : ''}

CONTEXTO DA VIAGEM:
${prev ? `- Ontem (dia ${prev.day}): ${prev.area} — ${prev.theme}` : '- Este é o dia de CHEGADA (considere desembarque e check-in).'}
${next ? `- Amanhã (dia ${next.day}): ${next.area} — ${next.theme}` : '- Este é o ÚLTIMO dia (considere a partida).'}
- Prioridades do viajante: ${ctx.priorities.join(', ') || 'equilíbrio geral'}
${mobilityHint ? '- ' + mobilityHint : ''}

LUGARES JÁ USADOS EM OUTROS DIAS (NÃO repetir): ${otherAnchors.join('; ') || 'nenhum'}
${feedback ? `\nFEEDBACK DO REVISOR (corrija exatamente isto): ${feedback}` : ''}

Entregue: 4-5 atividades com horário + curiosidade + joia escondida + dica de viajante + 2-3 restaurantes reais da região.`

  const response = await client.messages.create({
    model: WRITER_MODEL,
    max_tokens: 6000,
    system: buildWriterSystem(ctx.destination),
    messages: [{ role: 'user', content: userPrompt }],
    tools: [DAY_WRITER_TOOL],
    tool_choice: { type: 'tool', name: 'escrever_dia' },
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error(`Escritor não retornou o dia ${day.day}`)
  }
  const written = toolUse.input as Omit<DayPlan, 'day'>
  return { day: day.day, ...written }
}

/** Executa tarefas assíncronas com limite de concorrência, preservando a ordem. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// ── Etapa 3 — Revisor (Haiku) ──────────────────────────────────────────────

const REVIEWER_TOOL = {
  name: 'registrar_revisao',
  description: 'Registra os problemas encontrados no roteiro (ou lista vazia se estiver bom).',
  input_schema: {
    type: 'object' as const,
    properties: {
      issues: {
        type: 'array',
        description: 'Problemas graves encontrados. Lista vazia se o roteiro está aprovado.',
        items: {
          type: 'object',
          properties: {
            day: { type: 'integer', description: 'Dia com problema.' },
            problem: { type: 'string', description: 'Descrição objetiva do problema e do que corrigir (1-2 frases).' },
          },
          required: ['day', 'problem'],
        },
      },
    },
    required: ['issues'],
  },
}

async function reviewItinerary(
  client: Anthropic,
  destination: string,
  days: DayPlan[],
): Promise<{ day: number; problem: string }[]> {
  const summary = days.map((d) => ({
    day: d.day,
    title: d.title,
    activities: d.activities.map((a) => a.title),
    restaurants: (d.restaurants ?? []).map((r) => r.name),
    curiosityTopic: (d.curiosity ?? '').slice(0, 100),
  }))

  try {
    const response = await client.messages.create({
      model: REVIEWER_MODEL,
      max_tokens: 1500,
      system: `Você é o revisor de qualidade de roteiros da Go Livoo. Analise o resumo do roteiro de ${destination} e aponte APENAS problemas graves:
1. DUPLICATAS: mesma atração ou mesmo restaurante aparecendo em mais de um dia.
2. INCOERÊNCIA GEOGRÁFICA: um dia que mistura regiões distantes sem sentido.
3. DIA RASO: dia com menos de 4 atividades ou sem restaurantes.
Não aponte questões de estilo ou preferência. Se estiver tudo bem, retorne lista vazia. Use a ferramenta registrar_revisao.`,
      messages: [{ role: 'user', content: JSON.stringify(summary) }],
      tools: [REVIEWER_TOOL],
      tool_choice: { type: 'tool', name: 'registrar_revisao' },
    })
    const toolUse = response.content.find((b) => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') return []
    const out = toolUse.input as { issues?: { day: number; problem: string }[] }
    return Array.isArray(out.issues) ? out.issues : []
  } catch (err) {
    // Revisor é best-effort: se falhar, o roteiro segue sem a passada extra.
    console.warn('[roteiro-engine] revisor falhou (não-bloqueante):', err)
    return []
  }
}

// ── Orquestração ───────────────────────────────────────────────────────────

export async function generateFullItineraryV2(
  client: Anthropic,
  preview: PreviewData,
  checkIn: string,
  checkOut: string,
  priorities: string[],
  originCity: string = 'São Paulo',
  originIATA: string = 'GRU',
  opts: EngineOpts = {},
): Promise<FullItinerary> {
  const nights = (checkIn && checkOut)
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 7
  const totalDays = Math.max(1, Math.min(nights + 1, 21)) // teto de 21 dias por segurança

  // Etapas 0 e 1 em paralelo: preço real do voo + esqueleto da viagem
  const [flightPrice, skeleton] = await Promise.all([
    fetchRealFlightPrice(originIATA, preview.destinationIATA, checkIn, checkOut),
    generateArchitectPlan(client, preview, totalDays, checkIn, priorities, originCity, opts),
  ])

  const enrichedPreview = applyRealFlightPrice(preview, flightPrice)

  // Garante exatamente totalDays dias no esqueleto (o modelo raramente erra,
  // mas o cliente pagou por N dias — não pode faltar nenhum)
  const skeletonDays: DaySkeleton[] = Array.from({ length: totalDays }, (_, i) => {
    const found = skeleton.days.find((d) => d.day === i + 1)
    return found ?? {
      day: i + 1,
      area: preview.destination,
      theme: `Dia ${i + 1} em ${preview.destination}`,
      anchors: [],
      isDayTrip: false,
      logistics: 'A definir conforme o dia anterior.',
    }
  })
  const normalizedSkeleton: ArchitectPlan = { ...skeleton, days: skeletonDays }

  const ctx: WriterContext = {
    destination: preview.destination,
    skeleton: normalizedSkeleton,
    priorities,
    mobility: opts.mobility ?? '',
    totalDays,
  }

  // Etapa 2 — escreve todos os dias em paralelo (com limite de concorrência)
  let dayByDay = await mapWithConcurrency(skeletonDays, WRITER_CONCURRENCY, (d) => writeDay(client, ctx, d))

  // Etapa 3 — revisão + reparo dos dias reprovados
  const issues = await reviewItinerary(client, preview.destination, dayByDay)
  if (issues.length > 0) {
    const toRepair = issues.slice(0, MAX_REPAIRS)
    console.info(`[roteiro-engine] revisor apontou ${issues.length} problema(s); reparando ${toRepair.length} dia(s)`)
    await Promise.all(toRepair.map(async ({ day, problem }) => {
      const skel = skeletonDays.find((d) => d.day === day)
      if (!skel) return
      try {
        const repaired = await writeDay(client, ctx, skel, problem)
        dayByDay = dayByDay.map((d) => (d.day === day ? repaired : d))
      } catch (err) {
        console.warn(`[roteiro-engine] reparo do dia ${day} falhou (mantendo versão original):`, err)
      }
    }))
  }

  // Reservas antecipadas entram como seção extra do checklist
  const checklist: ChecklistSection[] = [...(normalizedSkeleton.checklist ?? [])]
  if ((normalizedSkeleton.reservations ?? []).length > 0) {
    checklist.push({ category: 'Reservar com antecedência', items: normalizedSkeleton.reservations })
  }

  const cityName = preview.destination.split(',')[0].trim()
  const hotelParams = new URLSearchParams({ destino: cityName })
  if (checkIn) hotelParams.set('checkIn', checkIn)
  if (checkOut) hotelParams.set('checkOut', checkOut)

  return {
    ...enrichedPreview,
    dayByDay: dayByDay.sort((a, b) => a.day - b.day),
    checklist,
    // Links calculados no código — o modelo não fabrica URLs.
    flightLink: buildKiwiUrl(originIATA, preview.destinationIATA, checkIn, checkOut, 1),
    hotelLink: `/hoteis?${hotelParams.toString()}`, // nossa camada, agora com o destino do cliente
  }
}
