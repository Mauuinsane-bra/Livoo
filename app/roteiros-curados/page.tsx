import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Roteiros Curados — Go Livoo',
  description: 'Roteiros prontos para os destinos mais procurados por brasileiros. Personalize com seu orçamento e datas por R$19,90.',
}

const CURATED = [
  {
    slug: 'lisboa',
    title: 'Lisboa',
    country: 'Portugal',
    flag: '🇵🇹',
    duration: '7 dias',
    budgetRange: 'R$ 5.000 – R$ 9.000',
    highlights: ['Alfama e Castelo de São Jorge', 'Day trip a Sintra e Cascais', 'Time Out Market e pastéis de Belém'],
    category: 'Cultura & Gastronomia',
    photo: 'https://images.unsplash.com/photo-1518241354-e57c7e99e5ce?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 7000,
    priorities: ['cultura', 'gastronomia'],
  },
  {
    slug: 'buenos-aires',
    title: 'Buenos Aires',
    country: 'Argentina',
    flag: '🇦🇷',
    duration: '5 dias',
    budgetRange: 'R$ 2.500 – R$ 5.000',
    highlights: ['Recoleta e La Boca', 'Jantar com tango em San Telmo', 'Puerto Madero e Palermo Soho'],
    category: 'Cultura & Nightlife',
    photo: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 3500,
    priorities: ['cultura', 'gastronomia'],
  },
  {
    slug: 'paris',
    title: 'Paris',
    country: 'França',
    flag: '🇫🇷',
    duration: '7 dias',
    budgetRange: 'R$ 10.000 – R$ 18.000',
    highlights: ['Torre Eiffel e Champs-Élysées', 'Museu do Louvre', 'Versalhes e bairro Le Marais'],
    category: 'Cultura & Luxo',
    photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 14000,
    priorities: ['conforto', 'cultura'],
  },
  {
    slug: 'cancun',
    title: 'Cancún',
    country: 'México',
    flag: '🇲🇽',
    duration: '7 dias',
    budgetRange: 'R$ 5.000 – R$ 10.000',
    highlights: ['Praias de água turquesa', 'Ruínas de Chichén Itzá', 'Cenotes e Playa del Carmen'],
    category: 'Praia & Aventura',
    photo: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 7500,
    priorities: ['aventura', 'conforto'],
  },
  {
    slug: 'nova-york',
    title: 'Nova York',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    duration: '7 dias',
    budgetRange: 'R$ 10.000 – R$ 20.000',
    highlights: ['Central Park e Times Square', 'Brooklyn Bridge e DUMBO', 'Met Museum e Broadway'],
    category: 'Metrópole & Cultura',
    photo: 'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 15000,
    priorities: ['cultura', 'conforto'],
  },
  {
    slug: 'amsterdam',
    title: 'Amsterdam',
    country: 'Holanda',
    flag: '🇳🇱',
    duration: '5 dias',
    budgetRange: 'R$ 8.000 – R$ 14.000',
    highlights: ['Canais e bairro de Jordaan', 'Museu Van Gogh e Rijksmuseum', 'Day trip a Zaanse Schans'],
    category: 'Cultura & História',
    photo: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 11000,
    priorities: ['cultura', 'aventura'],
  },
  {
    slug: 'tokyo',
    title: 'Tokyo',
    country: 'Japão',
    flag: '🇯🇵',
    duration: '10 dias',
    budgetRange: 'R$ 14.000 – R$ 22.000',
    highlights: ['Shibuya e Shinjuku', 'Templos de Kyoto e Nara', 'Gastronomia: ramen, sushi e izakayas'],
    category: 'Cultura & Gastronomia',
    photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 18000,
    priorities: ['cultura', 'gastronomia'],
  },
  {
    slug: 'dubai',
    title: 'Dubai',
    country: 'Emirados Árabes',
    flag: '🇦🇪',
    duration: '5 dias',
    budgetRange: 'R$ 9.000 – R$ 16.000',
    highlights: ['Burj Khalifa e Dubai Mall', 'Desert safari ao pôr do sol', 'Marina Walk e Palm Jumeirah'],
    category: 'Luxo & Aventura',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    checkIn: '',
    checkOut: '',
    budget: 12000,
    priorities: ['conforto', 'aventura'],
  },
]

const CATEGORIES = ['Todos', 'Cultura & Gastronomia', 'Praia & Aventura', 'Cultura & Luxo', 'Metrópole & Cultura', 'Luxo & Aventura']

export default function RoteirosCuradosPage() {
  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 100%)', padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(245,168,0,0.2)', color: '#F5A800', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 20, border: '1px solid rgba(245,168,0,0.3)' }}>
            Roteiros Curados
          </span>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
            Roteiros prontos para personalizar
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0 0 32px', lineHeight: 1.7, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Escolha o destino, adicione suas datas e orçamento. A Go Livoo gera o plano dia a dia completo por R$19,90.
          </p>

          {/* CTA personalizado */}
          <Link href="/roteiro" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#F5A800', color: '#0F2340', padding: '13px 24px',
            borderRadius: 999, fontFamily: 'Nunito, sans-serif', fontWeight: 700,
            fontSize: '0.95rem', textDecoration: 'none',
          }}>
            ✈️ Tenho um destino em mente — montar roteiro personalizado
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 0' }}>

        {/* Grid de roteiros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {CURATED.map(r => {
            // URL de personalização: vai para /roteiro com destino pré-preenchido
            const params = new URLSearchParams({
              destination: `${r.title}, ${r.country}`,
              budgetBRL: String(r.budget),
              priorities: r.priorities.join(','),
            })

            return (
              <div key={r.slug} style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Foto */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={r.photo}
                    alt={r.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15,35,64,0.6) 100%)' }} />
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.5px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {r.category}
                  </span>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, color: '#fff' }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.1 }}>
                      {r.flag} {r.title}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', opacity: 0.85 }}>{r.country}</div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {[r.duration, r.budgetRange].map(chip => (
                      <span key={chip} style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', padding: '4px 10px', borderRadius: 999, fontFamily: 'Inter, sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {chip}
                      </span>
                    ))}
                  </div>

                  <ul style={{ listStyle: 'none', margin: '0 0 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {r.highlights.map(h => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#374151', lineHeight: 1.4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A82D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/roteiro?${params.toString()}`}
                    style={{
                      display: 'block', textAlign: 'center',
                      background: '#0F2340', color: '#fff',
                      padding: '12px 16px', borderRadius: 12,
                      fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                      fontSize: '0.88rem', textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    Personalizar este roteiro — R$ 19,90
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA roteiro livre */}
        <div style={{
          marginTop: 48, background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          borderRadius: 20, padding: '36px 40px', textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', color: '#fff', fontSize: '1.5rem', margin: '0 0 10px', fontWeight: 700 }}>
            Tem outro destino em mente?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', margin: '0 0 24px' }}>
            A Go Livoo gera roteiro para qualquer destino do mundo.
          </p>
          <Link href="/roteiro" style={{
            display: 'inline-block', background: '#F5A800', color: '#0F2340',
            padding: '13px 28px', borderRadius: 999,
            fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
          }}>
            Criar roteiro personalizado →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .curated-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
