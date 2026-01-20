import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL exists, if not, create a mock prisma client that throws helpful errors
const hasDatabaseUrl = !!process.env.DATABASE_URL

let prismaInstance: PrismaClient | null = null

if (hasDatabaseUrl) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
} else {
  // Create a mock prisma client that throws helpful errors
  prismaInstance = new Proxy({} as PrismaClient, {
    get() {
      throw new Error(
        'Database connection not available. DATABASE_URL is not set. The application is running in mock-data mode.'
      )
    },
  })
}

export const prisma = prismaInstance as PrismaClient

// Helper function to check if database is available
export const isDatabaseAvailable = (): boolean => {
  return hasDatabaseUrl
}

export default prisma
