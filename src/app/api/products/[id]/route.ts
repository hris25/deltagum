import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { flavor: "asc" },
        },
      },
    });

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: "Produit non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching product:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération du produit",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/products/[id] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        variants: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: product,
      message: "Produit mis à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating product:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du produit",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/products/[id] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: "Produit supprimé avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting product:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la suppression du produit",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
