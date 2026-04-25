// Logo 02 — Azul Navy · blog (BlogSubnav)

interface Props { size?: number }

export default function BirdAzulNavy({ size = 44 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Blog da Go Livoo"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <style>{`
        @keyframes azn-flap  { 0%,100%{transform:scaleY(1)}   50%{transform:scaleY(.7)} }
        @keyframes azn-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes azn-blink { 0%,92%,100%{transform:scaleY(1)} 95%{transform:scaleY(.1)} }
        .azn-body  { animation: azn-float 1.4s ease-in-out infinite; }
        .azn-wings { animation: azn-flap  1.4s ease-in-out infinite; transform-origin: 50px 47px; }
        .azn-eye   { animation: azn-blink 4s   ease-in-out infinite; transform-origin: 70px 38px; }
        @media (prefers-reduced-motion: reduce) {
          .azn-body, .azn-wings, .azn-eye { animation: none; }
        }
      `}</style>

      <rect width="100" height="100" fill="#ffffff"/>

      <g className="azn-body">
        <path d="M40 56 C36 64 32 72 28 80" stroke="#0F2340" strokeWidth="3.6" strokeLinecap="round" fill="none"/>
        <path d="M46 58 C44 66 41 74 39 82" stroke="#1A56DB" strokeWidth="3"   strokeLinecap="round" fill="none"/>
        <ellipse cx="56" cy="50" rx="20" ry="11" fill="#1A56DB" transform="rotate(-10 56 50)"/>
        <circle  cx="71" cy="40" r="14" fill="#1A56DB"/>
        <ellipse cx="76" cy="46" rx="6" ry="4" fill="#5b8af2" opacity=".55" transform="rotate(-6 76 46)"/>
        <circle  cx="69" cy="37" r="6"  fill="#fff"/>
        <g className="azn-eye">
          <circle cx="70"  cy="38"   r="3.4" fill="#0F2340"/>
          <circle cx="71.4" cy="36.6" r="1.3" fill="#fff"/>
        </g>
        <path d="M84 38 Q92 41 84 44" fill="#F5A800"/>
        <ellipse cx="50" cy="46" rx="5" ry="2.5" fill="rgba(255,255,255,.32)" transform="rotate(-10 50 46)"/>
      </g>

      <g className="azn-wings">
        <path d="M58 44 C42 32 22 28 8 32 C18 36 36 42 44 46 Z" fill="#1A56DB" opacity=".95"/>
        <path d="M58 47 C42 56 22 60 8 56 C18 52 36 48 44 46 Z" fill="#0F2340" opacity=".88"/>
      </g>
    </svg>
  )
}
