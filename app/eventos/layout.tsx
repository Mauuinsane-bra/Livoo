import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos Internacionais',
  description: 'Encontre os maiores eventos do mundo — F1, festivais de música, Oktoberfest, Copa do Mundo e mais. Monte o roteiro completo com voo e hotel incluídos.',
  openGraph: {
    title: 'Eventos Internacionais | Go Livoo',
    description: 'GP de Mônaco, Rock in Rio, Oktoberfest e muito mais. Voo + hotel + ingresso.',
    images: ['https://images.unsplash.com/photo-1521547480571-2b6061babf76?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
}

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
