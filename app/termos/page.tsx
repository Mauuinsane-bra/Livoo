import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso — Go Livoo',
  description: 'Termos de uso da plataforma Go Livoo. Leia sobre as condições de uso, responsabilidades e direitos dos usuários.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '1.2rem',
        color: '#0F2340',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid #E6F3FF',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.92rem',
      color: '#64748B',
      lineHeight: 1.8,
      marginBottom: 14,
    }}>
      {children}
    </p>
  )
}

export default function TermosPage() {
  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #2B9FEE 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: '#fff',
          marginBottom: 12,
        }}>
          Termos de Uso
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.55)',
        }}>
          Última atualização: abril de 2026
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px 64px' }}>
        <div style={{
          background: '#fff8ec',
          borderRadius: 12,
          padding: '20px 24px',
          border: '1px solid rgba(245,166,35,0.3)',
          marginBottom: 40,
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
            color: '#8A6000',
            margin: 0,
            lineHeight: 1.65,
          }}>
            Ao utilizar a plataforma Go Livoo, você concorda com os termos abaixo. Leia com atenção antes de usar nossos serviços.
          </p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '48px 52px',
          boxShadow: '0 4px 24px rgba(13,27,62,0.07)',
          border: '1px solid #E2E8F0',
        }}>

          <Section title="1. Sobre a Go Livoo">
            <P>
              A Go Livoo é uma plataforma digital de planejamento de viagens operada por Go Livoo Tecnologia Ltda.
              A plataforma conecta viajantes a parceiros de voos, hotéis, experiências e verificação de documentação,
              com foco em viagens motivadas por eventos específicos.
            </P>
            <P>
              O site principal está disponível em <strong>www.golivoo.com.br</strong>. Para dúvidas, entre em contato pelo email{' '}
              <Link href="mailto:contato@golivoo.com.br" style={{ color: '#1A82D8' }}>contato@golivoo.com.br</Link>.
            </P>
          </Section>

          <Section title="2. Aceitação dos termos">
            <P>
              Ao acessar ou utilizar qualquer funcionalidade da plataforma — incluindo busca de voos, hotéis, geração de roteiros
              e compra do Livoo Prep — você declara ter lido, compreendido e aceito estes Termos de Uso na íntegra.
            </P>
            <P>
              Se você não concorda com qualquer parte destes termos, não utilize a plataforma. Estes termos podem ser atualizados
              periodicamente; a versão mais recente sempre estará disponível nesta página.
            </P>
          </Section>

          <Section title="3. Natureza da plataforma">
            <P>
              A Go Livoo é uma plataforma de intermediação e planejamento. <strong>Não somos uma agência de viagens,
              não vendemos passagens e não realizamos reservas de hotéis diretamente.</strong> Atuamos como plataforma
              que conecta o usuário a parceiros comerciais confiáveis.
            </P>
            <P>
              As reservas de voos, hotéis e experiências são realizadas diretamente com os parceiros de cada serviço. A Go Livoo não é parte contratante dessas reservas.
            </P>
          </Section>

          <Section title="4. Preços e informações de disponibilidade">
            <P>
              Os preços exibidos na plataforma são estimativas baseadas em consultas recentes a APIs de parceiros
              e são sempre sinalizados como "Preço estimado". Esses valores podem variar conforme data, disponibilidade
              e política de preços dinâmicos de cada parceiro.
            </P>
            <P>
              A Go Livoo não garante a disponibilidade de qualquer voo, hotel, ingresso ou experiência exibidos
              na plataforma. A disponibilidade é determinada exclusivamente pelos parceiros.
            </P>
          </Section>

          <Section title="5. Livoo Prep — Serviço pago">
            <P>
              O Livoo Prep é um serviço de verificação de documentação de viagem disponível por R$39 por consulta,
              pago via Stripe. Ao contratar o Livoo Prep, você recebe um relatório com informações sobre visto,
              passaporte e vacinas para o destino informado, com base nos dados da API Sherpa.
            </P>
            <P>
              <strong>As informações do Livoo Prep são de caráter informativo e não constituem consultoria jurídica
              ou consular.</strong> A Go Livoo não se responsabiliza por recusas de visto, entrada negada em território
              estrangeiro ou outros problemas decorrentes de documentação insuficiente. O usuário deve sempre confirmar
              os requisitos com as autoridades consulares competentes.
            </P>
            <P>
              O valor pago pelo Livoo Prep não é reembolsável após a geração do relatório.
            </P>
          </Section>

          <Section title="6. Uso de inteligência artificial">
            <P>
              A funcionalidade "Roteiro Completo" utiliza inteligência artificial para gerar sugestões
              de itinerário. Os roteiros gerados são sugestões automáticas baseadas em dados disponíveis e não
              representam recomendações profissionais de viagem.
            </P>
            <P>
              A Go Livoo não garante a precisão, atualidade ou adequação dos roteiros gerados pela IA. O usuário
              deve verificar todas as informações antes de realizar qualquer reserva ou viagem.
            </P>
          </Section>

          <Section title="7. Cadastro e conta de usuário">
            <P>
              O uso da plataforma não exige cadastro. Para funcionalidades avançadas (salvar roteiros, alertas de preço,
              histórico), é necessário criar uma conta por meio do sistema Clerk (autenticação segura via email ou OAuth).
            </P>
            <P>
              Você é responsável por manter a segurança de suas credenciais de acesso e por todas as atividades
              realizadas em sua conta. Notifique a Go Livoo imediatamente em caso de uso não autorizado.
            </P>
          </Section>

          <Section title="8. Uso permitido e proibido">
            <P>
              A plataforma pode ser usada apenas para fins pessoais e legítimos de planejamento de viagem.
              É expressamente proibido:
            </P>
            <ul style={{ paddingLeft: 20 }}>
              {[
                'Usar bots, scrapers ou sistemas automatizados para acessar a plataforma sem autorização',
                'Reproduzir, copiar ou redistribuir o conteúdo da plataforma comercialmente',
                'Usar a plataforma para fins fraudulentos, ilegais ou que violem direitos de terceiros',
                'Tentar violar a segurança, integridade ou disponibilidade da plataforma',
                'Criar múltiplas contas com o objetivo de burlar limitações do sistema',
              ].map((item, i) => (
                <li key={i} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  color: '#64748B',
                  lineHeight: 1.7,
                  marginBottom: 8,
                }}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="9. Limitação de responsabilidade">
            <P>
              Na máxima extensão permitida pela legislação aplicável, a Go Livoo não se responsabiliza por:
              danos diretos ou indiretos decorrentes do uso da plataforma; inexatidões nos preços ou disponibilidade
              exibidos; falhas ou indisponibilidade de APIs de parceiros; problemas em reservas realizadas com
              parceiros; ou qualquer decisão de viagem baseada em informações da plataforma.
            </P>
            <P>
              A plataforma é fornecida "no estado em que se encontra", sem garantia de disponibilidade contínua
              ou ausência de erros.
            </P>
          </Section>

          <Section title="10. Propriedade intelectual">
            <P>
              Todo o conteúdo da plataforma Go Livoo — incluindo marca, logo, design, textos, código e funcionalidades —
              é propriedade de Go Livoo Tecnologia Ltda. ou está licenciado por seus parceiros tecnológicos.
              É vedada qualquer reprodução sem autorização prévia por escrito.
            </P>
          </Section>

          <Section title="11. Privacidade">
            <P>
              O tratamento de dados pessoais dos usuários é regido pela nossa{' '}
              <Link href="/privacidade" style={{ color: '#1A82D8', fontWeight: 600 }}>Política de Privacidade</Link>,
              em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </P>
          </Section>

          <Section title="12. Lei aplicável e foro">
            <P>
              Estes Termos de Uso são regidos pela legislação brasileira. Fica eleito o foro da Comarca de
              Curitiba, Estado do Paraná, para dirimir quaisquer conflitos decorrentes deste instrumento,
              com renúncia a qualquer outro, por mais privilegiado que seja.
            </P>
          </Section>

          <Section title="13. Contato">
            <P>
              Para dúvidas sobre estes termos, entre em contato pelo email{' '}
              <Link href="mailto:contato@golivoo.com.br" style={{ color: '#1A82D8' }}>contato@golivoo.com.br</Link>{' '}
              ou pela nossa{' '}
              <Link href="/contato" style={{ color: '#1A82D8', fontWeight: 600 }}>página de contato</Link>.
            </P>
          </Section>

        </div>

        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 32,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link href="/privacidade" className="btn-outline" style={{ fontSize: '0.88rem' }}>
            Política de Privacidade
          </Link>
          <Link href="/como-funciona" className="btn-outline" style={{ fontSize: '0.88rem' }}>
            Como funciona
          </Link>
          <Link href="/contato" className="btn-primary" style={{ fontSize: '0.88rem' }}>
            Fale conosco
          </Link>
        </div>
      </div>
    </div>
  )
}
