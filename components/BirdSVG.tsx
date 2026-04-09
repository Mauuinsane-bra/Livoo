// Andorinha animada da Livoo — fiel ao design aprovado no index.html

interface BirdSVGProps {
  variant?: 'navbar' | 'footer'
  size?: number
}

export default function BirdSVG({ variant = 'navbar', size = 34 }: BirdSVGProps) {
  const isFooter = variant === 'footer'

  // Navbar: azul original. Footer: dourado.
  const body      = isFooter ? '#F5A623' : '#1A56DB'
  const bodyDark  = isFooter ? '#D48A0A' : '#1040B0'
  const beak      = isFooter ? '#fff'    : '#F5A623'
  const glowColor = isFooter ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.18)'

  return (
    <svg
      className="livoo-bird"
      width={size}
      height={Math.round(size * 28 / 34)}
      viewBox="0 0 34 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Corpo */}
      <ellipse cx="17" cy="12" rx="5.5" ry="3.5" fill={body} />

      {/* Cabeça */}
      <circle cx="22" cy="10" r="3" fill={body} />

      {/* Bico */}
      <path d="M25 10 L28 9.5 L25.5 11" fill={beak} />

      {/* Asa esquerda */}
      <path
        className="wing-left"
        d="M14 12 C10 10 4 8 1 11 C5 11.5 9 12.5 12 13.5 Z"
        fill={body}
      />

      {/* Asa direita */}
      <path
        className="wing-right"
        d="M20 12 C24 10 30 8 33 11 C29 11.5 25 12.5 22 13.5 Z"
        fill={bodyDark}
      />

      {/* Cauda bifurcada esquerda */}
      <path
        d="M13 14 C11 17 8 20 6 23"
        stroke={body}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Cauda bifurcada direita */}
      <path
        d="M15 14.5 C14 18 12 21 11 24"
        stroke={bodyDark}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Brilho no peito */}
      <ellipse cx="19" cy="12" rx="2" ry="1.2" fill={glowColor} />
    </svg>
  )
}
