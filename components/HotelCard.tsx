import Image from 'next/image'

interface HotelCardProps {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: string
  imageUrl: string
  amenities?: string[]
  link?: string
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency === 'BRL' ? 'BRL' : currency,
    minimumFractionDigits: 0,
  }).format(price)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#F5A623', fontSize: '0.85rem' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  )
}

export default function HotelCard({
  name, location, rating, reviewCount, pricePerNight, currency, imageUrl, amenities, link,
}: HotelCardProps) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex' }}>
      {/* Image */}
      <div style={{ position: 'relative', width: 180, flexShrink: 0 }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="180px"
        />
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.05rem', color: '#0D1B3E', marginBottom: 4 }}>
            {name}
          </h3>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#5A6A80', marginBottom: 8 }}>
            {location}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <StarRating rating={rating} />
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#5A6A80' }}>
              ({reviewCount.toLocaleString('pt-BR')} avaliações)
            </span>
          </div>
          {amenities && amenities.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {amenities.slice(0, 3).map((a) => (
                <span key={a} style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.72rem',
                  background: '#F4F7FF',
                  color: '#5A6A80',
                  padding: '3px 8px',
                  borderRadius: 50,
                }}>
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#0D1B3E' }}>
              {formatPrice(pricePerNight, currency)}
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem', color: '#5A6A80' }}>
              por noite
            </p>
          </div>
          <a
            href={link ?? '#'}
            target={link ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            Ver hotel
          </a>
        </div>
      </div>
    </div>
  )
}
