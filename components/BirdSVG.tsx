// Andorinha Go Livoo v3 — refinada: olho maior, bochecha mais viva, sobrancelha mais grossa, cauda com mais caráter

interface BirdSVGProps {
  variant?: 'navbar' | 'footer'
  size?: number
}

export default function BirdSVG({ variant = 'navbar', size = 52 }: BirdSVGProps) {
  const isFooter = variant === 'footer'
  const bodyLight   = isFooter ? '#ffd600' : '#ff7040'
  const bodyDark    = isFooter ? '#D48A0A' : '#e04010'
  const bodyMid     = isFooter ? '#e8b800' : '#c03010'
  const beakColor   = isFooter ? '#fff'    : '#ffb800'
  const cheekColor  = isFooter ? '#FFD580' : '#ff6eb0'
  const browColor   = isFooter ? 'rgba(255,255,255,0.7)' : '#9a2800'
  const idSuffix    = isFooter ? 'ft'      : 'nb'

  return (
    <svg
      className="livoo-bird"
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={`bodyGrad-${idSuffix}`} cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor={bodyLight} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
        <radialGradient id={`headGrad-${idSuffix}`} cx="42%" cy="32%" r="60%">
          <stop offset="0%" stopColor={bodyLight} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
      </defs>

      <g className="bird-float">
        {/* Cauda bifurcada — traços mais expressivos */}
        <g className="bird-tail">
          <path d="M18 33 C13 41 8 48 5 52" stroke={bodyMid} strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M21 34 C17 42 14 48 12 53" stroke={bodyLight} strokeWidth="2.4" strokeLinecap="round"/>
        </g>

        {/* Asa superior */}
        <path
          className="bird-wing-t"
          d="M28 25 C21 18 11 15 3 18 C10 20 19 22 24 26 Z"
          fill={bodyLight}
          opacity="0.9"
        />
        {/* Asa inferior */}
        <path
          className="bird-wing-b"
          d="M28 27 C21 34 11 37 3 35 C10 33 19 30 24 28 Z"
          fill={bodyMid}
          opacity="0.85"
        />

        {/* Corpo */}
        <ellipse
          cx="34" cy="28" rx="13.5" ry="7.5"
          fill={`url(#bodyGrad-${idSuffix})`}
          transform="rotate(-10 34 28)"
        />

        {/* Cabeça — ligeiramente maior */}
        <circle cx="44" cy="21" r="11" fill={`url(#headGrad-${idSuffix})`} />

        {/* Bochecha mais intensa e visível */}
        <ellipse cx="48" cy="26" rx="5" ry="3.5" fill={cheekColor} opacity="0.65" />

        {/* Olho maior e mais expressivo */}
        <g className="bird-eye-blink">
          <circle cx="43" cy="19" r="5" fill="white" />
          <circle cx="44.2" cy="19.2" r="2.8" fill="#1a1210" />
          <circle cx="45.5" cy="17.8" r="1.1" fill="white" />
          <circle cx="43.5" cy="21" r="0.55" fill="white" opacity="0.7" />
        </g>

        {/* Sobrancelha mais espessa e arqueada */}
        <path
          d="M39 14.5 Q43.5 11.5 47.5 14"
          stroke={browColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bico mais gordo */}
        <path d="M54 19 Q59 21.5 54 24.2" fill={beakColor} />
        <path d="M54 19 Q57.5 21 54 22.8" fill="rgba(255,255,255,0.3)" />

        {/* Brilho no corpo */}
        <ellipse cx="37" cy="25.5" rx="4" ry="2" fill="rgba(255,255,255,0.22)" transform="rotate(-10 37 25.5)" />
      </g>
    </svg>
  )
}
