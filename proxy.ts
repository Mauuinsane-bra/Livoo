import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rotas que requerem autenticação
// Nota (13/mai/2026): /roteiro foi REMOVIDA daqui — preview gratuito do roteiro
// deve ser acessível sem login. A proteção do roteiro pago (R$19,90) acontece
// no /api/roteiro/checkout (Stripe), não no middleware. Ver CLAUDE.md.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/meus-roteiros(.*)',  // histórico do usuário — requer login
  '/prep(.*)',           // Livoo Prep requer login
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
