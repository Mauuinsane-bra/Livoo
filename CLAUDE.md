# Go Livoo — Contexto do Projeto para Claude

## Stack
- **Next.js 16** (App Router) + **React 18** + **TypeScript**
- **Sanity CMS** — posts do blog via GROQ
- **Vercel** — deploy automático a partir de `main` no GitHub (`Mauuinsane-bra/Livoo.git`)
- **Resend** — envio de emails (waitlist + newsletter)
- **Git repo local**: `/tmp/livoo-fix/` (clone de trabalho, NUNCA editar direto no mount Windows)

## Regra crítica: null bytes do Windows
Arquivos copiados do mount Windows (`/sessions/.../mnt/livoo/`) chegam com null bytes de padding NTFS.
**Nunca usar `cp` do mount para o repo.** Sempre editar direto em `/tmp/livoo-fix/` com Python ou heredoc bash.
Antes de qualquer commit, rodar: `node /tmp/livoo-fix/scripts/validate.js`

## Arquitetura de imagens do blog
```
_fallbackImageUrl   →  path local /blog-imgs/xxx.jpg  (máxima prioridade)
coverImage          →  Sanity CDN cdn.sanity.io        (pode estar quebrado)
coverImageUrl       →  URL externa (Wikipedia → Unsplash via sanitizeImageUrl)
```
- `findCoverImage(title, category)` — mapeia títulos para `/blog-imgs/` locais
- Quando `findCoverImage` retorna algo: define `_fallbackImageUrl` E zera `coverImage = undefined`
- `postImg()` nos page.tsx: tenta `coverImage` primeiro, cai no `_fallbackImageUrl`
- `<BlogImage src fallback>` — componente cliente com `onError` para troca automática

## Conteúdo rico do blog
- Posts Sanity sem imagens no corpo recebem `_fallbackContent` (HTML local)
- `findRichContent(title, category)` mapeia títulos → arquivos em `lib/content/`
- `_fallbackContent` tem prioridade sobre `post.content` no render do slug page
- HTML do `_fallbackContent` é sanitizado — `style` permitido em: `div, span, p, a, figure, figcaption, img`

## Arquivos principais
| Arquivo | Função |
|---|---|
| `lib/sanity-queries.ts` | Queries GROQ + lógica de fallback de imagem/conteúdo |
| `lib/blog-data.ts` | Posts locais — sempre mesclados com Sanity (nunca substituídos) |
| `lib/content/mexico-copa-2026.ts` | HTML rico do artigo México Copa 2026 |
| `app/blog/BlogImage.tsx` | Componente cliente com onError fallback |
| `app/blog/page.tsx` | Homepage do blog |
| `app/blog/categoria/[slug]/page.tsx` | Página de categoria (usa BlogImage) |
| `app/blog/[slug]/page.tsx` | Artigo completo |
| `app/api/newsletter/route.ts` | Endpoint REST da newsletter |
| `app/api/waitlist/route.ts` | Endpoint da waitlist |
| `public/blog-imgs/` | Fotos locais: cdmx, azteca, benito, aifa, monterrey, bbva, guadalajara, akron |

## getAllPosts — comportamento
1. Busca posts do Sanity
2. Para cada post, `findCoverImage()` primeiro — se local, zera `coverImage`
3. Mescla com posts locais do `blog-data.ts` (deduplicação por slug)
4. Se Sanity falha totalmente, usa só `blog-data.ts`

## getPostsByCategory — comportamento
1. Busca por categoria no Sanity (com GROQ estendido para copa-do-mundo)
2. Aplica mesma lógica de fallback de imagem
3. Se Sanity retorna vazio, filtra `BLOG_POSTS` locais pela categoria

## Newsletter
- Componente: `app/blog/NewsletterForm.tsx` (useState + fetch, sem useFormState)
- Endpoint: `POST /api/newsletter` → Resend
- Env vars necessárias: `RESEND_API_KEY`, `RESEND_NOTIFY_EMAIL`

## Waitlist
- Endpoint: `POST /api/waitlist` → salva em `data/waitlist.json` + Resend
- Rate limit: 3 tentativas por IP em 10 min
- Email de notificação: `contato@golivoo.com.br`

## Workflow de commit seguro
```bash
# 1. Validar antes de commitar
node /tmp/livoo-fix/scripts/validate.js

# 2. Commitar
cd /tmp/livoo-fix && git add [arquivos] && git commit -m "mensagem" && git push origin main
```

## Adicionar novo post
```bash
node /tmp/livoo-fix/scripts/new-post.js
# Preenche interativamente e gera os arquivos necessários
```
