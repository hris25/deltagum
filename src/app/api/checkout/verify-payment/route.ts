import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, orderId } = await request.json();

    if (!sessionId || !orderId) {
      const response: ApiResponse = {
        success: false,
        error: "Session ID et Order ID requis",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      const response: ApiResponse = {
        success: false,
        error: "Session Stripe introuvable",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Vérifier le statut du paiement
    if (session.payment_status === "paid") {
      // Mettre à jour la commande
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
          updatedAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          customer: true,
        },
      });

      const response: ApiResponse = {
        success: true,
        data: {
          order: updatedOrder,
          paymentStatus: session.payment_status,
        },
      };
      return NextResponse.json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        error: `Paiement non confirmé. Statut: ${session.payment_status}`,
      };
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur vérification paiement:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la vérification du paiement",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
