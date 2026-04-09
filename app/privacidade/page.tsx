import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Livoo coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
}

export default function PrivacidadePage() {
  const lastUpdate = '30 de março de 2026'

  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh', padding: '60px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '40px 48px',
          boxShadow: '0 4px 20px rgba(13,27,62,0.06)',
          marginBottom: 24,
        }}>
          <span style={{
            display: 'inline-block',
            background: '#EEF4FF',
            color: '#1A56DB',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 50,
            marginBottom: 16,
          }}>
            Jurídico
          </span>
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '2rem',
            color: '#0D1B3E',
            marginBottom: 12,
          }}>
            Política de Privacidade
          </h1>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.88rem',
            color: '#5A6A80',
          }}>
            Última atualização: {lastUpdate} · Em conformidade com a LGPD (Lei nº 13.709/2018)
          </p>
        </div>

        {/* Conteúdo */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '40px 48px',
          boxShadow: '0 4px 20px rgba(13,27,62,0.06)',
        }}>
          <Section title="1. Quem somos">
            <p>A <strong>Livoo</strong> é uma plataforma de soluções para viajantes, empresa em constituição no Brasil. Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais, em total conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
            <p>Para dúvidas ou solicitações relacionadas a esta política, entre em contato: <a href="mailto:privacidade@golivoo.com.br" style={{ color: '#1A56DB' }}>privacidade@golivoo.com.br</a></p>
          </Section>

          <Section title="2. Dados que coletamos">
            <p>Coletamos apenas os dados estritamente necessários para operar nossos serviços:</p>
            <ul>
              <li><strong>Lista de espera:</strong> nome e endereço de email, e interesses de viagem que você opcionalmente informa.</li>
              <li><strong>Conta de usuário:</strong> nome, email e preferências de viagem, gerenciados via Clerk (provedor de autenticação terceirizado).</li>
              <li><strong>Uso da plataforma:</strong> buscas realizadas, roteiros gerados e preferências de notificação, para personalizar sua experiência.</li>
              <li><strong>Pagamentos (Livoo Prep):</strong> processados exclusivamente pela Stripe. A Livoo <strong>não armazena</strong> dados de cartão de crédito ou informações bancárias.</li>
              <li><strong>Dados analíticos:</strong> utilizamos Plausible Analytics, que não usa cookies de rastreamento e não coleta dados pessoais identificáveis.</li>
            </ul>
          </Section>

          <Section title="3. Como usamos seus dados">
            <p>Usamos seus dados para:</p>
            <ul>
              <li>Notificá-lo sobre o lançamento e novidades da Livoo (apenas se você se cadastrou na lista de espera).</li>
              <li>Personalizar resultados de busca e sugestões de roteiro.</li>
              <li>Enviar confirmações de pagamento e alertas de preço que você configurou.</li>
              <li>Melhorar nossos serviços com base em dados anonimizados de uso.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
            <p><strong>Nunca</strong> vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing.</p>
          </Section>

          <Section title="4. Base legal para o tratamento (LGPD)">
            <p>Tratamos seus dados com base nas seguintes hipóteses legais previstas na LGPD:</p>
            <ul>
              <li><strong>Consentimento (art. 7º, I):</strong> para o cadastro na lista de espera e envio de comunicações de marketing.</li>
              <li><strong>Execução de contrato (art. 7º, V):</strong> para processar pagamentos e entregar os serviços contratados (Livoo Prep).</li>
              <li><strong>Interesse legítimo (art. 7º, IX):</strong> para análise de uso anonimizada e melhoria dos serviços.</li>
              <li><strong>Obrigação legal (art. 7º, II):</strong> para cumprimento de obrigações fiscais e regulatórias.</li>
            </ul>
          </Section>

          <Section title="5. Compartilhamento de dados">
            <p>Compartilhamos seus dados <strong>apenas</strong> com os seguintes parceiros técnicos, estritamente necessários para operar o serviço:</p>
            <ul>
              <li><strong>Supabase</strong> (banco de dados — EUA, com proteção adequada)</li>
              <li><strong>Clerk</strong> (autenticação — processador de dados, EUA)</li>
              <li><strong>Resend / Brevo</strong> (envio de emails transacionais)</li>
              <li><strong>Stripe</strong> (processamento de pagamentos — PCI-DSS certificado)</li>
              <li><strong>Vercel</strong> (hospedagem — EUA, com proteção adequada)</li>
            </ul>
            <p>Todos os parceiros são vinculados contratualmente a tratar seus dados apenas conforme nossas instruções e em conformidade com a LGPD.</p>
          </Section>

          <Section title="6. Seus direitos como titular dos dados">
            <p>Você tem os seguintes direitos garantidos pela LGPD (art. 18), exercíveis a qualquer momento:</p>
            <ul>
              <li><strong>Acesso:</strong> saber quais dados temos sobre você.</li>
              <li><strong>Correção:</strong> corrigir dados incompletos ou incorretos.</li>
              <li><strong>Exclusão:</strong> solicitar a remoção dos seus dados pessoais.</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
              <li><strong>Revogação do consentimento:</strong> cancelar sua inscrição na lista de espera a qualquer momento.</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento realizado com base em interesse legítimo.</li>
            </ul>
            <p>Para exercer qualquer um destes direitos, envie um email para: <a href="mailto:privacidade@golivoo.com.br" style={{ color: '#1A56DB' }}>privacidade@golivoo.com.br</a></p>
          </Section>

          <Section title="7. Cookies e rastreamento">
            <p>A Livoo usa apenas cookies estritamente necessários para o funcionamento da plataforma (autenticação via Clerk). Não utilizamos cookies de rastreamento publicitário, cookies de terceiros para remarketing, ou qualquer tecnologia de rastreamento cross-site.</p>
            <p>Nossa análise de uso é feita via <strong>Plausible Analytics</strong>, que é open-source, não usa cookies e não coleta dados pessoais — em total conformidade com a LGPD e o GDPR europeu.</p>
          </Section>

          <Section title="8. Retenção e exclusão de dados">
            <p>Mantemos seus dados pelo período necessário para a prestação do serviço ou enquanto houver consentimento válido. Ao solicitar exclusão, removeremos seus dados em até <strong>15 dias úteis</strong>, exceto os que precisamos manter por obrigação legal (ex: dados fiscais por até 5 anos, conforme legislação brasileira).</p>
          </Section>

          <Section title="9. Segurança">
            <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados, incluindo criptografia em trânsito (TLS), controle de acesso por função, autenticação de dois fatores para administradores, e monitoramento de segurança contínuo.</p>
            <p>Em caso de incidente de segurança que afete seus dados, notificaremos a ANPD e os titulares afetados conforme exigido pela LGPD.</p>
          </Section>

          <Section title="10. Alterações nesta política">
            <p>Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações relevantes, notificaremos por email os usuários cadastrados e atualizaremos a data de "última atualização" no topo desta página. O uso continuado da plataforma após as alterações implica aceitação da nova política.</p>
          </Section>

          <Section title="11. Encarregado de Proteção de Dados (DPO)">
            <p>Enquanto a empresa está em constituição, as solicitações relacionadas a dados pessoais devem ser enviadas para: <a href="mailto:privacidade@golivoo.com.br" style={{ color: '#1A56DB' }}>privacidade@golivoo.com.br</a></p>
            <p>Respondemos a todas as solicitações em até 15 dias úteis.</p>
          </Section>

          <div style={{
            marginTop: 40,
            padding: '20px 24px',
            background: '#F4F7FF',
            borderRadius: 12,
            borderLeft: '4px solid #1A56DB',
          }}>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.85rem',
              color: '#5A6A80',
              margin: 0,
            }}>
              Esta política foi elaborada em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong> e com os princípios de privacidade desde o design (Privacy by Design). Para denúncias ou reclamações, você também pode acionar a <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" style={{ color: '#1A56DB' }}>gov.br/anpd</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: 'Fraunces, serif',
        fontSize: '1.15rem',
        color: '#0D1B3E',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid #D0DCF0',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.92rem',
        color: '#5A6A80',
        lineHeight: 1.75,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {children}
      </div>
    </div>
  )
}
