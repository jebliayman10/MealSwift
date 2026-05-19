import { PrismaClient } from "@prisma/client";

// Singleton pattern: in dev, Next.js hot-reload would otherwise create a new
// PrismaClient on every reload and exhaust the connection pool. In serverless
// (Vercel) this keeps one client per warm instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
