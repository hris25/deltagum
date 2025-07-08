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
        products,
        total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération des produits",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = productSchema.parse(body);

    // Transformer price en basePrice pour Prisma
    const { price, ...otherData } = validatedData;
    const productData = {
      ...otherData,
      basePrice: price,
    };

    const product = await prisma.product.create({
      data: productData,
      include: {
        variants: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: product,
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
