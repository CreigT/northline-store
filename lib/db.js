import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export function slugOk(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug || "")) && slug.length <= 48;
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not set. Database calls are blocked.");
    error.status = 503;
    throw error;
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
