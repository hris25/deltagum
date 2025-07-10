import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Créer le client Prisma avec gestion d'erreur
let prismaInstance: PrismaClient;

try {
  prismaInstance = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
  console.log("✅ Prisma client créé avec succès");
} catch (error) {
  console.error("❌ Erreur création Prisma client:", error);
  throw error;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalThis.__prisma = prisma;
}
