import { prisma } from "@/lib/prisma";
import { productVariantSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[id]/variants/[variantId] - Récupérer une variante spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id, variantId } = await params;
  try {
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id,
      },
      include: {
        product: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (!variant) {
      const response: ApiResponse = {
        success: false,
        error: "Variante non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: variant,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching variant:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération de la variante",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/products/[id]/variants/[variantId] - Mettre à jour une variante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id, variantId } = await params;
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = productVariantSchema.parse({
      ...body,
      productId: id,
    });

    // Vérifier que la variante existe
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id,
      },
    });

    if (!existingVariant) {
      const response: ApiResponse = {
        success: false,
        error: "Variante non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Mettre à jour la variante
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: validatedData,
    });

    const response: ApiResponse = {
      success: true,
      data: variant,
      message: "Variante mise à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating variant:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour de la variante",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/products/[id]/variants/[variantId] - Supprimer une variante
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id, variantId } = await params;
  try {
    // Vérifier que la variante existe
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id,
      },
    });

    if (!existingVariant) {
      const response: ApiResponse = {
        success: false,
        error: "Variante non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Vérifier s'il y a des commandes liées à cette variante
    const orderItems = await prisma.orderItem.findMany({
      where: { variantId },
    });

    if (orderItems.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: "Impossible de supprimer cette variante car elle est liée à des commandes",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Supprimer la variante
    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    const response: ApiResponse = {
      success: true,
      message: "Variante supprimée avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting variant:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la suppression de la variante",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/products/[id]/variants/[variantId] - Mise à jour partielle (ex: stock)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { id, variantId } = await params;
  try {
    const body = await request.json();

    // Vérifier que la variante existe
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: id,
      },
    });

    if (!existingVariant) {
      const response: ApiResponse = {
        success: false,
        error: "Variante non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Mise à jour partielle
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: body,
    });

    const response: ApiResponse = {
      success: true,
      data: variant,
      message: "Variante mise à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error patching variant:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la mise à jour de la variante",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
