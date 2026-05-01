import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre a Go Livoo — Quem Somos',
  description: 'Conheça a Go Livoo: a plataforma de soluções para viajantes que busca experiências únicas. Voo + hotel + guia + documentação — tudo em um só lugar.',
}

export default function SobrePage() {
  return (
    <div style={{ background: '#fafaf7', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #1A82D8 100%)',
        padding: '80px 24px 88px',
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
          Quem somos
        </span>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          A Go Livoo nasceu para quem<br />
          quer a experiência, não a logística.
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.05rem',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Não somos uma agência de viagens tradicional.<br />
          Somos uma plataforma de soluções para quem viaja com propósito.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {/* Manifesto */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '48px 52px',
          boxShadow: '0 4px 24px rgba(13,27,62,0.07)',
          border: '1px solid #E2E8F0',
          marginBottom: 40,
        }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.8rem',
            color: '#0F2340',
            marginBottom: 24,
          }}>
            A origem da ideia
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#64748B',
            lineHeight: 1.8,
            marginBottom: 20,
          }}>
            Você já quis ir a um evento específico — uma corrida de Fórmula 1, um festival de música,
            um campeonato internacional — mas desistiu porque a logística era complexa demais? Voo, hotel,
            ingresso, documentação, visto… cada peça em um lugar diferente, em sites diferentes,
            com riscos de incompatibilidade.
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#64748B',
            lineHeight: 1.8,
            marginBottom: 20,
          }}>
            A Go Livoo nasceu para resolver exatamente isso. O cliente chega com a experiência em mente —
            <em> "quero assistir ao GP de Mônaco"</em>, <em>"quero ver o Metallica em Buenos Aires"</em>,
            <em>"quero ir ao Carnaval do Rio"</em> — e a plataforma monta tudo: voo, hospedagem, guia local,
            ingressos e verificação de documentação.
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#64748B',
            lineHeight: 1.8,
          }}>
            Você quer a experiência. A Go Livoo resolve o resto.
          </p>
        </div>

        {/* Valores em grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 40,
        }}>
          {[
            {
              num: '01',
              title: 'Experiência primeiro',
              text: 'Começamos pela experiência que você quer ter, não pelo destino. Isso muda tudo sobre como planejamos a viagem.',
            },
            {
              num: '02',
              title: 'Transparência total',
              text: 'Preços estimados sempre sinalizados. Sem taxas escondidas. A plataforma é gratuita — ganhamos comissão dos parceiros, não de você.',
            },
            {
              num: '03',
              title: 'Documentação sem surpresa',
              text: 'Com o Livoo Prep, você verifica visto, passaporte e vacinas antes de reservar qualquer coisa. Chega de viagem cancelada por burocracia.',
            },
            {
              num: '04',
              title: 'Vá mais longe por menos',
              text: 'Combinamos parceiros afiliados para entregar a melhor relação custo-experiência. Não vendemos luxo. Vendemos acesso inteligente.',
            },
          ].map(item => (
            <div key={item.num} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '32px 28px',
              boxShadow: '0 2px 12px rgba(13,27,62,0.06)',
              border: '1px solid #E2E8F0',
            }}>
              <span style={{
                display: 'inline-block',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#F5A800',
                marginBottom: 16,
              }}>
                {item.num}
              </span>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.15rem',
                color: '#0F2340',
                marginBottom: 10,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                color: '#64748B',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Como funciona resumo */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '48px 52px',
          marginBottom: 40,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.6rem',
            color: '#fff',
            marginBottom: 12,
          }}>
            Nosso modelo é diferente
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 560,
            margin: '0 auto 32px',
            lineHeight: 1.75,
          }}>
            A plataforma é gratuita para consulta de roteiros e eventos. O Livoo Prep (R$ 39/viagem) é opcional. A Go Livoo ganha uma comissão dos parceiros
            (companhias aéreas, hotéis, experiências) quando você reserva — sem nenhum custo adicional.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/como-funciona" className="btn-gold">
              Como funciona em detalhes
            </Link>
            <Link href="/" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Experimentar agora
            </Link>
          </div>
        </div>

        {/* Parceiros */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '36px 40px',
          border: '1px solid #E2E8F0',
        }}>
          <h3 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0F2340',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 20,
            textAlign: 'center',
          }}>
            Parceiros tecnológicos
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            justifyContent: 'center',
          }}>
            {[
              'Travelpayouts (voos e hotéis)',
              'Kiwi.com (passagens internacionais)',
              'Rentcars (aluguel de carros)',
              'Stripe (pagamentos seguros)',
              'Clerk (autenticação)',
              'Supabase (banco de dados)',
              'Vercel (infraestrutura)',
            ].map(p => (
              <span key={p} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                color: '#64748B',
                background: '#fafaf7',
                padding: '6px 14px',
                borderRadius: 50,
                border: '1px solid #E2E8F0',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
