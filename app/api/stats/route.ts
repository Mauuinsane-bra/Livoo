// app/api/stats/route.ts
// GET /api/stats — contador de roteiros gerados (Supabase)
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 300 // cache 5 minutos

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('itineraries')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    // Adicionar base do período de testes interno
    const realCount = (count ?? 0)
    const displayCount = realCount + 47

    return NextResponse.json({ count: displayCount, raw: realCount })
  } catch (err) {
    console.error('[stats] erro:', err)
    return NextResponse.json({ count: 47 })
  }
}
