import { sendOrderConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { calculatePointsFromAmount } from "@/lib/utils";
import { updateOrderStatusSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders/[id] - Récupérer une commande par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
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
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: "Commande non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching order:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération de la commande",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Mettre à jour le statut d'une commande
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = updateOrderStatusSchema.parse({
      orderId: id,
      ...body,
    });

    const order = await prisma.$transaction(async (tx: any) => {
      // Mettre à jour la commande
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: validatedData.status },
        include: {
          customer: {
            include: { loyalty: true },
          },
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Si la commande passe à PAID, ajouter des points de fidélité
      if (validatedData.status === "PAID" && updatedOrder.customer.loyalty) {
        const pointsToAdd = calculatePointsFromAmount(
          Number(updatedOrder.totalAmount)
        );

        await tx.loyaltyProgram.update({
          where: { customerId: updatedOrder.customerId },
          data: {
            points: {
              increment: pointsToAdd,
            },
          },
        });

        // Envoyer l'email de confirmation
        try {
          await sendOrderConfirmation(updatedOrder.customer.email, {
            orderId: updatedOrder.id,
            customerName: `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`,
            totalAmount: Number(updatedOrder.totalAmount),
            items: updatedOrder.items.map((item: any) => ({
              name: item.product.name,
              flavor: item.variant.flavor,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Ne pas faire échouer la transaction pour un problème d'email
        }
      }

      return updatedOrder;
    });

    const response: ApiResponse = {
      success: true,
      data: order,
      message: "Statut de la commande mis à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating order status:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du statut",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
