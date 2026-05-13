import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monte seu Roteiro de Viagem',
  description: 'Descreva a experiência que você quer viver e receba um roteiro completo dia a dia — voos, hotel, ingressos e documentação incluídos. Grátis para começar.',
  openGraph: {
    title: 'Monte seu Roteiro de Viagem | Go Livoo',
    description: 'Você descreve a experiência. A Go Livoo monta o roteiro completo.',
    images: ['https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
}

export default function RoteiroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
