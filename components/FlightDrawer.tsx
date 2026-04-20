'use client'

// FlightDrawer.tsx
// Painel lateral que abre ao selecionar um voo.
// O usuário revisa os detalhes dentro da Livoo e só vai ao Aviasales
// para finalizar o pagamento — sem sair abruptamente da plataforma.

interface FlightOffer {
  id: string
  airline: string
  airlineCode: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  currency: string
  link?: string
}

interface FlightDrawerProps {
  flight: FlightOffer | null
  passengers: number
  onClose: () => void
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency === 'BRL' ? 'BRL' : currency,
    minimumFractionDigits: 0,
  }).format(price)
}

const PREP_PRICE = 39

export default function FlightDrawer({ flight, passengers, onClose }: FlightDrawerProps) {
  if (!flight) return null

  const total = flight.price * passengers
  const totalWithPrep = total + PREP_PRICE

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(13,27,62,0.45)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Painel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 480,
        background: '#fff',
        zIndex: 1001,
        overflowY: 'auto',
        animation: 'slideIn 0.28s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0d0d0f 0%, #1a1a20 100%)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
              Resumo do voo selecionado
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', fontSize: '1.25rem', margin: 0 }}>
              {flight.origin} → {flight.destination}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: 8, width: 36, height: 36,
              cursor: 'pointer', color: '#fff', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Card do voo */}
          <div style={{
            border: '1.5px solid #e7e6e0', borderRadius: 14, padding: 20,
            background: '#fafaf7',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#ff5722', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700,
              }}>
                {flight.airlineCode}
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#0d0d0f', fontSize: '0.95rem', margin: 0 }}>
                  {flight.airline}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6d6d74', margin: 0 }}>
                  {flight.stops === 0 ? 'Voo direto' : `${flight.stops} escala${flight.stops > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#0d0d0f', margin: 0 }}>
                  {flight.departureTime || '—'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#6d6d74', margin: 0 }}>
                  {flight.origin}
                </p>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 2, background: '#e7e6e0', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#fff', border: '2px solid #ff5722',
                  }} />
                </div>
                {flight.duration && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#6d6d74', marginTop: 6 }}>
                    {flight.duration}
                  </p>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#0d0d0f', margin: 0 }}>
                  {flight.arrivalTime || '—'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#6d6d74', margin: 0 }}>
                  {flight.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Resumo de preço */}
          <div style={{ border: '1.5px solid #e7e6e0', borderRadius: 14, padding: 20 }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#6d6d74', marginBottom: 12 }}>
              Resumo de valores
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: '#0d0d0f' }}>
                Passagem × {passengers} passageiro{passengers > 1 ? 's' : ''}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600, color: '#0d0d0f' }}>
                {formatPrice(total, flight.currency)}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #e7e6e0', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#0d0d0f' }}>
                Total estimado
              </span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#ff5722' }}>
                {formatPrice(total, flight.currency)}
              </span>
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#6d6d74', marginTop: 8, margin: '8px 0 0' }}>
              Preço em reais (BRL) · Sujeito a disponibilidade · Confirme no checkout
            </p>
          </div>

          {/* Livoo Prep upsell */}
          <div style={{
            border: '1.5px solid #ffd600', borderRadius: 14, padding: 20,
            background: '#fffbe6',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#0d0d0f', margin: 0 }}>
                Livoo Prep
              </p>
              <span style={{
                background: '#ffd600', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700,
                padding: '3px 8px', borderRadius: 20,
              }}>
                + R$ {PREP_PRICE}
              </span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#6d6d74', margin: '0 0 12px' }}>
              Checklist de documentação completo, seguro viagem integrado e suporte Livoo para essa viagem.
            </p>
            <a
              href="/prep"
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                fontWeight: 600, color: '#D48A0A', textDecoration: 'none',
              }}
            >
              Saiba mais sobre o Livoo Prep →
            </a>
          </div>

          {/* Parceiro de pagamento */}
          <div style={{
            background: '#fafaf7', borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6d6d74', margin: 0 }}>
              O pagamento é processado com segurança pelo <strong>Jetradar</strong>, nosso parceiro certificado. Preços exibidos em <strong>reais (R$)</strong>. Você será redirecionado ao clicar em finalizar.
            </p>
          </div>

        </div>

        {/* Botão fixo no rodapé */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e7e6e0', background: '#fff' }}>
          <a
            href={flight.link ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '14px 24px',
              background: 'linear-gradient(135deg, #ff5722, #e64e1e)',
              color: '#fff', borderRadius: 12, border: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700,
              textDecoration: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(26,86,219,0.35)',
            }}
          >
            Finalizar compra com segurança →
          </a>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: '#6d6d74', textAlign: 'center', marginTop: 8,
          }}>
            Parceiro: Aviasales · Pagamento seguro · Sem taxas extras da Livoo
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  )
}
