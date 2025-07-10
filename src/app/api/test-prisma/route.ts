import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Test Prisma - Début");
    
    // Vérifier que Prisma est disponible
    console.log("🔍 Prisma client:", prisma ? "✅ Disponible" : "❌ Undefined");
    
    if (!prisma) {
      const response: ApiResponse = {
        success: false,
        error: "Prisma client non initialisé",
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Test de connexion simple
    console.log("🔍 Test de connexion...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Connexion réussie:", result);

    // Test de comptage des produits
    console.log("🔍 Test comptage produits...");
    const productCount = await prisma.product.count();
    console.log("📦 Nombre de produits:", productCount);

    const response: ApiResponse = {
      success: true,
      data: {
        prismaAvailable: true,
        connectionTest: result,
        productCount,
      },
      message: "Test Prisma réussi",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erreur test Prisma:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
