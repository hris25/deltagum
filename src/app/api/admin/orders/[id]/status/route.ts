import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID de commande requis" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Statut requis" },
        { status: 400 }
      );
    }

    // Vérifier que le statut est valide
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Statut invalide" },
        { status: 400 }
      );
    }

    console.log(`🔄 Mise à jour du statut de la commande ${orderId} vers ${status}`);

    // Vérifier que la commande existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la commande
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    console.log(`✅ Statut de la commande ${orderId} mis à jour vers ${status}`);

    return NextResponse.json({
      success: true,
      data: {
        order: updatedOrder,
        message: `Statut mis à jour vers ${status}`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
