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

interface FlightCardProps {
  flight: FlightOffer
  onSelect?: (flight: FlightOffer) => void
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency === 'BRL' ? 'BRL' : currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const { airline, airlineCode, origin, destination, departureTime, arrivalTime, duration, stops, price, currency } = flight

  function handleSelect() {
    if (onSelect) {
      onSelect(flight)
    } else if (flight.link) {
      window.open(flight.link, '_blank')
    }
  }

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>

      {/* Airline */}
      <div style={{ minWidth: 80, textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: '#F4F6F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 6px',
          fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700,
          color: '#1A82D8',
        }}>
          {airlineCode}
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#64748B', textAlign: 'center' }}>
          {airline}
        </p>
      </div>

      {/* Route */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#0F2340' }}>
            {departureTime || '—'}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
            {origin}
          </p>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          {duration && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#64748B', marginBottom: 4 }}>
              {duration}
            </p>
          )}
          <div style={{ position: 'relative', height: 2, background: '#E2E8F0' }}>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff', border: '2px solid #1A82D8',
              borderRadius: '50%', width: 8, height: 8,
            }} />
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: stops === 0 ? '#16a34a' : '#D48A0A', marginTop: 4, fontWeight: 600,
          }}>
            {stops === 0 ? 'Direto' : `${stops} escala${stops > 1 ? 's' : ''}`}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#0F2340' }}>
            {arrivalTime || '—'}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
            {destination}
          </p>
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{ textAlign: 'right', minWidth: 140 }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#0F2340', marginBottom: 4 }}>
          {formatPrice(price, currency)}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#64748B', marginBottom: 12 }}>
          por pessoa
        </p>
        <button
          onClick={handleSelect}
          className="btn-primary"
          style={{ fontSize: '0.82rem', padding: '8px 16px', border: 'none', cursor: 'pointer' }}
        >
          Selecionar
        </button>
      </div>
    </div>
  )
}
