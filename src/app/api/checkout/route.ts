import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = checkoutSchema.parse(body);

    // Créer ou récupérer le client
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.customer.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: validatedData.customer.email,
          firstName: validatedData.customer.firstName,
          lastName: validatedData.customer.lastName,
          phone: validatedData.customer.phone,
        },
      });
    }

    // Calculer le montant total
    let totalAmount = 0;
    for (const item of validatedData.items) {
      totalAmount += item.price * item.quantity;
    }

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount: totalAmount,
        shippingAddress: validatedData.shippingAddress,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
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

    // Créer les line items pour Stripe
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.product.name} - ${item.variant.flavor}`,
          description: item.product.description,
          images: item.product.image ? [item.product.image] : [],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
          },
        },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Ajouter les frais de livraison si nécessaire
    if (Number(order.totalAmount) < 25) {
      // Livraison gratuite dès 25€
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
            description: "Livraison standard",
            images: [],
            metadata: {
              productId: "shipping",
              variantId: "standard",
            },
          },
          unit_amount: 490, // 4.90€ en centimes
        },
        quantity: 1,
      });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: order.customer.email,
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
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
    });

    // Mettre à jour la commande avec l'ID de session
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: session.id,
        status: "PAID",
      },
    });

    const response: ApiResponse = {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
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
