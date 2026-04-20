/**
 * /studio — Sanity Studio embutido no Next.js
 * Acesse em: https://livoo-two.vercel.app/studio
 *
 * Para publicar um post:
 * 1. Faça login com sua conta Sanity (golivoo.sanity.io)
 * 2. Clique em "Posts do Blog" → "+ Novo Post"
 * 3. Preencha o conteúdo e clique em "Publicar"
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
