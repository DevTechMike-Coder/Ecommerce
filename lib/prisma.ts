import { PrismaClient } from '@prisma/client'

// Add prisma to the NodeJS global type
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if a Prisma instance already exists on the global object
// to reuse it, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma