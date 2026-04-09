/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.getyourguide.com' },
      { protocol: 'https', hostname: 'cf.bstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'photo.hotellook.com' },
      { protocol: 'https', hostname: '**.getyourguide.com' },
    ],
  },
  serverExternalPackages: ['amadeus'],

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
          // Content Security Policy básica
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev https://api.resend.com",
              "frame-src https://js.stripe.com https://*.clerk.accounts.dev",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
