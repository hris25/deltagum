import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// POST /api/seed - Créer des données de test
export async function POST(request: NextRequest) {
  try {
    // Vérifier si des produits existent déjà
    const existingProducts = await prisma.product.count();

    if (existingProducts > 0) {
      const response: ApiResponse = {
        success: false,
        error: "Des produits existent déjà dans la base de données",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Créer des produits de test
    const products = await prisma.$transaction(async (tx) => {
      // Produit 1: Bonbons Delta-9
      const product1 = await tx.product.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          name: "Bonbons Delta-9",
          description:
            "Nos délicieux bonbons Delta-9 aux saveurs naturelles. Parfait pour une expérience relaxante et savoureuse.",
          image: "/img/product/packaging-group-deltagum.jpg",
          basePrice: 12.0,
          dosage: "10mg",
          active: true,
          updatedAt: new Date(),
        },
      });

      // Variantes pour Bonbons Delta-9
      await tx.productVariant.createMany({
        data: [
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            flavor: "STRAWBERRY",
            color: "#ff6b9d",
            stock: 50,
            sku: `BON-FRAISE-${Date.now()}`,
            images: [
              "/img/product/deltagum-fraise-main1.jpg",
              "/img/product/deltagum-fraise-main2.jpg",
            ],
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            flavor: "BLUEBERRY",
            color: "#6b73ff",
            stock: 45,
            sku: `BON-MYRTILLE-${Date.now()}`,
            images: [
              "/img/product/deltagum-myrtille-main1.jpg",
              "/img/product/deltagum-myrtille-main2.jpg",
            ],
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            flavor: "APPLE",
            color: "#9dff6b",
            stock: 40,
            sku: `BON-POMME-${Date.now()}`,
            images: [
              "/img/product/deltagum-pomme-main1.jpg",
              "/img/product/deltagum-pomme-main2.jpg",
            ],
            updatedAt: new Date(),
          },
        ],
      });

      // Prix par palier pour Bonbons Delta-9
      await tx.priceTier.createMany({
        data: [
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            quantity: 1,
            price: 12.0,
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            quantity: 3,
            price: 30.0,
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product1.id,
            quantity: 5,
            price: 45.0,
            updatedAt: new Date(),
          },
        ],
      });

      // Produit 2: Cookies Delta-9
      const product2 = await tx.product.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          name: "Cookies Delta-9",
          description:
            "Nos cookies artisanaux infusés au Delta-9. Une texture moelleuse et un goût authentique pour une expérience unique.",
          image: "/img/product/packaging-group-deltagum.jpg",
          basePrice: 15.0,
          dosage: "15mg",
          active: true,
          updatedAt: new Date(),
        },
      });

      // Variantes pour Cookies Delta-9
      await tx.productVariant.createMany({
        data: [
          {
            id: globalThis.crypto.randomUUID(),
            productId: product2.id,
            flavor: "CHOCOLATE",
            color: "#8b4513",
            stock: 30,
            sku: `COO-CHOCOLAT-${Date.now()}`,
            images: ["/img/product/cookie.png"],
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product2.id,
            flavor: "VANILLA",
            color: "#f5deb3",
            stock: 25,
            sku: `COO-VANILLE-${Date.now()}`,
            images: ["/img/product/cookie.png"],
            updatedAt: new Date(),
          },
        ],
      });

      // Prix par palier pour Cookies Delta-9
      await tx.priceTier.createMany({
        data: [
          {
            id: globalThis.crypto.randomUUID(),
            productId: product2.id,
            quantity: 1,
            price: 15.0,
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product2.id,
            quantity: 2,
            price: 25.0,
            updatedAt: new Date(),
          },
          {
            id: globalThis.crypto.randomUUID(),
            productId: product2.id,
            quantity: 4,
            price: 45.0,
            updatedAt: new Date(),
          },
        ],
      });

      return [product1, product2];
    });

    // Créer un client de test
    const testCustomer = await prisma.customer.create({
      data: {
        id: globalThis.crypto.randomUUID(),
        email: "test@deltagum.com",
        password: "test123", // En production, ceci devrait être hashé
        firstName: "Test",
        lastName: "User",
        phone: "0123456789",
        address: "123 Rue de Test",
        postalCode: "75001",
        city: "Paris",
        role: "USER",
        updatedAt: new Date(),
      },
    });

    const response: ApiResponse = {
      success: true,
      data: {
        products: products.length,
        customer: testCustomer.id,
      },
      message: `${products.length} produits et 1 client de test créés avec succès`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error seeding database:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de l'initialisation",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/seed - Vérifier l'état de la base de données
export async function GET() {
  try {
    const [productCount, customerCount, orderCount] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
    ]);

    const response: ApiResponse = {
      success: true,
      data: {
        products: productCount,
        customers: customerCount,
        orders: orderCount,
        isEmpty: productCount === 0 && customerCount === 0 && orderCount === 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking database:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la vérification de la base de données",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/seed - Nettoyer la base de données (développement uniquement)
export async function DELETE() {
  if (process.env.NODE_ENV !== "development") {
    const response: ApiResponse = {
      success: false,
      error: "Cette action n'est disponible qu'en mode développement",
    };
    return NextResponse.json(response, { status: 403 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.priceTier.deleteMany();
      await tx.productVariant.deleteMany();
      await tx.product.deleteMany();
      await tx.customer.deleteMany();
    });

    const response: ApiResponse = {
      success: true,
      message: "Base de données nettoyée avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error cleaning database:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors du nettoyage de la base de données",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
