import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { EVENTS, type EventData } from '@/lib/events-data'

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
  priceFrom:      string
  priceNote:      string
  duration:       string
  includes:       string[]
  highlights:     string[]
  events:         EventData[]
  imageUrl:       string
  flag:           string
  badge?:         string
  badgeColor?:    string
}

function buildPackages(): Package[] {
  const futEvents   = EVENTS.filter(e => e.category === 'futebol')
  const autoEvents  = EVENTS.filter(e => e.category === 'automobilismo')
  const showEvents  = EVENTS.filter(e => e.category === 'shows')
  const cultEvents  = EVENTS.filter(e => e.category === 'cultura')

  return [
    {
      id:            'futebol-brasileiro',
      title:         'Futebol Brasileiro',
      subtitle:      'Sinta a paixão do futebol nos maiores estádios do país',
      description:   'Pacote completo para assistir ao Brasileirão nos estádios mais icônicos do Brasil: Maracanã, Neo Química Arena e Ligga Arena. Inclui voo, hotel próximo ao estádio, ingresso e guia de dicas locais.',
      category:      'Esportes',
      categoryColor: '#16a34a',
      priceFrom:     'R$ 890',
      priceNote:     'por pessoa · voo + hotel + ingresso',
      duration:      '3 dias / 2 noites',
      includes:      ['Voo ida e volta', 'Hotel 3★ próximo ao estádio', 'Ingresso para o jogo', 'Transfer estádio (opcional)', 'Guia de dicas locais', 'Verificação de documentos'],
      highlights:    ['Estádios modernos e acessíveis', 'Vários jogos por semana no Brasileirão', 'Custo acessível comparado a futebol europeu'],
      events:        futEvents.filter(e => ['athletico-pr', 'flamengo', 'corinthians'].includes(e.id)),
      imageUrl:      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
      flag:          '🇧🇷',
      badge:         'Mais vendido',
      badgeColor:    '#16a34a',
    },
    {
      id:            'formula-1',
      title:         'Fórmula 1',
      subtitle:      'Os circuitos mais emocionantes do mundo',
      description:   'Viva a F1 de perto. Pacotes para o GP de Mônaco — o mais glamouroso — e o GP do Brasil em Interlagos — o mais emocionante. Voo, hotel, ingresso e acesso ao paddock quando disponível.',
      category:      'Automobilismo',
      categoryColor: '#7c3aed',
      priceFrom:     'R$ 1.800',
      priceNote:     'por pessoa · a partir de (GP Brasil)',
      duration:      '4 dias / 3 noites',
      includes:      ['Voo ida e volta', 'Hotel 3-4★ na região do circuito', 'Ingresso para o fim de semana', 'Transfer circuito', 'Guia do evento com horários e dicas', 'Verificação de documentos e visto'],
      highlights:    ['GP Mônaco: o mais icônico do mundo', 'GP Brasil: eleito pelos pilotos como favorito', 'Acesso aos boxes em pacotes premium'],
      events:        autoEvents.filter(e => ['f1-monaco', 'f1-brasil'].includes(e.id)),
      imageUrl:      'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=800',
      flag:          '🏎️',
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
      priceFrom:     'R$ 1.200',
      priceNote:     'por pessoa · voo + hotel + ingresso',
      duration:      '4 dias / 3 noites',
      includes:      ['Voo ida e volta', 'Hotel próximo ao transporte', 'Ingresso para o festival', 'Guia de dicas do festival', 'Opção de ingresso VIP', 'Verificação de documentos'],
      highlights:    ['Artistas internacionais de primeira linha', 'Múltiplos dias e palcos', 'Experiência completa além da música'],
      events:        showEvents,
      imageUrl:      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      flag:          '🎸',
      badge:         'Em alta',
      badgeColor:    '#F5A623',
    },
    {
      id:            'cultura-internacional',
      title:         'Cultura & Experiências',
      subtitle:      'Viagens que transformam',
      description:   'Do Carnaval do Rio ao Hanami no Japão. Experiências culturais únicas com guia local, roteiro planejado e toda a documentação verificada antes de você comprar.',
      category:      'Cultura',
      categoryColor: '#0891b2',
      priceFrom:     'R$ 980',
      priceNote:     'por pessoa · Carnaval Rio (a partir de)',
      duration:      '5-10 dias',
      includes:      ['Voo ida e volta', 'Hotel bem localizado', 'Roteiro cultural planejado', 'Guia local especializado', 'Ingressos/reservas', 'Verificação de visto e documentos'],
      highlights:    ['Carnaval do Rio: o maior espetáculo da Terra', 'Hanami no Japão: cerejeiras em flor', 'Rally da Geórgia: aventura no Cáucaso'],
      events:        [...cultEvents, ...autoEvents.filter(e => e.id === 'rally-georgia')],
      imageUrl:      'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800',
      flag:          '🌍',
    },
  ]
}

// ── Componentes ───────────────────────────────────────────

function PackageHero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
      padding: '72px 24px 80px',
      textAlign: 'center',
    }}>
      <span style={{
        display: 'inline-block',
        background: 'rgba(245,166,35,0.15)',
        color: '#F5A623',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        padding: '5px 14px',
        borderRadius: 50,
        marginBottom: 20,
        border: '1px solid rgba(245,166,35,0.3)',
      }}>
        Pacotes completos
      </span>
      <h1 style={{
        fontFamily: 'Fraunces, serif',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 1.2,
      }}>
        Voo + hotel + ingresso + guia
      </h1>
      <p style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
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
      border: '1px solid #D0DCF0',
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.72rem', fontWeight: 700,
            color: '#fff',
            background: pkg.badgeColor || '#1A56DB',
            padding: '4px 12px', borderRadius: 50,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            {pkg.badge}
          </span>
        )}

        {/* Categoria + Flag */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 28,
        }}>
          {pkg.flag}
        </div>

        {/* Título sobre imagem */}
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
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
            fontFamily: 'Fraunces, serif',
            fontSize: '1.5rem', color: '#fff',
            margin: '8px 0 0',
          }}>
            {pkg.title}
          </h2>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
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
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.88rem', color: '#5A6A80',
          lineHeight: 1.65, marginBottom: 20,
        }}>
          {pkg.description}
        </p>

        {/* Preço + duração */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginBottom: 20,
          padding: '16px 20px', background: '#F4F7FF',
          borderRadius: 12,
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: '1.6rem',
              fontWeight: 700, color: '#0D1B3E', margin: 0,
            }}>
              {pkg.priceFrom}
            </p>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.75rem', color: '#5A6A80', margin: '2px 0 0',
            }}>
              {pkg.priceNote}
            </p>
          </div>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.82rem', fontWeight: 600,
            color: '#1A56DB',
            background: 'rgba(26,86,219,0.08)',
            padding: '6px 14px', borderRadius: 50,
          }}>
            {pkg.duration}
          </span>
        </div>

        {/* O que inclui */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#0D1B3E', textTransform: 'uppercase',
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
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.82rem', color: '#5A6A80',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
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
            <span key={i} style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.78rem', color: '#D48A0A',
              display: 'block',
              marginBottom: i < pkg.highlights.length - 1 ? 4 : 0,
            }}>
              ★ {h}
            </span>
          ))}
        </div>

        {/* Eventos disponíveis */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.75rem', fontWeight: 700,
            color: '#0D1B3E', textTransform: 'uppercase',
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
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#0D1B3E', margin: 0,
                  }}>
                    {ev.title}
                  </p>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.75rem', color: '#5A6A80',
                    margin: '2px 0 0',
                  }}>
                    {ev.date} · {ev.location}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: ev.tagColor, background: ev.tagColor + '15',
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {ev.tag}
                </span>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.78rem', color: '#1A56DB',
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
    <div style={{ background: '#F4F7FF', minHeight: '100vh' }}>
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
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.82rem', fontWeight: 600,
              color: '#0D1B3E',
              background: '#fff',
              padding: '8px 18px', borderRadius: 50,
              border: '1px solid #D0DCF0',
              cursor: 'default',
            }}>
              {filter.label} ({filter.count})
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
          background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '52px 40px',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(245,166,35,0.15)',
            color: '#F5A623',
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
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: '#fff',
            marginBottom: 12,
          }}>
            Não encontrou o pacote ideal?
          </h3>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
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
          border: '1px solid #D0DCF0',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>ℹ️</span>
          <div>
            <h4 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.88rem', fontWeight: 700,
              color: '#0D1B3E', margin: '0 0 6px',
            }}>
              Como funcionam os pacotes?
            </h4>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.83rem', color: '#5A6A80',
              margin: 0, lineHeight: 1.65,
            }}>
              Os preços exibidos são estimativas baseadas em pesquisas recentes e podem variar conforme a data e disponibilidade. Ao clicar em "Montar este pacote", a Go Livoo busca em tempo real os melhores preços de voo, hotel e ingresso para a data escolhida. A plataforma é gratuita — a Go Livoo recebe uma comissão dos parceiros quando você reserva, sem custo adicional para você.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
