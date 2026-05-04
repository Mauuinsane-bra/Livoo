---
name: golivoo-blog-review
description: |
  Skill para revisar artigos do blog Go Livoo (golivoo.com.br) antes de publicar.
  Use SEMPRE que o usuário pedir para revisar, checar, melhorar ou corrigir um artigo de blog,
  mesmo que o pedido seja vago como "dá uma olhada nesse texto", "revisa isso", "está bom assim?"
  ou "me manda o artigo corrigido".

  A revisão cobre quatro eixos:
  1. Tom de voz e estilo Go Livoo
  2. SEO e estrutura de headings
  3. HTML técnico do artigo (cores, estilos, captions)
  4. CTAs, links internos e parceiros

  Entrega: um relatório de problemas encontrados + o artigo completo já corrigido.
---

# Revisão de Artigos — Go Livoo Blog

## Contexto do blog

O blog da Go Livoo fica em **golivoo.com.br/blog** e usa Next.js + Sanity CMS.
Os artigos ficam em `lib/content/<slug>.ts` como uma string de HTML exportada (`export const NOME_HTML = \`...\``).
O conteúdo é injetado via `_fallbackContent` e renderizado com `sanitize-html`.

---

## Eixo 1 — Tom de voz e estilo

### A identidade da Go Livoo
A Go Livoo vende experiências de viagem para brasileiros que querem aproveitar ao máximo.
O blog é a voz da marca: empolgante, prático, sem enrolação.

### Checklist de estilo

**Deve ter:**
- Frases curtas e diretas. Se uma frase tem mais de 25 palavras, provavelmente pode ser cortada ao meio.
- Segunda pessoa ("você"), nunca terceira impessoal.
- Verbos de ação no imperativo ou no indicativo ativo: "reserve", "explore", "aproveite" — não "é recomendável que o viajante".
- Pelo menos um dado ou fato concreto por seção (ex: preço médio, distância, tempo de trajeto).
- Títulos que fazem o leitor querer clicar: use números, perguntas ou afirmações fortes.
- O nome **Go Livoo** mencionado pelo menos uma vez de forma natural no texto.

**Não pode ter:**
- Papo furado ou enchimento ("É importante ressaltar que...", "Tendo em vista o exposto...").
- Repetição desnecessária de palavras dentro de um mesmo parágrafo.
- Jargão corporativo ou linguagem passiva ("foi possível observar", "faz-se necessário").
- Promessas vagas sem respaldo ("os melhores preços do mercado" sem contexto).
- Erros de português, acentuação e concordância.

### Correção esperada
Reescrever as frases problemáticas mantendo o sentido mas no tom Go Livoo.

---

## Eixo 2 — SEO e estrutura

### Checklist SEO

| Item | Critério |
|------|----------|
| **Título do artigo** | Entre 50–65 caracteres, palavra-chave principal na abertura |
| **Slug** | Kebab-case, sem acentos, máx. 60 chars, palavra-chave presente |
| **Excerpt / meta description** | 120–160 chars, contém a palavra-chave, termina com CTA implícito |
| **H2** | Pelo menos 3 H2 no corpo. Cada um com palavra-chave secundária ou pergunta comum |
| **H3** | Usados para subdivisões dentro de H2; não pular de H2 para H4 |
| **Palavra-chave primária** | Presente no primeiro parágrafo do corpo, em pelo menos um H2, e no último parágrafo |
| **Links internos** | Ao menos 1 link para outra página ou artigo do golivoo.com.br |
| **Texto alt de imagens** | Toda img com alt descritivo (não vazio, não genérico como "imagem") |
| **readTime** | Calculado como Math.ceil(wordCount / 200) minutos |

### Correção esperada
Ajustar os itens fora do padrão. Se o excerpt não existir, criar um.

---

## Eixo 3 — HTML técnico

Os artigos usam HTML inline com variáveis CSS do tema Go Livoo.
Sempre respeitar o sistema de design abaixo.

### Variáveis CSS disponíveis
- `--ink`     → cor principal do texto (quase preto)
- `--ink-2`   → texto secundário (cinza médio)
- `--muted`   → texto terciário (cinza claro)
- `--orange`  → laranja Go Livoo — usar para destaques
- `--bg-soft` → fundo suave (off-white)
- `--bg-2`    → fundo alternativo (cinza muito claro)
- `--line`    → cor de borda sutil

### Padrões HTML obrigatórios

**Figcaptions de imagens:**
```html
<figcaption style="font-size:12px;color:#888;text-align:center;font-style:italic;margin-top:4px;">
  Descrição da imagem
</figcaption>
```

**Cards de destaque (partidas, eventos, datas):**
```html
<div style="background:#1A56DB;color:#fff;border-radius:12px;padding:16px 20px;margin:12px 0;">
  <strong>TÍTULO DO CARD</strong><br/>
  Conteúdo do card
</div>
```

**Box de parceiro — RentCars:**
```html
<div style="border-left:4px solid #FF5A00;background:#FFF3EE;padding:16px 20px;border-radius:8px;margin:24px 0;">
  <strong style="color:#FF5A00;">RentCars</strong> — texto do anúncio/dica
</div>
```

**Links externos (parceiros, redes sociais):**
```html
<a href="URL" style="color:#1A56DB;font-weight:700;" target="_blank" rel="noopener">Texto do link</a>
```

**Menção às redes sociais Go Livoo — padrão obrigatório:**
```html
Siga a Go Livoo no 
<a href="https://instagram.com/golivoo" style="color:#1A56DB;font-weight:700;" target="_blank" rel="noopener">Instagram</a>
 e no 
<a href="https://tiktok.com/@golivoo" style="color:#1A56DB;font-weight:700;" target="_blank" rel="noopener">Go Livoo no TikTok</a>
 para dicas em primeira mão.
```

### O que verificar no HTML
- `<figure>` + `<figcaption>` usados em todas as imagens? Se não, adicionar.
- Links externos com `target="_blank" rel="noopener"`?
- Cores hardcoded fora do sistema de design? Substituir pelas variáveis.
- `<h1>` no corpo? **Proibido** — o título já é renderizado pelo layout. Rebaixar para `<h2>`.

---

## Eixo 4 — CTAs, links e parceiros

### Checklist

- Ao menos **1 CTA** explícito por artigo (ex: "Reserve sua passagem", "Confira os pacotes da Go Livoo")
- **Redes sociais** mencionadas ao menos 1 vez com links corretos:
  - Instagram: `https://instagram.com/golivoo`
  - TikTok: `https://tiktok.com/@golivoo` — label sempre **"Go Livoo no TikTok"**
- Se o artigo falar de aluguel de carro → incluir box RentCars com `border-left:4px solid #FF5A00`
- Se houver parceiro/afiliado mencionado → link com `rel="noopener"` e estilo azul `#1A56DB`
- CTA final antes do fechamento do artigo

---

## Como fazer a revisão

Quando o usuário colar um artigo (texto corrido ou HTML), siga esta sequência:

### Passo 1 — Análise rápida
Leia o artigo inteiro antes de escrever qualquer coisa. Identifique os problemas em cada eixo.

### Passo 2 — Relatório de revisão
Entregue primeiro o relatório neste formato:

```
## Revisão — [Título do artigo]

### O que está bom
- [lista breve]

### Problemas encontrados

**Tom de voz:**
- [problema específico com trecho original → sugestão]

**SEO:**
- [item fora do padrão → o que deve ser]

**HTML:**
- [elemento incorreto → padrão correto]

**CTAs e links:**
- [o que falta ou está errado]

### Pontuação estimada
| Eixo | Nota |
|------|------|
| Tom de voz | X/10 |
| SEO | X/10 |
| HTML | X/10 |
| CTAs | X/10 |
| Média | X/10 |
```

### Passo 3 — Artigo corrigido
Logo após o relatório, entregue o artigo **completo e já corrigido**,
pronto para ser copiado para o arquivo `.ts` do projeto.

Se o artigo for HTML (começa com `<`), entregar como bloco de código HTML.
Se for texto corrido, entregar em Markdown.

Sempre fechar com: *"Artigo pronto para publicar. Se quiser ajustar algo, é só falar."*

---

## Exemplos de ativação

O usuário pode dizer qualquer uma destas coisas:
- "Revisa esse artigo pra mim"
- "Dá uma olhada no texto sobre Cancún"
- "Está bom assim? [cola texto]"
- "Melhora esse HTML do blog"
- "Confere o SEO desse post"
- "Me manda esse artigo corrigido"
