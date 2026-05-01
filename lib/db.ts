// lib/db.ts
// Cliente Prisma — banco de dados local SQLite
// Em produção: trocar DATABASE_URL para postgresql://...

import { PrismaClient } from '@prisma/client'

// Evita criar múltiplas instâncias em desenvolvimento (hot reload do Next.js)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ── Helpers de Waitlist ────────────────────────────────

export async function addToWaitlist(data: {
  name: string
  email: string
  interests?: string[]
}) {
  return prisma.waitlist.create({
    data: {
      name:      data.name,
      email:     data.email,
      interests: JSON.stringify(data.interests ?? []),
    },
  })
}

export async function getWaitlistByEmail(email: string) {
  return prisma.waitlist.findUnique({ where: { email } })
}

export async function getAllWaitlist() {
  const entries = await prisma.waitlist.findMany({ orderBy: { createdAt: 'desc' } })
  return entries.map(e => ({
    ...e,
    interests: JSON.parse(e.interests) as string[],
  }))
}

// ── Helpers de Itinerários ────────────────────────────

export async function saveItinerary(data: {
  userId?: string
  prompt: string
  parsedData?: Record<string, unknown>
}) {
  return prisma.itinerary.create({
    data: {
      userId:     data.userId,
      prompt:     data.prompt,
      parsedData: JSON.stringify(data.parsedData ?? {}),
    },
  })
}

// ── Helpers de Prep Check ────────────────────────────

export async function savePrepCheck(data: {
  userId?: string
  nationality: string
  destination: string
  destinationName?: string
  result?: Record<string, unknown>
}) {
  return prisma.prepCheck.create({
    data: {
      userId:          data.userId,
      nationality:     data.nationality,
      destination:     data.destination,
      destinationName: data.destinationName,
      result:          JSON.stringify(data.result ?? {}),
    },
  })
}
