/**
 * /studio — redireciona para o Sanity Studio em golivoo.sanity.io
 *
 * O Studio embutido foi removido para compatibilidade com Next.js 16.
 * Para publicar posts, acesse: https://golivoo.sanity.io
 */
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  redirect('https://golivoo.sanity.io')
}
