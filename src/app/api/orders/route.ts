import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders - Récupérer les commandes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const take = limit ? parseInt(limit) : undefined;
    const skip = offset ? parseInt(offset) : undefined;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    const response: ApiResponse = {
      success: true,
      data: { orders, total },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération des commandes",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/orders - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    // Vérifier que la requête a un corps
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const response: ApiResponse = {
        success: false,
        error: "Content-Type doit être application/json",
      };
      return NextResponse.json(response, { status: 400 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError);
      const response: ApiResponse = {
        success: false,
        error: "Corps de requête JSON invalide",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      const response: ApiResponse = {
        success: false,
        error: "Corps de requête manquant ou invalide",
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log("📦 Données reçues pour création de commande:", body);

    // Debug: Vérifier que Prisma est disponible
    console.log("🔍 Prisma client:", prisma ? "✅ Disponible" : "❌ Undefined");
    console.log(
      "🔍 Prisma product:",
      prisma?.product ? "✅ Disponible" : "❌ Undefined"
    );

    if (!prisma) {
      throw new Error("Prisma client non initialisé");
    }

    // Validation des données
    const validatedData = createOrderSchema.parse(body);

    // Calculer le montant total
    let totalAmount = 0;
    const orderItems: Array<{
      id: string;
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        console.error(
          `Produit ${item.productId} non trouvé. Articles disponibles:`,
          await prisma.product.findMany({ select: { id: true, name: true } })
        );
        throw new Error(
          `Produit ${item.productId} non trouvé. Vérifiez que les produits existent en base de données.`
        );
      }

      // Utiliser le prix du panier s'il est fourni, sinon utiliser le basePrice
      const itemPrice = item.price
        ? Number(item.price)
        : Number((product as any).basePrice);
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      console.log(`📦 Création commande - Item: ${product.name}`);
      console.log(`💰 Prix reçu du panier: ${item.price || "non fourni"}€`);
      console.log(`💰 Prix de base produit: ${product.basePrice}€`);
      console.log(`💰 Prix utilisé: ${itemPrice}€`);
      console.log(`🔢 Quantité: ${item.quantity}`);
      console.log(`💵 Total item: ${itemTotal}€`);

      orderItems.push({
        id: globalThis.crypto.randomUUID(),
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Gérer le client (créer un client temporaire si nécessaire)
    let customerId = validatedData.customerId;

    if (!customerId) {
      // Vérifier si un client avec cet email existe déjà
      const email =
        validatedData.shippingAddress.email ||
        `guest-${Date.now()}@deltagum.com`;

      const existingCustomer = await prisma.customer.findUnique({
        where: { email },
      });

      if (existingCustomer) {
        console.log(
          `Client existant trouvé avec email ${email}, utilisation du client existant`
        );
        customerId = existingCustomer.id;
      } else {
        // Créer un client temporaire pour les commandes invités
        const tempCustomer = await prisma.customer.create({
          data: {
            id: globalThis.crypto.randomUUID(),
            email,
            password: "", // Mot de passe vide pour les invités
            firstName: validatedData.shippingAddress.firstName,
            lastName: validatedData.shippingAddress.lastName,
            phone: validatedData.shippingAddress.phone || "",
            address: validatedData.shippingAddress.street || "",
            postalCode: validatedData.shippingAddress.postalCode,
            city: validatedData.shippingAddress.city,
            updatedAt: new Date(),
          },
        });
        customerId = tempCustomer.id;
        console.log(`Nouveau client temporaire créé avec email ${email}`);
      }
    } else {
      // Vérifier que le client existe
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!existingCustomer) {
        console.error(
          `Client ${customerId} non trouvé. Création d'un client temporaire.`
        );
        // Créer un client temporaire si le client spécifié n'existe pas
        const tempCustomer = await prisma.customer.create({
          data: {
            id: globalThis.crypto.randomUUID(),
            email:
              validatedData.shippingAddress.email ||
              `guest-${Date.now()}@deltagum.com`,
            password: "",
            firstName: validatedData.shippingAddress.firstName,
            lastName: validatedData.shippingAddress.lastName,
            phone: validatedData.shippingAddress.phone || "",
            address: validatedData.shippingAddress.street || "",
            postalCode: validatedData.shippingAddress.postalCode,
            city: validatedData.shippingAddress.city,
            updatedAt: new Date(),
          },
        });
        customerId = tempCustomer.id;
      }
    }

    // Créer la commande avec transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Créer la commande
      const orderId = globalThis.crypto.randomUUID();
      const newOrder = await tx.order.create({
        data: {
          id: orderId,
          customerId,
          status: "PENDING",
          totalAmount: validatedData.totalAmount || totalAmount,
          shippingAddress: validatedData.shippingAddress,
          updatedAt: new Date(),
          items: {
            create: orderItems,
          },
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

      // Mettre à jour le stock des variantes
      for (const item of validatedData.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    const response: ApiResponse = {
      success: true,
      data: order,
      message: "Commande créée avec succès",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la commande",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
