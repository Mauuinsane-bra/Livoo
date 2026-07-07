import type { Metadata } from 'next'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Go Livoo — Vá mais longe por menos',
    template: '%s | Go Livoo',
  },
  description:
    'Go Livoo é a plataforma de soluções para viajantes — roteiro completo gerado por IA, voos, hotéis, guias e documentação. Você quer a experiência. A Go Livoo resolve o resto.',
  keywords: [
    'agência de viagens para eventos',
    'roteiro personalizado viagem',
    'roteiro completo viagem',
    'visto para brasileiro',
    'golivoo',
    'go livoo',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://livoo-two.vercel.app'),
  openGraph: {
    type:      'website',
    locale:    'pt_BR',
    url:       process.env.NEXT_PUBLIC_APP_URL ?? 'https://livoo-two.vercel.app',
    siteName:  'Go Livoo',
    title:     'Go Livoo — Vá mais longe por menos',
    description: 'Você quer a experiência. A Go Livoo resolve o resto.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Go Livoo — plataforma de soluções para viajantes',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Go Livoo — Vá mais longe por menos',
    description: 'Você quer a experiência. A Go Livoo resolve o resto.',
    images: ['https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          {/* Google Analytics GA4 */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-D67PLKE2N7"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D67PLKE2N7');
            `}
          </Script>

          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wii6ltzm5k");
            `}
          </Script>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}