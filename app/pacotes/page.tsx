import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { EVENTS, type EventData } from '@/lib/events-data'
import PackagePriceRow from '@/components/PackagePriceRow'

export const metadata: Metadata = {
  title: 'Pacotes de Viagem — Go Livoo',
  description: 'Pacotes completos de viagem com voo, hotel, guia e documentação para eventos esportivos, festivais e experiências culturais.',
}

// ── Dados dos pacotes ─────────────────────────────────────

interface Package {
  id:             string
  title:          string
  subtitle:       string
  description:    string
  category:       string
  categoryColor:  string
  priceNote:      string
  duration:       string
  includes:       string[]
  highlights:     string[]
  events:         EventData[]
  eventIatas:     string[]
  imageUrl:       string
  badge?:         string
  badgeColor?:    string
}

function getUniqueIatas(events: EventData[]): string[] {
  return [...new Set(events.map(e => e.destinationIata).filter(Boolean))]
}

function buildPackages(): Package[] {
  const futEvents   = EVENTS.filter(e => e.category === 'futebol')
  const autoEvents  = EVENTS.filter(e => e.category === 'automobilismo')
  const showEvents  = EVENTS.filter(e => e.category === 'shows')
  const cultEvents  = EVENTS.filter(e => e.category === 'cultura')

  const futSelected = futEvents.filter(e => ['athletico-pr', 'flamengo', 'corinthians'].includes(e.id))
  const autoSelected = autoEvents.filter(e => ['f1-monaco', 'f1-brasil'].includes(e.id))
  const cultSelected = [...cultEvents, ...autoEvents.filter(e => e.id === 'rally-georgia')]

  return [
    {
      id:            'futebol-brasileiro',
      title:         'Futebol Brasileiro',
      subtitle:      'Sinta a paixão do futebol nos maiores estádios do país',
      description:   'Pacote completo para assistir ao Brasileirão nos estádios mais icônicos do Brasil: Maracanã, Neo Química Arena e Ligga Arena. Inclui voo, hotel próximo ao estádio, ingresso e guia de dicas locais.',
      category:      'Esportes',
      categoryColor: '#16a34a',
      priceNote:     'Voo + hotel + ingresso · valor calculado em tempo real',
      duration:      '3 dias / 2 noites',
      includes:      ['Voo ida e volta', 'Hotel próximo ao estádio', 'Ingresso para o jogo', 'Transfer estádio (opcional)', 'Guia de dicas locais', 'Verificação de documentos'],
      highlights:    ['Estádios modernos e acessíveis', 'Vários jogos por semana no Brasileirão', 'Custo acessível comparado a futebol europeu'],
      events:        futSelected,
      eventIatas:    getUniqueIatas(futSelected),
      imageUrl:      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
      badge:         'Em destaque',
      badgeColor:    '#16a34a',
    },
    {
      id:            'formula-1',
      title:         'Fórmula 1',
      subtitle:      'Os circuitos mais emocionantes do mundo',
      description:   'Viva a F1 de perto. Pacotes para o GP de Mônaco — o mais glamouroso — e o GP do Brasil em Interlagos — o mais emocionante. Voo, hotel, ingresso e acesso ao paddock quando disponível.',
      category:      'Automobilismo',
      categoryColor: '#7c3aed',
      priceNote:     'Voo + hotel + ingresso · valor calculado em tempo real',
      duration:      '4 dias / 3 noites',
      includes:      ['Voo ida e volta', 'Hotel na região do circuito', 'Ingresso para o fim de semana', 'Transfer circuito', 'Guia do evento com horários e dicas', 'Verificação de documentos e visto'],
      highlights:    ['GP Mônaco: o mais icônico do mundo', 'GP Brasil: eleito pelos pilotos como favorito'],
      events:        autoSelected,
      eventIatas:    getUniqueIatas(autoSelected),
      imageUrl:      'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=800',
      badge:         'Premium',
      badgeColor:    '#7c3aed',
    },
    {
      id:            'festivais-musica',
      title:         'Festivais de Música',
      subtitle:      'Os maiores palcos do Brasil',
      description:   'Lollapalooza e Rock in Rio — os dois maiores festivais de música do Brasil com artistas internacionais, múltiplos palcos e experiências gastronômicas. Pacote com voo, hotel e ingresso.',
      category:      'Shows',
      categoryColor: '#db2777',
      priceNote:     'Voo + hotel + ingresso · valor calculado em tempo real',
      duration:      '4 dias / 3 noites',
      includes:      ['Voo ida e volta', 'Hotel próximo ao transporte', 'Ingresso para o festival', 'Guia de dicas do festival', 'Opção de ingresso VIP', 'Verificação de documentos'],
      highlights:    ['Artistas internacionais de primeira linha', 'Múltiplos dias e palcos', 'Experiência completa além da música'],
      events:        showEvents,
      eventIatas:    getUniqueIatas(showEvents),
      imageUrl:      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      badge:         'Em alta',
      badgeColor:    '#F5A800',
    },
    {
      id:            'cultura-internacional',
      title:         'Cultura & Experiências',
      subtitle:      'Viagens que transformam',
      description:   'Do Carnaval do Rio ao Hanami no Japão. Experiências culturais únicas com guia local, roteiro planejado e toda a documentação verificada antes de você comprar.',
      category:      'Cultura',
      categoryColor: '#0891b2',
      priceNote:     'Voo + hotel + experiências · valor calculado em tempo real',
      duration:      '5-10 dias',
      includes:      ['Voo ida e volta', 'Hotel bem localizado', 'Roteiro cultural planejado', 'Guia local especializado', 'Ingressos/reservas', 'Verificação de visto e documentos'],
      highlights:    ['Carnaval do Rio: o maior espetáculo da Terra', 'Hanami no Japão: cerejeiras em flor', 'Rally da Geórgia: aventura no Cáucaso'],
      events:        cultSelected,
      eventIatas:    getUniqueIatas(cultSelected),
      imageUrl:      'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800',
    },
  ]
}

// ── Componentes ───────────────────────────────────────────

function PackageHero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
      padding: '72px 24px 80px',
      textAlign: 'center',
    }}>
      <span style={{
        display: 'inline-block',
        background: 'rgba(245,168,0,0.15)',
        color: '#F5A800',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        padding: '5px 14px',
        borderRadius: 50,
        marginBottom: 20,
        border: '1px solid rgba(245,168,0,0.3)',
      }}>
        Pacotes completos
      </span>
      <h1 style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 1.2,
      }}>
        Voo + hotel + ingresso + guia
      </h1>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.65)',
        maxWidth: 600,
        margin: '0 auto',
        lineHeight: 1.7,
      }}>
        Pacotes montados pela Go Livoo para os melhores eventos do mundo.
        Escolha a experiência — a gente cuida do resto.
      </p>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(13,27,62,0.08)',
      border: '1px solid #E2E8F0',
    }}>
      {/* Header com imagem */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(13,27,62,0.85) 100%)',
        }} />

        {/* Badge */}
        {pkg.badge && (
          <span style={{
            position: 'absolute', top: 16, left: 16,
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem', fontWeight: 700,
            color: '#fff',
            background: pkg.badgeColor || '#1A82D8',
            padding: '4px 12px', borderRadius: 50,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            {pkg.badge}
          </span>
        )}

        {/* Título sobre imagem */}
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.7rem', fontWeight: 700,
            color: pkg.categoryColor,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            padding: '3px 10px', borderRadius: 50,
          }}>
            {pkg.category}
          </span>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.5rem', color: '#fff',
            margin: '8px 0 0',
          }}>
            {pkg.title}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)',
            margin: '4px 0 0',
          }}>
            {pkg.subtitle}
          </p>
        </div>
      </div>

      {/* Corpo */}
      <div style={{ padding: '24px 28px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.88rem', color: '#64748B',
          lineHeight: 1.65, marginBottom: 20,
        }}>
          {pkg.description}
        </p>

        {/* Duração + nota de preço */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20, gap: 12,
          padding: '14px 20px', background: '#fafaf7',
          borderRadius: 12,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.5,
            }}>
              {pkg.priceNote}
            </p>
            <PackagePriceRow iatas={pkg.eventIatas} />
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.82rem', fontWeight: 600,
            color: '#1A82D8',
            background: 'rgba(26,130,216,0.08)',
            padding: '6px 14px', borderRadius: 50,
            whiteSpace: 'nowrap',
          }}>
            {pkg.duration}
          </span>
        </div>

        {/* O que inclui */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#0F2340', textTransform: 'uppercase',
            letterSpacing: '1.2px', marginBottom: 10,
          }}>
            O que inclui
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '6px 16px',
          }}>
            {pkg.includes.map(item => (
              <span key={item} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem', color: '#64748B',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Destaques */}
        <div style={{
          background: '#FFF8EC', borderRadius: 10,
          padding: '12px 16px', marginBottom: 20,
        }}>
          {pkg.highlights.map((h, i) => (
            <div key={i} style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem', color: '#D48A0A',
              display: 'flex', alignItems: 'flex-start', gap: 8,
              marginBottom: i < pkg.highlights.length - 1 ? 6 : 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#D48A0A" stroke="#D48A0A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Eventos disponíveis */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#0F2340', textTransform: 'uppercase',
            letterSpacing: '1.2px', marginBottom: 10,
          }}>
            Eventos disponíveis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pkg.events.map(ev => (
              <Link
                key={ev.id}
                href={`/eventos/${ev.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: '#F8FAFF', border: '1px solid #E8EFF8',
                  textDecoration: 'none', transition: 'border-color 0.15s',
                }}
              >
                <span style={{ fontSize: 16 }}>{ev.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#0F2340', margin: 0,
                  }}>
                    {ev.title}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem', color: '#64748B',
                    margin: '2px 0 0',
                  }}>
                    {ev.date} · {ev.location}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: ev.tagColor, background: ev.tagColor + '15',
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {ev.tag}
                </span>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem', color: '#1A82D8',
                  fontWeight: 600,
                }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href={`/roteiro?q=${encodeURIComponent(pkg.title + ' - pacote completo com voo hotel e ingresso')}`}
            className="btn-primary"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.88rem', padding: '12px 20px' }}
          >
            Montar este pacote
          </Link>
          <Link
            href="/prep"
            className="btn-outline"
            style={{ fontSize: '0.88rem', padding: '12px 20px' }}
          >
            Verificar docs
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────

export default function PacotesPage() {
  const packages = buildPackages()

  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>
      <PackageHero />

      {/* Filtros rápidos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 10, flexWrap: 'wrap', marginBottom: 40,
        }}>
          {[
            { label: 'Todos', count: packages.length },
            { label: 'Esportes', count: packages.filter(p => p.category === 'Esportes' || p.category === 'Automobilismo').length },
            { label: 'Shows', count: packages.filter(p => p.category === 'Shows').length },
            { label: 'Cultura', count: packages.filter(p => p.category === 'Cultura').length },
          ].map(filter => (
            <span key={filter.label} style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem', fontWeight: 600,
              color: '#64748B',
              background: '#F8FAFC',
              padding: '8px 18px', borderRadius: 50,
              border: '1px solid #E2E8F0',
            }}>
              {filter.label} · {filter.count}
            </span>
          ))}
        </div>
      </div>

      {/* Grid de pacotes */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
          gap: 28,
        }}>
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Seção "Monte o seu" */}
        <div style={{
          marginTop: 60,
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '52px 40px',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(245,168,0,0.15)',
            color: '#F5A800',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: 50,
            marginBottom: 16,
          }}>
            Personalizado
          </span>
          <h3 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: '#fff',
            marginBottom: 12,
          }}>
            Não encontrou o pacote ideal?
          </h3>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 520,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            Descreva a experiência que quer ter — um evento, um festival, uma aventura — e a Go Livoo monta um pacote sob medida com voo, hotel, guia e documentação.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-gold">
              Montar meu roteiro personalizado
            </Link>
            <Link href="/eventos" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Explorar eventos
            </Link>
          </div>
        </div>

        {/* Info de transparência */}
        <div style={{
          marginTop: 32,
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem', fontWeight: 700,
              color: '#0F2340', margin: '0 0 6px',
            }}>
              Como funcionam os pacotes?
            </h4>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.83rem', color: '#64748B',
              margin: 0, lineHeight: 1.65,
            }}>
              Os pacotes da Go Livoo são montados sob demanda — ao clicar em “Montar este pacote”, buscamos em tempo real os melhores preços de voo, hotel e ingresso para a data escolhida. A plataforma é gratuita: a Go Livoo recebe uma comissão dos parceiros quando você reserva, sem custo adicional para você.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
