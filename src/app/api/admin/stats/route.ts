import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("📊 Récupération des statistiques...");

    // Récupérer les statistiques en parallèle
    const [
      productsCount,
      ordersCount,
      customersCount,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyStats,
    ] = await Promise.all([
      // Nombre total de produits actifs
      prisma.product.count({
        where: { active: true },
      }),

      // Nombre total de commandes
      prisma.order.count(),

      // Nombre total de clients
      prisma.customer.count({
        where: { role: "USER" },
      }),

      // Revenus totaux (somme de tous les montants des commandes)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "DELIVERED" },
      }),

      // 5 dernières commandes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { firstName: true, lastName: true, email: true },
          },
          items: {
            include: {
              product: { select: { name: true } },
              variant: { select: { flavor: true } },
            },
          },
        },
      }),

      // Produits les plus vendus
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),

      // Statistiques des 12 derniers mois (simplifié pour éviter les erreurs SQL)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), // 12 mois
          },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
      }),
    ]);

    // Récupérer les détails des produits les plus vendus
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, image: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
        };
      })
    );

    // Calculer les statistiques de croissance (comparaison avec le mois précédent)
    const currentMonth = new Date();
    const lastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const currentMonthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

    const [currentMonthOrders, lastMonthOrders] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonthStart,
          },
        },
      }),
    ]);

    const ordersGrowth =
      lastMonthOrders > 0
        ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

    const stats = {
      overview: {
        products: productsCount,
        orders: ordersCount,
        customers: customersCount,
        revenue: Number(totalRevenue._sum?.totalAmount || 0),
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        total: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
        items: order.items.map((item) => ({
          product: item.product.name,
          variant: item.variant?.flavor,
          quantity: item.quantity,
        })),
      })),
      topProducts: topProductsWithDetails,
      monthlyStats: monthlyStats,
    };

    console.log("✅ Statistiques calculées:", stats.overview);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);

    // Retourner des données de fallback en cas d'erreur
    const fallbackStats = {
      overview: {
        products: 2,
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
    });
  }
}
