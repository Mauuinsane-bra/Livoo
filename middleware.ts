import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rotas que requerem autenticação
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/roteiro(.*)',   // roteiro completo requer login
  '/prep(.*)',      // Livoo Prep requer login
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
