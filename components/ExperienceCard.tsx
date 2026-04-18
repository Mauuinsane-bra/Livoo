import Image from 'next/image'
import Link from 'next/link'

interface ExperienceCardProps {
  id: string
  title: string
  description: string
  date: string
  location: string
  price: string
  category: string
  imageUrl: string
  tag?: string
}

const tagColors: Record<string, { bg: string; color: string }> = {
  'Em alta':   { bg: '#E6F3FF', color: '#1A82D8' },
  'Exclusivo': { bg: '#FFF8EC', color: '#D48A0A' },
  'Esgotando': { bg: '#FFF0F0', color: '#DC2626' },
}

export default function ExperienceCard({
  id, title, description, date, location, price, category, imageUrl, tag,
}: ExperienceCardProps) {
  const tagStyle = tag ? tagColors[tag] ?? { bg: '#F4F6F9', color: '#64748B' } : null

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Imagem */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
          sizes="(max-width: 768px) 100vw, 300px"
        />
        {tag && tagStyle && (
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: tagStyle.bg,
            color: tagStyle.color,
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 50,
          }}>
            {tag}
          </span>
        )}
        <span style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(13,27,62,0.75)',
          color: '#fff',
          fontSize: '0.72rem',
          padding: '3px 10px',
          borderRadius: 50,
          backdropFilter: 'blur(4px)',
        }}>
          {category}
        </span>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.78rem',
          color: '#64748B',
        }}>
          <span>{location}</span>
          <span>·</span>
          <span>{date}</span>
        </div>

        <h3 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '1.1rem',
          color: '#0F2340',
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          color: '#64748B',
          lineHeight: 1.55,
          marginBottom: 16,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0F2340',
          }}>
            {price}
            <small style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#64748B', fontWeight: 400, marginLeft: 2 }}>
              *estimado
            </small>
          </span>
          <Link
            href={`/roteiro?experiencia=${id}`}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            Montar pacote
          </Link>
        </div>
      </div>
    </div>
  )
}
