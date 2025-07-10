import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { ApiResponse, ProductsResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const where = active === "true" ? { active: true } : {};
    const take = limit ? parseInt(limit) : undefined;
    const skip = offset ? parseInt(offset) : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: {
            orderBy: { flavor: "asc" },
          },
          priceTiers: {
            orderBy: { quantity: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    const response: ApiResponse<ProductsResponse> = {
      success: true,
      data: {
        products: products as any,
        total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    console.log("Utilisation des données de démonstration...");

    // En cas d'erreur de base de données, utiliser les données mockées
    const mockData = {
      success: true,
      data: {
        products: [
          {
            id: "1",
            name: "Bonbons Delta-9",
            description:
              "Nos délicieux bonbons Delta-9 aux saveurs naturelles. Parfait pour une expérience relaxante et savoureuse.",
            image: "/img/product/packaging-group-deltagum.jpg",
            basePrice: 12.0,
            dosage: "10mg",
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            priceTiers: [
              {
                id: "1",
                productId: "1",
                quantity: 1,
                price: 12.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: "2",
                productId: "1",
                quantity: 3,
                price: 30.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: "3",
                productId: "1",
                quantity: 5,
                price: 45.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            variants: [
              {
                id: "1",
                productId: "1",
                flavor: "fraise",
                color: "#ff6b6b",
                stock: 50,
                images: [
                  "/img/product/deltagum-fraise-main1.png",
                  "/img/product/deltagum-fraise-main2.png",
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: "2",
                productId: "1",
                flavor: "myrtille",
                color: "#4ecdc4",
                stock: 45,
                images: [
                  "/img/product/deltagum-myrtille-main1.png",
                  "/img/product/deltagum-myrtille-main2.png",
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: "3",
                productId: "1",
                flavor: "pomme",
                color: "#95e1d3",
                stock: 40,
                images: [
                  "/img/product/deltagum-apple-main1.png",
                  "/img/product/deltagum-apple-main2.png",
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: "2",
            name: "Cookies Delta-9",
            description:
              "Délicieux cookies Delta-9 pour une expérience gourmande unique. Parfait pour accompagner votre pause détente.",
            image: "/img/product/packaging-group-cookie.png",
            basePrice: 15.0,
            dosage: "15mg",
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            priceTiers: [
              {
                id: "4",
                productId: "2",
                quantity: 1,
                price: 15.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: "5",
                productId: "2",
                quantity: 3,
                price: 40.0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            variants: [
              {
                id: "4",
                productId: "2",
                flavor: "chocolat",
                color: "#8b4513",
                stock: 30,
                images: ["/img/product/cookie.png"],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
        ],
        total: 2,
      },
    };

    return NextResponse.json(mockData);
  }
}

// POST /api/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = productSchema.parse(body);

    // Préparer les données pour Prisma (exclure les champs non-DB)
    const { variants, pricingTiers, ...productData } = validatedData;

    // Ajouter les champs requis
    const productDataWithRequired = {
      ...productData,
      id: globalThis.crypto.randomUUID(),
      updatedAt: new Date(),
    };

    // Créer le produit avec ses variantes et prix en transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer le produit
      const product = await tx.product.create({
        data: productDataWithRequired,
      });

      // Créer les variantes si elles existent
      if (variants && Array.isArray(variants) && variants.length > 0) {
        for (const variantData of variants) {
          // Générer un SKU unique si non fourni
          if (!variantData.sku) {
            const skuBase = `${product.name
              .substring(0, 3)
              .toUpperCase()}-${variantData.flavor.toUpperCase()}`;
            variantData.sku = `${skuBase}-${Date.now()}`;
          }

          await tx.productVariant.create({
            data: {
              ...variantData,
              productId: product.id,
            },
          });
        }
      }

      // Créer les prix par palier si ils existent
      if (
        pricingTiers &&
        Array.isArray(pricingTiers) &&
        pricingTiers.length > 0
      ) {
        for (const tierData of pricingTiers) {
          await tx.priceTier.create({
            data: {
              ...tierData,
              productId: product.id,
            },
          });
        }
      }

      // Retourner le produit complet
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: true,
          priceTiers: true,
        },
      });
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Produit créé avec succès",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du produit",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
