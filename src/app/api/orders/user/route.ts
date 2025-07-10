import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Fonction pour récupérer l'utilisateur depuis le token
function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    return decoded;
  } catch {
    return null;
  }
}

// GET - Récupérer les commandes de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: user.userId,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
            variant: {
              select: {
                flavor: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculer les statistiques utilisateur
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === "DELIVERED"
    ).length;
    const totalSpent = orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const averageOrderValue =
      completedOrders > 0 ? totalSpent / completedOrders : 0;

    return NextResponse.json({
      success: true,
      data: {
        orders,
        stats: {
          totalOrders,
          completedOrders,
          totalSpent,
          averageOrderValue,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
