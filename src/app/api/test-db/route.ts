import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test simple de connexion à la base de données
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      result: result,
    });
  } catch (error: unknown) {
    console.error("Erreur de connexion à la base de données:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur de connexion à la base de données",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
