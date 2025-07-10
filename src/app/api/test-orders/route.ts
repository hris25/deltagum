import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Test Commandes - Début");
    
    // Test 1: Compter toutes les commandes
    console.log("🔍 Test comptage commandes...");
    const totalOrders = await prisma.order.count();
    console.log("📦 Nombre total de commandes:", totalOrders);

    // Test 2: Récupérer toutes les commandes avec détails
    console.log("🔍 Test récupération commandes...");
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            variant: {
              select: {
                id: true,
                flavor: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("📋 Commandes trouvées:", orders.length);
    
    // Test 3: Afficher les détails des commandes
    orders.forEach((order, index) => {
      console.log(`📦 Commande ${index + 1}:`, {
        id: order.id,
        customerId: order.customerId,
        customerEmail: order.customer.email,
        status: order.status,
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        createdAt: order.createdAt
      });
    });

    // Test 4: Compter les clients
    console.log("🔍 Test comptage clients...");
    const totalCustomers = await prisma.customer.count();
    console.log("👥 Nombre total de clients:", totalCustomers);

    // Test 5: Lister les clients
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });

    console.log("👥 Clients trouvés:");
    customers.forEach((customer, index) => {
      console.log(`👤 Client ${index + 1}:`, {
        id: customer.id,
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
        role: customer.role
      });
    });

    const response: ApiResponse = {
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        orders: orders.map(order => ({
          id: order.id,
          customerId: order.customerId,
          customerEmail: order.customer.email,
          status: order.status,
          totalAmount: order.totalAmount,
          itemsCount: order.items.length,
          createdAt: order.createdAt
        })),
        customers: customers
      },
      message: "Test commandes réussi",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erreur test commandes:", error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
