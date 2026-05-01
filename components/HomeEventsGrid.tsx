'use client'

import Link from 'next/link'
import EventPriceTag from '@/components/EventPriceTag'

interface HomeEvent {
  date: string
  title: string
  local: string
  img: string
  href: string
  iata: string
}

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function HomeEventsGrid({ events }: { events: HomeEvent[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {events.map((ev) => (
        <div key={ev.href} className="ev-card">
          <div
            className="ev-img"
            style={{ backgroundImage: `url('${ev.img}')` }}
          >
            <span className="ev-badge">{ev.date}</span>
          </div>
          <div className="ev-body">
            <div className="ev-title">{ev.title}</div>
            <div className="ev-local">
              <PinIcon /> {ev.local}
            </div>
            <div className="ev-price-row">
              <div>
                <span className="ev-from">voo + hotel + ingresso</span>
                <div style={{ marginTop: 4 }}>
                  <EventPriceTag iata={ev.iata} variant="badge" />
                </div>
              </div>
              <Link href={ev.href} className="ev-btn">Ver evento</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
