import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getEventBySlug, getRelatedEvents } from '@/lib/events-data'
import FlightSearchInline from './FlightSearchInline'
import HotelSearchInline from './HotelSearchInline'

interface Props {
  params: { slug: string }
}

export default function EventoSlugPage({ params }: Props) {
  const event = getEventBySlug(params.slug)
  if (!event) notFound()

  const related = getRelatedEvents(event)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          priority
          unoptimized
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        {/* Overlay escuro */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,27,62,0.5) 0%, rgba(13,27,62,0.85) 100%)',
        }} />
        {/* Conteúdo do hero */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 0 32px',
          maxWidth: 1100, margin: '0 auto',
        }}>
          <div style={{ padding: '0 24px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Link href="/eventos" style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              }}>
                Eventos
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>›</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)',
              }}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
            </div>

            {/* Tag */}
            <span style={{
              display: 'inline-block',
              background: event.tagColor,
              color: '#fff',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.72rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: 20,
              textTransform: 'uppercase', letterSpacing: '0.5px',
              marginBottom: 10,
            }}>
              {event.flag} {event.tag}
            </span>

            <h1 style={{
              fontFamily: 'Fraunces, serif', fontSize: '2rem',
              color: '#fff', margin: '0 0 8px', lineHeight: 1.2,
            }}>
              {event.title}
            </h1>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.8)',
              }}>
                📅 {event.date}
              </span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.8)',
              }}>
                📍 {event.venue} · {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Corpo principal ──────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* ── Coluna esquerda ─────────────────────────── */}
          <div>
            {/* Descrição */}
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: '1.3rem',
              color: '#0D1B3E', marginBottom: 14,
            }}>
              Sobre o evento
            </h2>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.93rem',
              color: '#374151', lineHeight: 1.7, marginBottom: 32,
            }}>
              {event.longDesc}
            </p>

            {/* Ingressos — CTA principal */}
            <div style={{
              background: '#0D1B3E', borderRadius: 14,
              padding: '24px 28px', marginBottom: 32,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem',
                    fontWeight: 700, color: '#F5A623', textTransform: 'uppercase',
                    letterSpacing: '0.8px', marginBottom: 4,
                  }}>
                    Ingressos
                  </p>
                  <p style={{
                    fontFamily: 'Fraunces, serif', fontSize: '1.15rem',
                    color: '#fff', margin: '0 0 4px',
                  }}>
                    {event.priceEstimate}
                  </p>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.55)', margin: 0,
                  }}>
                    Site oficial — compra segura
                  </p>
                </div>
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#F5A623', color: '#0D1B3E',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800, fontSize: '0.9rem',
                    padding: '12px 28px', borderRadius: 10,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {event.ticketLabel} →
                </a>
              </div>
            </div>

            {/* Dicas práticas */}
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: '1.1rem',
              color: '#0D1B3E', marginBottom: 14,
            }}>
              Dicas para a viagem
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {event.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'Fraunces, serif', fontSize: '1rem',
                    fontWeight: 700, color: '#F5A623',
                    minWidth: 24, marginTop: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.87rem',
                    color: '#374151', margin: 0, lineHeight: 1.6,
                  }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            {/* Eventos relacionados */}
            {related.length > 0 && (
              <>
                <h2 style={{
                  fontFamily: 'Fraunces, serif', fontSize: '1.1rem',
                  color: '#0D1B3E', marginBottom: 16,
                }}>
                  Eventos relacionados
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {related.map(r => (
                    <Link
                      key={r.id}
                      href={`/eventos/${r.id}`}
                      style={{
                        display: 'flex', gap: 14, alignItems: 'center',
                        background: '#F4F7FF', borderRadius: 12, padding: '14px 16px',
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{ position: 'relative', width: 64, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={r.imageUrl} alt={r.title} fill unoptimized style={{ objectFit: 'cover' }} sizes="64px" />
                      </div>
                      <div>
                        <p style={{
                          fontFamily: 'Fraunces, serif', fontSize: '0.9rem',
                          color: '#0D1B3E', margin: '0 0 3px',
                        }}>
                          {r.title}
                        </p>
                        <p style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem',
                          color: '#5A6A80', margin: 0,
                        }}>
                          {r.flag} {r.location} · {r.date}
                        </p>
                      </div>
                      <span style={{ marginLeft: 'auto', color: '#1A56DB', fontSize: '1rem' }}>›</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Coluna direita: widgets ──────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>

            {/* Badge de preço de voo */}
            <div style={{
              background: '#EEF4FF', borderRadius: 10,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>✈️</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
                color: '#1A56DB', fontWeight: 600,
              }}>
                {event.flightFrom}
              </span>
            </div>

            {/* Widget de voo */}
            <FlightSearchInline
              destinationIata={event.destinationIata}
              destinationLabel={event.location}
              suggestedDate={event.suggestedCheckIn}
            />

            {/* Widget de hotel */}
            <HotelSearchInline
              city={event.hotelCity}
              suggestedCheckIn={event.suggestedCheckIn}
              suggestedCheckOut={event.suggestedCheckOut}
            />

            {/* CTA roteiro completo */}
            <Link
              href={`/roteiro?experiencia=${encodeURIComponent(event.title)}`}
              style={{
                display: 'block', textAlign: 'center',
                background: 'transparent',
                border: '2px solid #1A56DB',
                color: '#1A56DB',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700, fontSize: '0.88rem',
                padding: '12px', borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Montar roteiro completo com IA →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const { EVENTS } = await import('@/lib/events-data')
  return EVENTS.map(e => ({ slug: e.id }))
}
