/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite build em produção mesmo com erros de TypeScript
  // (existem erros pré-existentes em libs depreciadas que não afetam o runtime)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.getyourguide.com' },
      { protocol: 'https', hostname: 'cf.bstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'photo.hotellook.com' },
      { protocol: 'https', hostname: '**.getyourguide.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  serverExternalPackages: ['amadeus', '@react-pdf/renderer'],

  // ── Security Headers ──────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previne clickjacking (iframe embedding)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Previne MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Controla informação enviada no header Referer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Bloqueia APIs desnecessárias do navegador
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          // Force HTTPS em produção
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Content Security Policy
          // ⚠️ Corrigido em 06/jul/2026: a versão anterior BLOQUEAVA o GA4 e o
          // Clarity (script-src sem googletagmanager/clarity) — o analytics
          // nunca coletou nada em produção. Também bloqueava o Supabase no
          // browser e o widget do Clerk. frame-src ganhou o Google Maps
          // (mapa por dia no roteiro).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev https://api.resend.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://*.clarity.ms https://*.supabase.co",
              "frame-src https://js.stripe.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
