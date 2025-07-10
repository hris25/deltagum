import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test de connexion à la base de données
    const startTime = Date.now();

    // Test simple de requête
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    const duration = Date.now() - startTime;

    // Test des tables principales
    const [productsCount, customersCount, ordersCount] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      data: {
        connectionTime: duration,
        tables: {
          products: productsCount,
          customers: customersCount,
          orders: ordersCount,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erreur de test de base de données:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur de connexion à la base de données",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
