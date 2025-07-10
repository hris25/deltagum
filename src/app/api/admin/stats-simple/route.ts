import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📊 Récupération des statistiques simplifiées...");

    // Récupérer les statistiques de base
    const productsCount = await prisma.product.count({
      where: { active: true },
    });

    const ordersCount = await prisma.order.count();

    const customersCount = await prisma.customer.count({
      where: { role: "USER" },
    });

    // Revenus totaux (commandes livrées uniquement)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { 
        status: {
          in: ["PAID", "SHIPPED", "DELIVERED"]
        }
      },
    });

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    const stats = {
      overview: {
        products: productsCount,
        orders: ordersCount,
        customers: customersCount,
        revenue: totalRevenue,
        ordersGrowth: 0,
      },
      recentOrders: [],
      topProducts: [],
      monthlyStats: [],
    };

    console.log("✅ Statistiques simplifiées:", stats.overview);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error);

    // Retourner des données de fallback en cas d'erreur
    const fallbackStats = {
      overview: {
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
        ordersGrowth: 0,
      },
      recentOrders: [],
      topProducts: [],
      monthlyStats: [],
    };

    return NextResponse.json({
      success: true,
      data: fallbackStats,
      fallback: true,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
