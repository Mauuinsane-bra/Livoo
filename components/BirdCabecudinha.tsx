// Logo 05 — Cabeçudinha · site principal (navbar + footer)

interface Props { size?: number }

export default function BirdCabecudinha({ size = 48 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Go Livoo"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <style>{`
        @keyframes cbc-flap  { 0%,100%{transform:scaleY(1)}   50%{transform:scaleY(.7)} }
        @keyframes cbc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes cbc-blink { 0%,92%,100%{transform:scaleY(1)} 95%{transform:scaleY(.1)} }
        .cbc-body  { animation: cbc-float 1.4s ease-in-out infinite; }
        .cbc-wings { animation: cbc-flap  1.4s ease-in-out infinite; transform-origin: 50px 47px; }
        .cbc-eye   { animation: cbc-blink 4s   ease-in-out infinite; transform-origin: 67px 37px; }
        @media (prefers-reduced-motion: reduce) {
          .cbc-body, .cbc-wings, .cbc-eye { animation: none; }
        }
      `}</style>

      <g className="cbc-body">
        <path d="M38 60 C34 68 30 76 26 84" stroke="#c03010" strokeWidth="3.6" strokeLinecap="round" fill="none"/>
        <path d="M44 62 C42 70 39 78 37 86" stroke="#ff7040" strokeWidth="3"   strokeLinecap="round" fill="none"/>
        <ellipse cx="52" cy="54" rx="18" ry="10" fill="#ff7040" transform="rotate(-8 52 54)"/>
        <circle  cx="70" cy="38" r="18" fill="#ff7040"/>
        <ellipse cx="78" cy="46" rx="7" ry="4.5" fill="#ff6eb0" opacity=".66" transform="rotate(-6 78 46)"/>
        <circle  cx="66" cy="36" r="8"  fill="#fff"/>
        <g className="cbc-eye">
          <circle cx="67"  cy="37"   r="4.6" fill="#1a1210"/>
          <circle cx="68.4" cy="35.5" r="1.7" fill="#fff"/>
        </g>
        <path d="M86 36 Q96 40 86 44" fill="#ffb800"/>
        <ellipse cx="46" cy="50" rx="4" ry="2" fill="rgba(255,255,255,.28)" transform="rotate(-8 46 50)"/>
      </g>

      <g className="cbc-wings">
        <path d="M54 48 C40 36 22 32 8 36 C18 40 34 44 42 50 Z" fill="#ff7040" opacity=".95"/>
        <path d="M54 51 C40 58 22 62 8 58 C18 56 34 54 42 50 Z" fill="#c03010" opacity=".88"/>
      </g>
    </svg>
  )
}
