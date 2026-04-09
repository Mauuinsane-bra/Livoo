import SearchWidget from '@/components/SearchWidget'
import WaitlistForm from '@/components/WaitlistForm'
import ExperienceCard from '@/components/ExperienceCard'

// Dados estáticos — serão substituídos por dados reais da API
const experiences = [
  {
    id: '1',
    title: 'Rally Cross — Geórgia',
    description: 'O campeonato de rally cross mais emocionante da Europa, com pilotos de 20 países em circuitos de terra.',
    date: 'Out 2026',
    location: 'Tbilisi, Geórgia',
    price: 'A partir de R$ 8.900',
    category: 'Automobilismo',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    tag: 'Em alta',
  },
  {
    id: '2',
    title: 'Rock Underground — Moscou',
    description: 'Cena musical independente única no mundo. Festivais fechados, bandas cult e experiências que você não encontra em nenhum guia.',
    date: 'Set 2026',
    location: 'Moscou, Rússia',
    price: 'A partir de R$ 12.400',
    category: 'Shows',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
    tag: 'Exclusivo',
  },
  {
    id: '3',
    title: 'GP de F1 — Mônaco',
    description: 'A corrida mais glamourosa do mundo. Curvas impossíveis, iates no porto e o som dos motores ecoando nas montanhas.',
    date: 'Mai 2027',
    location: 'Monte Carlo, Mônaco',
    price: 'A partir de R$ 22.000',
    category: 'Automobilismo',
    imageUrl: 'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=600',
    tag: 'Esgotando',
  },
  {
    id: '4',
    title: 'Hanami — Japão',
    description: 'A cerimônia das flores de cerejeira. Uma semana de festivais, picnics nos parques e o Japão mais fotogênico do ano.',
    date: 'Mar–Abr 2027',
    location: 'Tóquio & Kyoto, Japão',
    price: 'A partir de R$ 15.800',
    category: 'Cultura',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600',
    tag: 'Em alta',
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
    title: 'A Livoo localiza e monta o pacote',
    desc: 'Identificamos o evento, encontramos os melhores voos, hotéis próximos e guias locais especializados.',
  },
  {
    num: '03',
    title: 'Verificamos toda a documentação',
    desc: 'Visto, passaporte, vacinas, restrições de entrada — tudo verificado pelo Livoo Prep antes de você comprar.',
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
            <span style={{ color: '#F5A623' }}>A Livoo resolve o resto.</span>
          </h1>

          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 580,
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}>
            Diga o que quer viver — um rally na Geórgia, um festival no Japão,
            um GP em Mônaco. A Livoo monta voo, hotel, guia e documentação.
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
            <a href="/roteiro" className="btn-outline">
              Ver todas as experiências
            </a>
          </div>
        </div>
      </section>

      {/* ── POR QUE LIVOO ── */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
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
                  Livoo Prep
                </span>
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', margin: '12px 0 8px' }}>
                Documentação da sua viagem
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

      {/* ── PLANOS ── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label">Planos</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0D1B3E', marginBottom: 12 }}>
              Simples, justo e sem mensalidade
            </h2>
            <p style={{ color: '#5A6A80', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem' }}>
              Pague só quando viajar. Nada de assinatura que você esquece de cancelar.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            maxWidth: 960,
            margin: '0 auto',
          }}>
            {/* Free */}
            <div className="card">
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5A6A80', marginBottom: 12 }}>Livoo Free</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>R$ 0</p>
              <p style={{ fontSize: '0.85rem', color: '#5A6A80', marginBottom: 24 }}>Sempre gratuito</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Busca de voos e hotéis', 'Roteiro completo (3/mês)', 'Doc Check básico', '2 alertas de preço'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: '#5A6A80' }}>
                    <span style={{ color: '#1A56DB', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/#acesso-antecipado" className="btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                Começar grátis
              </a>
            </div>

            {/* Prep */}
            <div className="card" style={{ border: '2px solid #1A56DB', position: 'relative' }}>
              <span style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: '#1A56DB', color: '#fff', fontSize: '0.72rem', fontWeight: 700,
                padding: '4px 14px', borderRadius: 50, whiteSpace: 'nowrap',
              }}>
                Mais Popular
              </span>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1A56DB', marginBottom: 12 }}>Livoo Prep</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>R$ 39</p>
              <p style={{ fontSize: '0.85rem', color: '#5A6A80', marginBottom: 24 }}>por viagem</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Doc Check completo (visto, vacinas, passaporte)', 'Checklist personalizado em PDF', 'Cotação de seguro viagem', 'Suporte prioritário'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: '#5A6A80' }}>
                    <span style={{ color: '#1A56DB', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/prep" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                Verificar minha viagem
              </a>
            </div>

            {/* Anual */}
            <div className="card" style={{ background: '#0D1B3E', border: 'none' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F5A623', marginBottom: 12 }}>Livoo Pass Anual</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>R$ 199</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>por ano</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Tudo do Prep, ilimitado', 'Roteiros ilimitados', 'Alertas ilimitados', 'Cashback 5% em reservas'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#F5A623', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/#acesso-antecipado" className="btn-gold" style={{ display: 'block', textAlign: 'center' }}>
                Quero o Pass Anual
              </a>
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
            A Livoo está em desenvolvimento. Entre na lista e você será notificado quando abrirmos o acesso — e terá condições especiais de lançamento.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  )
}
