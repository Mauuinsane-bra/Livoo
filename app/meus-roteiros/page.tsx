// app/meus-roteiros/page.tsx — histórico de roteiros do usuário logado
import type { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserItineraries } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Meus Roteiros',
  description: 'Veja e revise todos os roteiros que você gerou na Go Livoo.',
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function extractDestination(prompt: string): string {
  const m = prompt.match(/FULL:(.+?)\s+\d{4}-\d{2}-\d{2}/)
  if (m) return m[1].trim()
  const preview = prompt.replace(/^(FULL:|PREVIEW:)/i, '').split(/\s+/).slice(0, 4).join(' ')
  return preview || 'Destino não identificado'
}

export default async function MeusRoteirosPage() {
  const { userId } = await auth()
  if (!userId) redirect('/entrar?redirect_url=/meus-roteiros')

  const user = await currentUser()
  const firstName = user?.firstName ?? 'Viajante'

  const itineraries = await getUserItineraries(userId)

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'var(--bg-alt)', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: 'var(--navy)', color: '#fff', padding: '48px 0 36px' }}>
          <div className="container">
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .6 }}>
              Olá, {firstName}
            </p>
            <h1 style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800 }}>
              Meus Roteiros
            </h1>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 36 }}>
          {itineraries.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 24px', display: 'block', opacity: .3 }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>
                Nenhum roteiro ainda
              </h2>
              <p style={{ color: 'var(--gray)', marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
                Monte seu primeiro roteiro personalizado — descreva a experiência que quer viver e a Go Livoo resolve o resto.
              </p>
              <Link href="/roteiro" className="btn-primary" style={{ display: 'inline-block' }}>
                Montar meu primeiro roteiro
              </Link>
            </div>
          ) : (
            <>
              {/* Stats bar */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '16px 24px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: 'var(--primary)' }}>{itineraries.length}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>roteiros gerados</p>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: '16px 24px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: 'var(--gold)' }}>
                    {itineraries.filter(i => i.prompt.startsWith('FULL:')).length}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>roteiros completos</p>
                </div>
              </div>

              {/* Itinerary cards */}
              <div style={{ display: 'grid', gap: 16 }}>
                {itineraries.map((item) => {
                  const isFullItinerary = item.prompt.startsWith('FULL:')
                  const destination = extractDestination(item.prompt)
                  const parsedData = item.parsed_data as Record<string, unknown> | undefined

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: '24px',
                        boxShadow: '0 1px 8px rgba(0,0,0,.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: isFullItinerary ? 'var(--navy)' : 'var(--light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke={isFullItinerary ? '#fff' : 'var(--primary)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <h3 style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>
                            {destination}
                          </h3>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                            background: isFullItinerary ? 'var(--navy)' : 'var(--light)',
                            color: isFullItinerary ? '#fff' : 'var(--primary)',
                            letterSpacing: '.06em', textTransform: 'uppercase',
                          }}>
                            {isFullItinerary ? 'Completo' : 'Preview'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--gray)' }}>
                          Gerado em {formatDate(item.created_at)}
                          {(parsedData as { duration?: number })?.duration &&
                            ` · ${(parsedData as { duration: number }).duration} dias`}
                        </p>
                      </div>

                      {/* Action */}
                      <Link
                        href={`/roteiro?q=${encodeURIComponent(destination)}`}
                        style={{
                          padding: '10px 20px', borderRadius: 10,
                          background: 'var(--primary)', color: '#fff',
                          fontWeight: 700, fontSize: 13, textDecoration: 'none',
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                      >
                        Gerar novamente
                      </Link>
                    </div>
                  )
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link href="/roteiro" className="btn-primary" style={{ display: 'inline-block' }}>
                  + Novo roteiro
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
