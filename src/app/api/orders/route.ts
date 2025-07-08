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
    const body = await request.json();

    // Validation des données
    const validatedData = createOrderSchema.parse(body);

    // Calculer le montant total
    let totalAmount = 0;
    const orderItems: Array<{
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
        throw new Error(`Produit ${item.productId} non trouvé`);
      }

      const itemPrice = Number((product as any).basePrice);
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Créer la commande avec transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          customerId: validatedData.customerId,
          status: "PENDING",
          totalAmount,
          shippingAddress: validatedData.shippingAddress,
          items: {
            create: orderItems,
          },
        },
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
