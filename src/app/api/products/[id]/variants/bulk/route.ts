import { prisma } from "@/lib/prisma";
import { productVariantSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// POST /api/products/[id]/variants/bulk - Mise à jour en lot des variantes
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { variants, action } = body;

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

    let result: any;

    switch (action) {
      case "replace":
        // Remplacer toutes les variantes
        result = await prisma.$transaction(async (tx) => {
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
              validatedData.sku = `${skuBase}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 5)}`;
            }

            const variant = await tx.productVariant.create({
              data: {
                ...validatedData,
                id: globalThis.crypto.randomUUID(),
                sku:
                  validatedData.sku ||
                  `VAR-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 11)}`,
                updatedAt: new Date(),
              },
            });
            createdVariants.push(variant);
          }

          return createdVariants;
        });
        break;

      case "update_stock":
        // Mettre à jour uniquement le stock
        result = await prisma.$transaction(async (tx) => {
          const updatedVariants: any[] = [];
          for (const variantData of variants) {
            if (variantData.id) {
              const variant = await tx.productVariant.update({
                where: { id: variantData.id },
                data: { stock: variantData.stock },
              });
              updatedVariants.push(variant);
            }
          }
          return updatedVariants;
        });
        break;

      case "create_multiple":
        // Créer plusieurs variantes
        result = await prisma.$transaction(async (tx) => {
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
              validatedData.sku = `${skuBase}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 5)}`;
            }

            const variant = await tx.productVariant.create({
              data: {
                ...validatedData,
                id: globalThis.crypto.randomUUID(),
                sku:
                  validatedData.sku ||
                  `VAR-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 11)}`,
                updatedAt: new Date(),
              },
            });
            createdVariants.push(variant);
          }
          return createdVariants;
        });
        break;

      default:
        const response: ApiResponse = {
          success: false,
          error: "Action non supportée",
        };
        return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Variantes ${
        action === "replace"
          ? "remplacées"
          : action === "update_stock"
          ? "mises à jour"
          : "créées"
      } avec succès`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in bulk variant operation:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de l'opération en lot",
    };

    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/products/[id]/variants/bulk - Suppression en lot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { variantIds } = body;

    if (!Array.isArray(variantIds)) {
      const response: ApiResponse = {
        success: false,
        error: "Format de données invalide",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Vérifier s'il y a des commandes liées à ces variantes
    const orderItems = await prisma.orderItem.findMany({
      where: { variantId: { in: variantIds } },
    });

    if (orderItems.length > 0) {
      const response: ApiResponse = {
        success: false,
        error:
          "Impossible de supprimer ces variantes car elles sont liées à des commandes",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Supprimer les variantes
    const result = await prisma.productVariant.deleteMany({
      where: {
        id: { in: variantIds },
        productId: id,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { deletedCount: result.count },
      message: `${result.count} variante(s) supprimée(s) avec succès`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in bulk variant deletion:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la suppression en lot",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
