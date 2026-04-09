# Auditoria de Seguranca — Go Livoo

**Data:** 9 de abril de 2026
**Projeto:** Go Livoo (Next.js 16 + Clerk + Prisma + SQLite)
**Escopo:** API routes, autenticacao, dependencias, exposicao de dados

---

## Resumo Executivo

A Go Livoo apresenta **5 vulnerabilidades criticas** e **7 medias** que devem ser corrigidas antes do lancamento em producao. As mais urgentes sao: o endpoint GET da waitlist expondo dados pessoais sem autenticacao, ausencia de rate limiting global, e validacao insuficiente de inputs nas API routes.

| Severidade | Quantidade | Status |
|------------|-----------|--------|
| Critica    | 5         | Corrigir antes do lancamento |
| Media      | 7         | Corrigir no proximo sprint |
| Baixa      | 4         | Melhorias recomendadas |

---

## Vulnerabilidades Criticas

### 1. Waitlist GET expoe dados pessoais sem autenticacao

**Arquivo:** `app/api/waitlist/route.ts` (linhas 171-175)
**Risco:** Qualquer pessoa pode acessar `/api/waitlist` e baixar nomes e emails de todos os inscritos.

**Codigo vulneravel:**
```typescript
export async function GET() {
  const entries = readList()
  return NextResponse.json({ total: entries.length, entries })
}
```

**Impacto:** Vazamento de PII (dados pessoais) — viola LGPD.
**Correcao:** Remover o endpoint GET ou protege-lo com autenticacao de admin.

---

### 2. Rate limiting bypassavel por IP spoofing

**Arquivo:** `app/api/waitlist/route.ts` (linhas 67-69)
**Risco:** O rate limiting usa `x-forwarded-for`, que o atacante pode falsificar.

**Codigo vulneravel:**
```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers.get('x-real-ip')
          ?? 'unknown'
```

**Impacto:** Atacante pode fazer requisicoes ilimitadas mudando o header.
**Correcao:** Em ambiente Vercel, confiar apenas no IP injetado pela plataforma. Em outros ambientes, usar IP do socket. Idealmente, implementar rate limiting com Redis ou Upstash.

---

### 3. Nenhum rate limiting nas API routes principais

**Arquivos afetados:**
- `app/api/flights/route.ts`
- `app/api/hotels/route.ts`
- `app/api/events/route.ts`
- `app/api/experiences/route.ts`
- `app/api/roteiro/route.ts`
- `app/api/prep/route.ts`
- `app/api/prep/checkout/route.ts`

**Risco:** Todas essas rotas podem ser spamadas sem limite, causando:
- Consumo excessivo de creditos de API (OpenAI, Ticketmaster, Travelpayouts)
- Criacao de sessoes Stripe ilimitadas
- Degradacao de performance (DoS)

**Impacto:** Custo financeiro direto (billing de APIs) e indisponibilidade do servico.
**Correcao:** Implementar rate limiting global via middleware usando Upstash Redis ou similar.

---

### 4. Prompt injection no endpoint de roteiro IA

**Arquivo:** `app/api/roteiro/route.ts` (linhas 14, 46)
**Risco:** O campo `prompt` do usuario e enviado diretamente ao GPT-4o sem sanitizacao.

**Codigo vulneravel:**
```typescript
if (!prompt || prompt.trim().length < 10) { /* apenas checa tamanho */ }
// ...
const parsed = await parseItineraryRequest(prompt)  // prompt direto na IA
```

**Impacto:** Atacante pode manipular a resposta da IA para retornar dados falsos, URLs maliciosas, ou extrair informacoes do system prompt.
**Correcao:** Sanitizar o input (remover instrucoes de override), limitar tamanho maximo, e validar a resposta da IA antes de retornar ao cliente.

---

### 5. Email pessoal hardcoded no codigo-fonte

**Arquivo:** `app/api/waitlist/route.ts` (linha 107)
**Risco:** Email pessoal exposto publicamente no repositorio.

**Codigo vulneravel:**
```typescript
const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'casagrande_mauricio@hotmail.com'
```

**Impacto:** Exposicao de informacao pessoal. Se o repositorio for publico, qualquer pessoa ve o email.
**Correcao:** Remover o fallback hardcoded. Usar apenas a variavel de ambiente.

---

## Vulnerabilidades Medias

### 6. Nenhuma validacao de input nos parametros de busca

**Arquivos:** Todas as API routes de busca (flights, hotels, events, airports, experiences)
**Risco:** Parametros como `origin`, `destination`, `date`, `passengers`, `adults` nao sao validados alem de presenca.

**Exemplos de ataque:**
- `?passengers=-999` ou `?passengers=9999999999`
- `?date=invalido` ou `?date=9999-99-99`
- `?origin=<script>alert(1)</script>`

**Correcao:** Validar formato (IATA = 3 letras maiusculas, datas = YYYY-MM-DD, numeros = range razoavel).

---

### 7. Race condition no armazenamento da waitlist

**Arquivo:** `app/api/waitlist/route.ts` (linhas 88-102)
**Risco:** Padrao read-modify-write sem lock no arquivo JSON.

**Cenario:** Duas requisicoes simultaneas leem a lista, cada uma adiciona um email, e a segunda sobrescreve a primeira.
**Correcao:** Usar banco de dados (Prisma/SQLite ja esta configurado) em vez de arquivo JSON, ou implementar file locking.

---

### 8. Rate limiting in-memory nao funciona em serverless

**Arquivo:** `app/api/waitlist/route.ts` (linha 13)
**Risco:** O `Map` e reiniciado a cada cold start do Lambda/Edge Function na Vercel.

**Impacto:** Rate limiting efetivamente inexistente em producao serverless.
**Correcao:** Usar Upstash Redis para rate limiting persistente.

---

### 9. Rotas de API nao protegidas por autenticacao

**Arquivo:** `middleware.ts`
**Risco:** Apenas `/dashboard/*`, `/roteiro/*` e `/prep/*` exigem login. Todas as API routes sao publicas.

**Impacto:** Qualquer pessoa pode consumir suas APIs sem estar logada.
**Correcao:** Proteger ao menos `/api/roteiro` e `/api/prep/checkout` que envolvem custos (OpenAI, Stripe).

---

### 10. Informacoes sensíveis em URLs de sucesso do Stripe

**Arquivo:** `app/api/prep/checkout/route.ts`
**Risco:** A URL de sucesso inclui `destination` e `nationality` como query params, que ficam no historico do navegador e logs de servidor.

**Correcao:** Usar metadata do Stripe e buscar dados server-side na pagina de sucesso.

---

### 11. Erros podem vazar detalhes internos

**Arquivos:** Todas as API routes
**Risco:** `console.error` com objetos de erro completos pode incluir stack traces, URLs internas e tokens em logs.

**Correcao:** Logar apenas mensagens controladas. Em producao, usar servico de monitoramento (Sentry) com redacao automatica de dados sensíveis.

---

### 12. Validacao de email fraca

**Arquivo:** `app/api/waitlist/route.ts` (linha 84)
**Risco:** A regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` aceita emails como `a@b.c`.

**Correcao:** Usar validacao mais robusta ou biblioteca como `validator.js`.

---

## Vulnerabilidades Baixas

### 13. Campo `interests` da waitlist nao e validado
O array `interests` aceita qualquer conteudo (strings gigantes, objetos aninhados).

### 14. Dependencias nao auditadas
O `npm audit` nao pôde ser executado neste ambiente. Recomenda-se rodar localmente.

### 15. Sem headers de seguranca (CSP, HSTS, X-Frame-Options)
O `next.config.js` nao define security headers. Adicionar via `headers()` no config.

### 16. Sem CORS explicito nas API routes
As rotas API nao definem politica de CORS, dependendo do default do Next.js.

---

## Plano de Correcao Prioritizado

| Prioridade | Acao | Esforco |
|------------|------|---------|
| P0 | Proteger ou remover GET /api/waitlist | 15 min |
| P0 | Remover email hardcoded do codigo | 5 min |
| P1 | Implementar rate limiting global (Upstash) | 2-3h |
| P1 | Adicionar validacao de input em todas as API routes | 2-3h |
| P1 | Proteger /api/roteiro e /api/prep/checkout com auth | 30 min |
| P2 | Migrar waitlist de JSON para Prisma/SQLite | 1h |
| P2 | Adicionar security headers no next.config.js | 30 min |
| P2 | Sanitizar prompt antes de enviar ao OpenAI | 1h |
| P3 | Rodar npm audit e atualizar dependencias | 30 min |
| P3 | Implementar monitoramento (Sentry) | 1-2h |

---

*Relatório gerado automaticamente — Go Livoo, abril 2026*
