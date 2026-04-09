import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Livoo — Vá mais longe por menos',
    template: '%s | Livoo',
  },
  description:
    'Livoo é a plataforma de soluções para viajantes que transforma sua experiência em um pacote completo: voo, hotel, guia local e toda a documentação necessária.',
  keywords: [
    'agência de viagens para eventos',
    'roteiro personalizado viagem',
    'pacote completo viagem',
    'visto para brasileiro',
    'livoo',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type:      'website',
    locale:    'pt_BR',
    url:       process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    siteName:  'Livoo',
    title:     'Livoo — Vá mais longe por menos',
    description: 'Você quer a experiência. A Livoo resolve o resto.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
