import { SignIn } from '@clerk/nextjs'

export default function EntrarPage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1A3A6E 100%)',
      padding: '40px 24px',
    }}>
      <SignIn
        path="/entrar"
        routing="path"
        signUpUrl="/cadastro"
        afterSignInUrl="/"
      />
    </div>
  )
}
