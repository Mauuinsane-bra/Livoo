import { SignUp } from '@clerk/nextjs'

export default function CadastroPage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)',
      padding: '40px 24px',
    }}>
      <SignUp
        path="/cadastro"
        routing="path"
        signInUrl="/entrar"
        afterSignUpUrl="/"
      />
    </div>
  )
}
