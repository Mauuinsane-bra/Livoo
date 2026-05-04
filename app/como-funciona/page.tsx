import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Como Funciona — Go Livoo',
  description: 'Entenda como a Go Livoo funciona: descreva a experiência que quer ter e receba um pacote completo com voo, hotel, guia e documentação. Grátis para o viajante.',
}

export default function ComoFuncionaPage() {
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
          Plataforma gratuita
        </span>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Simples. Completo. Gratuito.
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.05rem',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 580,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Você descreve a experiência que quer ter. A Go Livoo encontra voo, hotel, guia e verifica sua documentação — tudo em uma plataforma, sem custo para você.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {/* Passos */}
        <h2 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '1.6rem',
          color: '#0F2340',
          textAlign: 'center',
          marginBottom: 48,
        }}>
          Como funciona, passo a passo
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 60 }}>
          {[
            {
              step: '01',
              title: 'Você descreve a experiência',
              desc: 'No campo "Roteiro Completo", descreva o que quer fazer: ver um jogo, ir a um festival, assistir a uma corrida. Pode ser vago — nossa IA entende o contexto e faz as perguntas certas.',
              detail: 'Exemplos: "Quero ir ao GP de F1 em Mônaco em maio", "Rock in Rio 2026 com voo saindo de São Paulo", "Hanami no Japão em março".',
              color: '#1A82D8',
              link: null,
            },
            {
              step: '02',
              title: 'A IA monta o roteiro completo',
              desc: 'Nossa inteligência artificial analisa seu pedido, encontra as melhores datas, combina opções de voo e hotel e gera um roteiro detalhado com estimativas de custo.',
              detail: 'O roteiro inclui dia a dia, dicas de cada cidade, opções de transporte local e lista de documentos necessários.',
              color: '#7c3aed',
              link: '/roteiro',
            },
            {
              step: '03',
              title: 'Verifique sua documentação',
              desc: 'Antes de comprar qualquer coisa, o Livoo Prep verifica se seu passaporte, visto e vacinas estão em ordem para o destino escolhido. Evite surpresas desagradáveis na fronteira.',
              detail: 'O Livoo Prep cobre mais de 60 países com informações atualizadas via API Sherpa. Disponível por R$39/viagem.',
              color: '#F5A800',
              link: '/prep',
            },
            {
              step: '04',
              title: 'Reserve com os melhores parceiros',
              desc: 'A plataforma conecta você diretamente com parceiros confiáveis de voos, hotéis e experiências. Você reserva com segurança em plataformas reconhecidas globalmente.',
              detail: 'A Go Livoo recebe uma comissão dos parceiros quando você reserva. Para você, o preço é o mesmo — ou melhor, pois negociamos tarifas especiais.',
              color: '#16a34a',
              link: null,
            },
          ].map((item, i) => (
            <div key={item.step} style={{
              display: 'flex',
              gap: 28,
              background: '#fff',
              borderRadius: 20,
              padding: '32px 36px',
              boxShadow: '0 2px 12px rgba(13,27,62,0.06)',
              border: '1px solid #E2E8F0',
              alignItems: 'flex-start',
            }}>
              <div style={{
                flexShrink: 0,
                width: 56, height: 56,
                borderRadius: '50%',
                background: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#fff',
              }}>
                {item.step}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '1.2rem',
                  color: '#0F2340',
                  marginBottom: 10,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.92rem',
                  color: '#64748B',
                  lineHeight: 1.7,
                  marginBottom: 10,
                }}>
                  {item.desc}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.82rem',
                  color: '#8A9AB0',
                  lineHeight: 1.65,
                  margin: 0,
                  fontStyle: 'italic',
                }}>
                  {item.detail}
                </p>
                {item.link && (
                  <Link
                    href={item.link}
                    style={{
                      display: 'inline-block',
                      marginTop: 14,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.83rem',
                      fontWeight: 700,
                      color: item.color,
                      textDecoration: 'none',
                    }}
                  >
                    Experimentar agora →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modelo de negócio — transparência */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 44px',
          border: '1px solid #E2E8F0',
          marginBottom: 40,
        }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.4rem',
            color: '#0F2340',
            marginBottom: 20,
          }}>
            Como a Go Livoo ganha dinheiro?
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.92rem',
            color: '#64748B',
            lineHeight: 1.75,
            marginBottom: 24,
          }}>
            A plataforma é 100% gratuita para o viajante. Quando você reserva um voo, hotel ou experiência
            pelos links da Go Livoo, recebemos uma comissão dos parceiros — sem custo adicional para você.
            É o mesmo modelo que comparadores como Skyscanner e Kayak usam.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { label: 'Voos', value: 'Parceiros de voos', comissao: 'Comissão por reserva' },
              { label: 'Hotéis', value: 'Parceiros de hotéis', comissao: 'Comissão sobre margem' },
              { label: 'Experiências', value: 'Parceiros de experiências', comissao: 'Comissão por reserva' },
              { label: 'Documentação', value: 'Livoo Prep', comissao: 'R$39 por consulta' },
            ].map(item => (
              <div key={item.label} style={{
                background: '#fafaf7',
                borderRadius: 12,
                padding: '16px 18px',
                border: '1px solid #E8EFF8',
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0F2340',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 4px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  color: '#64748B',
                  margin: '0 0 6px',
                }}>
                  {item.value}
                </p>
                <p style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.88rem',
                  color: '#1A82D8',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  {item.comissao}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 44px',
          border: '1px solid #E2E8F0',
          marginBottom: 40,
        }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.4rem',
            color: '#0F2340',
            marginBottom: 28,
          }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              {
                q: 'Preciso criar uma conta para usar a plataforma?',
                a: 'Não. Você pode pesquisar voos, hotéis e gerar roteiros sem criar conta. A conta é necessária apenas para salvar roteiros, ativar alertas de preço e acessar histórico de consultas.',
              },
              {
                q: 'A Go Livoo vende passagens diretamente?',
                a: 'Não. Somos uma plataforma de busca e planejamento. Conectamos você às melhores opções nos parceiros certificados (Booking.com, Travelpayouts, GetYourGuide). A reserva é feita diretamente no parceiro.',
              },
              {
                q: 'O que é o Livoo Prep?',
                a: 'É nosso produto de verificação de documentação (R$39/viagem). Ele verifica se seu passaporte, visto e vacinas estão em ordem para o destino escolhido, usando a API Sherpa — a mesma usada por companhias aéreas.',
              },
              {
                q: 'Os preços mostrados são garantidos?',
                a: 'Os preços são estimativas baseadas em pesquisas recentes, sempre sinalizados como "Preço estimado". O preço final é definido pelo parceiro no momento da reserva, podendo variar conforme disponibilidade.',
              },
              {
                q: 'Posso usar a Go Livoo para qualquer destino?',
                a: 'Sim. A plataforma funciona para destinos nacionais e internacionais. O foco é em viagens motivadas por experiências específicas (eventos esportivos, festivais, shows), mas funciona para qualquer tipo de viagem.',
              },
            ].map((item, i) => (
              <div key={i} style={{
                paddingBottom: i < 4 ? 24 : 0,
                borderBottom: i < 4 ? '1px solid #fafaf7' : 'none',
              }}>
                <h3 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0F2340',
                  marginBottom: 8,
                }}>
                  {item.q}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.88rem',
                  color: '#64748B',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)',
          borderRadius: 20,
          padding: '48px 52px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1.6rem',
            color: '#fff',
            marginBottom: 12,
          }}>
            Pronto para começar?
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 480,
            margin: '0 auto 32px',
            lineHeight: 1.75,
          }}>
            Descreva a experiência que você quer ter e receba um roteiro completo em segundos.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-gold">
              Montar meu roteiro agora
            </Link>
            <Link href="/eventos" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Ver eventos disponíveis
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
