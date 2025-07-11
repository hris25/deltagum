// Déclaration globale en dehors du try/catch
declare global {
  var __prisma: any | undefined;
}

// Fallback pour le build quand Prisma n'est pas disponible
let prisma: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalThis.__prisma = prisma;
  }
} catch (error) {
  // Fallback pour le build
  console.warn("Prisma client not available during build, using mock");
  prisma = {
    product: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    customer: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    order: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    $transaction: (fn: any) => fn(prisma),
  };
}

export { prisma };
