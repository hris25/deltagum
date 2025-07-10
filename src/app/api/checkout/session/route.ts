import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schéma simple pour créer une session à partir d'une commande existante
const createSessionSchema = z.object({
  orderId: z.string().min(1, "ID de commande requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const { orderId } = createSessionSchema.parse(body);

    // Récupérer la commande avec tous les détails
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: "Commande non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Vérifier que la commande n'a pas déjà été payée
    if (order.status === "PAID") {
      const response: ApiResponse = {
        success: false,
        error: "Cette commande a déjà été payée",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Créer les line items pour Stripe
    const lineItems: any[] = [];

    for (const item of order.items) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.product.name} - ${
              item.variant?.flavor || "Standard"
            }`,
            description: item.product.description,
            images: item.product.image
              ? [
                  item.product.image.startsWith("http")
                    ? item.product.image
                    : `${process.env.NEXTAUTH_URL}${item.product.image}`,
                ]
              : [],
            metadata: {
              productId: item.productId,
              variantId: item.variantId,
            },
          },
          unit_amount: Math.round(Number(item.price) * 100), // Prix en centimes
        },
        quantity: item.quantity,
      });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: order.customer.email,
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      metadata: {
        orderId: order.id,
        customerId: order.customerId,
      },
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
      },
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        shipping_address: {
          message:
            "Veuillez indiquer votre adresse de livraison pour vos délicieux bonbons Deltagum !",
        },
      },
      // Pré-remplir les informations client si disponibles
      customer_creation: "if_required",
      ...(order.customer.firstName &&
        order.customer.lastName && {
          custom_fields: [
            {
              key: "customer_name",
              label: {
                type: "custom",
                custom: "Nom complet",
              },
              type: "text",
              optional: false,
            },
          ],
        }),
    });

    // Mettre à jour la commande avec l'ID de session (statut reste PENDING)
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: session.id,
        // Le statut sera mis à jour à "PAID" par le webhook après confirmation
      },
    });

    const response: ApiResponse = {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        orderId: order.id,
      },
      message: "Session de paiement créée avec succès",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating checkout session:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la session de paiement",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
