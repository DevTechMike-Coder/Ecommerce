import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(
  pool as unknown as ConstructorParameters<typeof PrismaPg>[0]
);

// Add prisma to the NodeJS global type
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if a Prisma instance already exists on the global object
// to reuse it, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
