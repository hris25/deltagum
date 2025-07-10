import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Test de l'API des statistiques...");

    // Tester l'API des statistiques
    const response = await fetch("http://localhost:3000/api/admin/stats");
    const data = await response.json();

    console.log("📊 Réponse API stats:", data);

    return NextResponse.json({
      success: true,
      message: "Test des statistiques réussi",
      data: data,
    });
  } catch (error) {
    console.error("❌ Erreur test stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du test des statistiques",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
