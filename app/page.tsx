import SearchWidget from '@/components/SearchWidget'
import WaitlistForm from '@/components/WaitlistForm'
import ExperienceCard from '@/components/ExperienceCard'

// Dados estáticos — serão substituídos por dados reais da API
const experiences = [
  {
    id: '1',
    title: 'Athletico Paranaense — Ligga Arena',
    description: 'Sinta o calor da torcida rubro-negra na Ligga Arena. Pacote completo para torcedores de fora do Paraná — voo, hotel e ingresso direto.',
    date: 'Temporada 2025',
    location: 'Curitiba, Brasil',
    price: 'Ingressos a partir de R$ 40',
    category: 'Futebol',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600',
    tag: 'Futebol Brasileiro',
    href: '/eventos',
  },
  {
    id: '2',
    title: 'GP de F1 — Mônaco',
    description: 'A corrida mais glamourosa do mundo. Curvas impossíveis, iates no porto e o som dos motores ecoando nas montanhas.',
    date: 'Mai 2026',
    location: 'Monte Carlo, Mônaco',
    price: 'Preço estimado a partir de R$ 22.000',
    category: 'Automobilismo',
    imageUrl: 'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=600',
    tag: 'Esgotando',
    href: '/eventos',
  },
  {
    id: '3',
    title: 'Drag Racing — Florida NHRA',
    description: 'Os carros mais rápidos do mundo em linha reta. Uma experiência sonora e visual que poucos eventos no mundo conseguem igualar.',
    date: 'Mar 2026',
    location: 'Gainesville, EUA',
    price: 'Preço estimado a partir de R$ 2.400',
    category: 'Automobilismo',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600',
    tag: 'Nichado',
    href: '/eventos',
  },
  {
    id: '4',
    title: 'Lollapalooza Brasil 2026',
    description: 'O maior festival de música do Brasil no Autódromo de Interlagos. Três dias, múltiplos palcos, artistas internacionais.',
    date: 'Mar 2026',
    location: 'São Paulo, Brasil',
    price: 'Ingressos a partir de R$ 650',
    category: 'Shows',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
    tag: 'Em alta',
    href: '/eventos',
  },
]

const steps = [
  {
    num: '01',
    title: 'Você descreve a experiência',
    desc: 'Não precisa saber o destino. Só nos diga o que quer viver — um evento, um festival, uma aventura.',
  },
  {
    num: '02',
    title: 'A Go Livoo localiza e monta o pacote',
    desc: 'Identificamos o evento, encontramos os melhores voos, hotéis próximos e guias locais especializados.',
  },
  {
    num: '03',
    title: 'Verificamos toda a documentação',
    desc: 'Visto, passaporte, vacinas, restrições de entrada — tudo verificado pela Documentação antes de você comprar.',
  },
  {
    num: '04',
    title: 'Você vai. Sem estresse.',
    desc: 'Pacote completo, documentos em ordem, suporte durante a viagem. Só curtir a experiência.',
  },
]

const whyLivoo = [
  {
    num: '01',
    title: 'Experiência primeiro, logística depois',
    desc: 'A maioria dos sites começa pela passagem. A gente começa pela experiência que você quer ter.',
  },
  {
    num: '02',
    title: 'Documentação integrada',
    desc: 'Sherpa API verifica em tempo real: visto, vacinas, validade do passaporte — tudo antes de você comprar.',
  },
  {
    num: '03',
    title: 'Pacote completo em um lugar',
    desc: 'Voo + hotel + guia local + transfer + ingresso + seguro. Sem abrir 10 abas diferentes.',
  },
  {
    num: '04',
    title: 'Sem mensalidade',
    desc: 'Pague só quando viajar. Modelo justo para quem viaja 1 ou 2 vezes por ano.',
  },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="hero-gradient"
        style={{ padding: '80px 0 100px', position: 'relative', overflow: 'hidden' }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(245,166,35,0.15)',
            color: '#F5A623',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: 50,
            marginBottom: 24,
            border: '1px solid rgba(245,166,35,0.3)',
          }}>
            Plataforma de Soluções para Viajantes
          </span>

          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 20,
            maxWidth: 780,
            margin: '0 auto 20px',
          }}>
            Você quer a experiência.
            <br />
            <span style={{ color: '#F5A623' }}>A Go Livoo resolve o resto.</span>
          </h1>

          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 620,
            margin: '0 auto 48px',
            lineHeight: 1.8,
          }}>
            Descreva a <span style={{ color: '#F5A623', fontWeight: 600 }}>experiência que você sonha</span> — um rally em offroad na Geórgia, o caos controlado do Lolla, a velocidade máxima do GP de Mônaco. <br/><br/>
            <span style={{ color: '#fff', fontWeight: 500 }}>A Go Livoo resolve tudo: voo, hotel, transferência, ingresso, guia local, seguro e documentação verificada em tempo real.</span> Você só relaxa e aproveita.
          </p>

          {/* Widget de busca */}
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <SearchWidget />
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            marginTop: 32,
            flexWrap: 'wrap',
          }}>
            {['Sem mensalidade', 'Documentação verificada', 'Parceiros certificados'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ color: '#F5A623' }}>✓</span> {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Como Funciona</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0D1B3E' }}>
              Do desejo à experiência,<br />em 4 passos
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
          }}>
            {steps.map((step) => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="step-number">{step.num}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.15rem', color: '#0D1B3E' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#5A6A80', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIÊNCIAS EM ALTA ── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label">Experiências em Alta</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0D1B3E' }}>
              O que os viajantes Livoo estão planejando
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 24,
          }}>
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} {...exp} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="/eventos" className="btn-outline">
              Ver todos os eventos
            </a>
          </div>
        </div>
      </section>

      {/* ── POR QUE LIVOO ── */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}>
            <div>
              <span className="section-label">Por que Livoo?</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0D1B3E', marginBottom: 40 }}>
                Diferente de tudo que você já usou
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {whyLivoo.map((item) => (
                  <div key={item.num} style={{ display: 'flex', gap: 16 }}>
                    <div className="step-number" style={{ width: 44, height: 44, fontSize: '0.9rem', borderRadius: 10, flexShrink: 0 }}>
                      {item.num}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.05rem', color: '#0D1B3E', marginBottom: 6 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', color: '#5A6A80', lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Livoo Prep widget */}
            <div style={{
              background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
              borderRadius: 20,
              padding: 40,
              color: '#fff',
            }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  background: 'rgba(245,166,35,0.2)',
                  color: '#F5A623',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 50,
                }}>
                  Documentação
                </span>
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', margin: '12px 0 8px' }}>
                Visto, vacina, tudo checado
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', marginBottom: 24, lineHeight: 1.6 }}>
                Verifique visto, passaporte, vacinas e restrições de entrada — antes de comprar.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: '✓', text: 'Visto necessário?', status: 'Verificado', ok: true },
                  { icon: '✓', text: 'Passaporte válido?', status: 'Mín. 6 meses', ok: true },
                  { icon: '!', text: 'Vacina febre amarela', status: 'Obrigatória', ok: false },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.07)',
                    }}
                  >
                    <span style={{ fontSize: '0.88rem' }}>{item.text}</span>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: item.ok ? '#4ade80' : '#F5A623',
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <a href="/prep" className="btn-gold" style={{ display: 'block', textAlign: 'center' }}>
                Verificar minha documentação
              </a>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 10 }}>
                Em desenvolvimento — R$ 39/destino
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO GANHAMOS ── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Transparência</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0D1B3E', marginBottom: 12 }}>
              Gratuito para você. Simples assim.
            </h2>
            <p style={{ color: '#5A6A80', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto' }}>
              Buscar voos, hotéis, eventos e montar roteiros é gratuito. A Go Livoo ganha uma comissão dos parceiros quando você reserva — sem nenhum custo extra para você.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            maxWidth: 860,
            margin: '0 auto',
          }}>
            {/* Gratuito */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1A56DB', marginBottom: 10 }}>
                  A plataforma
                </p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>
                  Grátis
                </p>
                <p style={{ fontSize: '0.85rem', color: '#5A6A80' }}>para sempre</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {[
                  'Busca de voos, hotéis, ônibus e carros',
                  'Roteiros montados com IA',
                  'Eventos e experiências no destino',
                  'Guias turísticos locais',
                  'Comparação de preços em tempo real',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: '0.88rem', color: '#5A6A80', alignItems: 'flex-start' }}>
                    <span style={{ color: '#1A56DB', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.78rem',
                color: '#5A6A80',
                background: '#F4F7FF',
                padding: '10px 14px',
                borderRadius: 8,
                lineHeight: 1.5,
              }}>
                A Go Livoo recebe uma comissão dos parceiros (Booking, Travelpayouts, GetYourGuide) quando você reserva — sem custo adicional para você.
              </p>
              <a href="/#acesso-antecipado" className="btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                Entrar na lista de espera
              </a>
            </div>

            {/* Documentação */}
            <div className="card" style={{ background: '#0D1B3E', border: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <span style={{
                  background: 'rgba(245,166,35,0.2)',
                  color: '#F5A623',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 50,
                  display: 'inline-block',
                  marginBottom: 12,
                }}>
                  Serviço adicional
                </span>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  R$ 39
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>por verificação de viagem</p>
              </div>

              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 12 }}>
                  Documentação Completa — Checklist de Viagem
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {[
                    'Visto necessário e como solicitar',
                    'Validade mínima do passaporte',
                    'Vacinas obrigatórias e recomendadas',
                    'Restrições de entrada no destino',
                    'Checklist personalizado em PDF',
                    'Cotação de seguro viagem',
                  ].map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', alignItems: 'flex-start' }}>
                      <span style={{ color: '#F5A623', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a href="/prep" className="btn-gold" style={{ display: 'block', textAlign: 'center', marginTop: 'auto' }}>
                Verificar minha documentação
              </a>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: -8 }}>
                Em desenvolvimento — disponível em breve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACESSO ANTECIPADO (Waitlist) ── */}
      <section id="acesso-antecipado" className="section" style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)' }}>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <span style={{
            background: 'rgba(245,166,35,0.15)',
            color: '#F5A623',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: 50,
            display: 'inline-block',
            marginBottom: 20,
          }}>
            Acesso Antecipado
          </span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#fff', marginBottom: 12 }}>
            Seja um dos primeiros
          </h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.7 }}>
            A Go Livoo está em desenvolvimento. Entre na lista e você será notificado quando abrirmos o acesso — e terá condições especiais de lançamento.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  )
}
