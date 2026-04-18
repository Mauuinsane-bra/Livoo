// Andorinha Go Livoo v2 — animada, bonitinha, com gradiente e bochechas

interface BirdSVGProps {
  variant?: 'navbar' | 'footer'
  size?: number
}

export default function BirdSVG({ variant = 'navbar', size = 52 }: BirdSVGProps) {
  const isFooter = variant === 'footer'
  const bodyColor   = isFooter ? '#F5A800' : '#1A82D8'
  const bodyDark    = isFooter ? '#D48A0A' : '#1260A8'
  const beakColor   = isFooter ? '#fff'    : '#F5A800'
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
        <radialGradient id={`bodyGrad-${idSuffix}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
        <radialGradient id={`headGrad-${idSuffix}`} cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
      </defs>

      <g className="bird-float">
        {/* Cauda bifurcada */}
        <g className="bird-tail">
          <path d="M18 32 C14 39 10 45 7 50" stroke={bodyDark} strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M21 33 C18 40 15 46 13 51" stroke={bodyColor} strokeWidth="2.2" strokeLinecap="round"/>
        </g>

        {/* Asa superior */}
        <path
          className="bird-wing-t"
          d="M28 26 C22 20 12 17 4 20 C10 21 18 23 24 26 Z"
          fill={bodyColor}
          opacity="0.9"
        />
        {/* Asa inferior */}
        <path
          className="bird-wing-b"
          d="M28 28 C22 34 12 37 4 35 C10 33 18 30 24 28 Z"
          fill={bodyDark}
          opacity="0.85"
        />

        {/* Corpo */}
        <ellipse
          cx="34" cy="28" rx="13" ry="7"
          fill={`url(#bodyGrad-${idSuffix})`}
          transform="rotate(-10 34 28)"
        />

        {/* Cabeça — maior e mais redonda */}
        <circle cx="44" cy="21" r="10" fill={`url(#headGrad-${idSuffix})`} />

        {/* Bochechas rosadas */}
        <ellipse cx="47" cy="25" rx="4" ry="2.5" fill="#FFB3C6" opacity="0.55" />

        {/* Olho com piscada */}
        <g className="bird-eye-blink">
          <circle cx="43" cy="19" r="4" fill="white" />
          <circle cx="44" cy="19" r="2.2" fill="#1A1A2E" />
          <circle cx="45" cy="18" r="0.8" fill="white" />
        </g>
        {/* Sobrancelha expressiva */}
        <path d="M40 15.5 Q43.5 13.5 46.5 15" stroke="#0F2340" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Bico curvado */}
        <path d="M53 19.5 Q57.5 22 53 24" fill={beakColor} />
        <path d="M53 19.5 Q56 21.2 53 22.5" fill={isFooter ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.35)'} />

        {/* Brilho no corpo */}
        <ellipse cx="37" cy="26" rx="3.5" ry="1.8" fill="rgba(255,255,255,0.22)" transform="rotate(-10 37 26)" />
      </g>
    </svg>
  )
}
