import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Livoo Prep — Documentação de Viagem',
  description: 'Verifique tudo que precisa para sua viagem internacional: visto, passaporte, vacinas e restrições de entrada. Checklist completo por destino.',
  openGraph: {
    title: 'Livoo Prep — Documentação | Go Livoo',
    description: 'Checklist completo de documentação por destino. Visto, passaporte, vacinas.',
    images: ['https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
}

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
