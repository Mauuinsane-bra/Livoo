#!/usr/bin/env node
// scripts/new-post.js — gerador de novo post para o blog Go Livoo
// Uso: node scripts/new-post.js

import fs from 'fs'
import path from 'path'
import readline from 'readline'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(res => rl.question(q, res))

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  console.log('\n🚀 Gerador de novo post — Go Livoo Blog\n')

  const title    = await ask('Título do post: ')
  const excerpt  = await ask('Resumo (1 frase): ')
  const category = await ask('Categoria (ex: Copa do Mundo 2026, Destinos, Guias): ')
  const slug     = await ask(`Slug (Enter = "${slugify(title)}"): `) || slugify(title)
  const imageUrl = await ask('Imagem de capa (ex: /blog-imgs/cdmx.jpg): ')
  const readTime = await ask('Tempo de leitura em minutos (ex: 8): ')

  rl.close()

  const date = new Date().toISOString().split('T')[0]

  // 1. Criar lib/content/<slug>.ts
  const contentPath = path.join(ROOT, 'lib', 'content', `${slug}.ts`)
  const contentTs = `// lib/content/${slug}.ts
// Conteúdo HTML rico para o post: ${title}

export const ${slug.replace(/-/g, '_').toUpperCase()}_HTML = \`
<p>${excerpt}</p>

<!-- Adicione o conteúdo completo do artigo aqui -->
<!-- Use <figure><img src="/blog-imgs/foto.jpg" ...></figure> para fotos -->
\`
`
  fs.writeFileSync(contentPath, contentTs, 'utf-8')
  console.log(`\n✓ Criado: lib/content/${slug}.ts`)

  // 2. Adicionar entrada no blog-data.ts
  const blogDataPath = path.join(ROOT, 'lib', 'blog-data.ts')
  let blogData = fs.readFileSync(blogDataPath, 'utf-8')
  const newEntry = `  {
    slug: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    category: '${category}',
    date: '${date}',
    readTime: ${readTime || 8},
    imageUrl: '${imageUrl || ''}',
    tags: [],
    featured: false,
    content: '',  // conteúdo via RICH_CONTENT_MAP em sanity-queries.ts
  },`

  blogData = blogData.replace(/^]$/m, newEntry + '\n]')
  fs.writeFileSync(blogDataPath, blogData, 'utf-8')
  console.log(`✓ Adicionado em: lib/blog-data.ts`)

  // 3. Instrução para sanity-queries.ts
  const varName = slug.replace(/-/g, '_').toUpperCase() + '_HTML'
  console.log(`
⚠️  Passos manuais restantes:
1. Em lib/sanity-queries.ts, adicione o import:
   import { ${varName} } from './content/${slug}'

2. Adicione ao COVER_IMAGE_MAP:
   [/<palavra-chave>/i, '${imageUrl}'],

3. Adicione ao RICH_CONTENT_MAP:
   [/<palavra-chave>/i, ${varName}],

4. Escreva o conteúdo em lib/content/${slug}.ts

5. Valide e commite:
   node scripts/validate.js
   git add lib/content/${slug}.ts lib/blog-data.ts lib/sanity-queries.ts
   git commit -m "feat: novo post — ${title}"
   git push origin main
`)
}

main().catch(console.error)
