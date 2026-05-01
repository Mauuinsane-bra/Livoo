// lib/openai.ts
// Interpretação de roteiro em linguagem natural via GPT-4o

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface ParsedItinerary {
  destination:         string   // "Tbilisi, Geórgia"
  destinationIATA:     string   // "TBS"
  originIATA?:         string   // Inferido ou null
  event:               string   // "Rally Cross da FIA 2026"
  eventDate:           string | null
  suggestedDuration:   string   // "7 dias"
  experienceCategory:  'esportes' | 'música' | 'gastronomia' | 'aventura' | 'automobilismo' | 'cultura' | 'ecoturismo' | 'outro'
  visaRequired:        string   // "verificar via Sherpa"
  estimatedBudgetBRL:  number | null
  notes:               string
  searchQuery:         string   // Query para GetYourGuide
}

const SYSTEM_PROMPT = `Você é o motor de roteiros da Livoo, plataforma brasileira de soluções para viajantes.

Dado o pedido do usuário em linguagem natural, retorne um JSON com os campos abaixo.
Seja preciso com códigos IATA. Se não souber o código exato, retorne o mais provável.
Responda sempre em português brasileiro.

Schema JSON obrigatório:
{
  "destination": "Cidade, País",
  "destinationIATA": "Código IATA do aeroporto principal do destino (3 letras)",
  "originIATA": "Código IATA de origem (inferir 'GRU' se o usuário parecer brasileiro sem especificar)",
  "event": "Nome do evento ou experiência identificada",
  "eventDate": "Data aproximada em formato legível, ou null se não identificada",
  "suggestedDuration": "X dias",
  "experienceCategory": "um de: esportes|música|gastronomia|aventura|automobilismo|cultura|ecoturismo|outro",
  "visaRequired": "verificar via Sherpa",
  "estimatedBudgetBRL": número inteiro estimado ou null,
  "notes": "observações relevantes sobre a viagem, evento, requisitos especiais",
  "searchQuery": "query em inglês para buscar no GetYourGuide (ex: 'Tbilisi rally cross tour')"
}`

export async function parseItineraryRequest(userPrompt: string): Promise<ParsedItinerary> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const content = completion.choices[0].message.content
  if (!content) throw new Error('OpenAI retornou resposta vazia')
  return JSON.parse(content) as ParsedItinerary
}
