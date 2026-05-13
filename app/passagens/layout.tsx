import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar Passagens Aéreas',
  description: 'Compare preços de passagens aéreas para qualquer destino do mundo. Resultados em tempo real com as melhores companhias aéreas.',
  openGraph: {
    title: 'Buscar Passagens | Go Livoo',
    description: 'Passagens aéreas para qualquer destino. Compare e economize.',
    images: ['https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
}

export default function PassagensLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
