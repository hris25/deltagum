import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Paramètres de filtrage
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFilter = searchParams.get("dateFilter");
    
    console.log("🔍 [API] Récupération des commandes admin avec paramètres:", {
      page,
      limit,
      skip,
      status,
      search,
      dateFilter,
    });

    // Construction des filtres
    const where: any = {};
    
    // Filtre par statut
    if (status && status !== "ALL") {
      where.status = status;
    }
    
    // Filtre par recherche (client, email, ID)
    if (search) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          customer: {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          customer: {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          customer: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }
    
    // Filtre par date
    if (dateFilter && dateFilter !== "ALL") {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case "TODAY":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          where.createdAt = {
            gte: startDate,
          };
          break;
        case "WEEK":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          where.createdAt = {
            gte: startDate,
          };
          break;
        case "MONTH":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          where.createdAt = {
            gte: startDate,
          };
          break;
      }
    }

    console.log("🔍 [API] Filtres construits:", JSON.stringify(where, null, 2));

    // Récupération des commandes avec pagination
    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  flavor: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where,
      }),
    ]);

    console.log("✅ [API] Commandes récupérées:", {
      count: orders.length,
      total: totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
    });

    return NextResponse.json({
      success: true,
      data: {
        orders,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ [API] Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des commandes",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
