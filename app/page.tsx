import { redirect } from 'next/navigation'

// A tela inicial abre como Promoções (decisão do produto).
// Para voltar à home de marketing, reverter este arquivo (conteúdo preservado no git).
export default function Home() {
  redirect('/promocoes')
}
