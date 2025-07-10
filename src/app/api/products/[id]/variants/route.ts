import { prisma } from "@/lib/prisma";
import { productVariantSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[id]/variants - Récupérer toutes les variantes d'un produit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { flavor: "asc" },
    });

    const response: ApiResponse = {
      success: true,
      data: variants,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching variants:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération des variantes",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/products/[id]/variants - Créer une nouvelle variante
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = productVariantSchema.parse({
      ...body,
      productId: id,
    });

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: "Produit non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Générer un SKU unique si non fourni
    if (!validatedData.sku) {
      const skuBase = `${product.name
        .substring(0, 3)
        .toUpperCase()}-${validatedData.flavor.toUpperCase()}`;
      const existingVariants = await prisma.productVariant.findMany({
        where: { sku: { startsWith: skuBase } },
      });
      validatedData.sku = `${skuBase}-${existingVariants.length + 1}`;
    }

    const variant = await prisma.productVariant.create({
      data: {
        ...validatedData,
        id: globalThis.crypto.randomUUID(),
        sku:
          validatedData.sku ||
          `VAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        updatedAt: new Date(),
      },
    });

    const response: ApiResponse = {
      success: true,
      data: variant,
      message: "Variante créée avec succès",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating variant:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la variante",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// PUT /api/products/[id]/variants - Mettre à jour plusieurs variantes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { variants } = body;

    if (!Array.isArray(variants)) {
      const response: ApiResponse = {
        success: false,
        error: "Format de données invalide",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: "Produit non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Traitement en transaction
    const result = await prisma.$transaction(async (tx) => {
      // Supprimer les anciennes variantes
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // Créer les nouvelles variantes
      const createdVariants: any[] = [];
      for (const variantData of variants) {
        const validatedData = productVariantSchema.parse({
          ...variantData,
          productId: id,
        });

        // Générer un SKU unique si non fourni
        if (!validatedData.sku) {
          const skuBase = `${product.name
            .substring(0, 3)
            .toUpperCase()}-${validatedData.flavor.toUpperCase()}`;
          validatedData.sku = `${skuBase}-${Date.now()}`;
        }

        const variant = await tx.productVariant.create({
          data: {
            ...validatedData,
            id: globalThis.crypto.randomUUID(),
            sku:
              validatedData.sku ||
              `VAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            updatedAt: new Date(),
          },
        });
        createdVariants.push(variant);
      }

      return createdVariants;
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Variantes mises à jour avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating variants:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour des variantes",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/products/[id]/variants - Supprimer toutes les variantes d'un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    const response: ApiResponse = {
      success: true,
      message: "Toutes les variantes ont été supprimées",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting variants:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la suppression des variantes",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
