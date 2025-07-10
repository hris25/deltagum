import { prisma } from "@/lib/prisma";
import { calculateLoyaltyLevel } from "@/lib/utils";
import { customerSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/customers/[id] - Récupérer un client par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      const response: ApiResponse = {
        success: false,
        error: "Client non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: customer,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customer:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération du client",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/customers/[id] - Mettre à jour un client
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validation des données (partielle)
    const validatedData = customerSchema.partial().parse(body);

    const customer = await prisma.$transaction(async (tx: any) => {
      // Mettre à jour le client
      const updatedCustomer = await tx.customer.update({
        where: { id },
        data: validatedData,
        include: {
          loyalty: true,
        },
      });

      // Si le client a un programme de fidélité, vérifier le niveau
      if (updatedCustomer.loyalty) {
        const newLevel = calculateLoyaltyLevel(updatedCustomer.loyalty.points);

        if (newLevel !== updatedCustomer.loyalty.level) {
          await tx.loyaltyProgram.update({
            where: { customerId: id },
            data: { level: newLevel },
          });
        }
      }

      return await tx.customer.findUnique({
        where: { id },
        include: {
          loyalty: true,
          orders: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });
    });

    const response: ApiResponse = {
      success: true,
      data: customer,
      message: "Client mis à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating customer:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du client",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/customers/[id] - Supprimer un client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.customer.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: "Client supprimé avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting customer:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la suppression du client",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
