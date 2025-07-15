import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
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

      // Envoyer l'email de confirmation après paiement réussi
      try {
        console.log("📧 Envoi email de confirmation après paiement...");

        const { sendOrderConfirmationEmail } = await import("@/lib/email");

        const emailData = {
          orderId: updatedOrder.id,
          customerName: `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`,
          customerEmail: updatedOrder.customer.email,
          totalAmount: Number(updatedOrder.totalAmount),
          items: updatedOrder.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
            flavor: item.variant?.flavor || undefined,
          })),
          shippingAddress: {
            firstName: updatedOrder.shippingFirstName,
            lastName: updatedOrder.shippingLastName,
            street: updatedOrder.shippingStreet,
            city: updatedOrder.shippingCity,
            postalCode: updatedOrder.shippingPostalCode,
            phone: updatedOrder.shippingPhone || undefined,
          },
        };

        const emailResult = await sendOrderConfirmationEmail(emailData);

        if (emailResult.success) {
          console.log(
            "✅ Email de confirmation envoyé avec succès après paiement"
          );
        } else {
          console.error("❌ Erreur envoi email:", emailResult.error);
        }
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email:", emailError);
        // Ne pas faire échouer la vérification pour un problème d'email
      }

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
