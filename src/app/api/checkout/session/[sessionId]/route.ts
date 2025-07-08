import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/checkout/session/[sessionId] - Vérifier le statut d'une session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  try {
    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (!session) {
      const response: ApiResponse = {
        success: false,
        error: "Session non trouvée",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Récupérer la commande associée
    let order: any = null;
    if (session.metadata?.orderId) {
      order = await prisma.order.findUnique({
        where: { id: session.metadata.orderId },
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
    }

    const response: ApiResponse = {
      success: true,
      data: {
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          customer_email: session.customer_email,
          amount_total: session.amount_total,
          currency: session.currency,
          created: session.created,
          metadata: session.metadata,
        },
        order,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération de la session",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
