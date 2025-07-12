import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  // WEBHOOK DÉSACTIVÉ - Utilisation de la vérification côté client
  return NextResponse.json(
    { error: "Webhook désactivé - utilisation de la vérification côté client" },
    { status: 200 }
  );

  /* ANCIEN CODE WEBHOOK - COMMENTÉ
export async function POST_DISABLED(req: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Checkout session completed:", session.id);

  if (session.metadata?.orderId) {
    await prisma.order.update({
      where: { id: session.metadata.orderId },
      data: {
        status: "PAID",
        stripePaymentId: session.payment_intent as string,
      },
    });

    console.log(`Order ${session.metadata.orderId} marked as PAID`);
  }
}
*/ // FIN DU COMMENTAIRE WEBHOOK

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("Payment intent succeeded:", paymentIntent.id);

  if (paymentIntent.metadata?.orderId) {
    await prisma.order.update({
      where: { id: paymentIntent.metadata.orderId },
      data: {
        status: "PAID",
        stripePaymentId: paymentIntent.id,
      },
    });

    console.log(`Order ${paymentIntent.metadata.orderId} payment confirmed`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id);

  if (paymentIntent.metadata?.orderId) {
    await prisma.order.update({
      where: { id: paymentIntent.metadata.orderId },
      data: {
        status: "CANCELLED",
        stripePaymentId: paymentIntent.id,
      },
    });

    console.log(`Order ${paymentIntent.metadata.orderId} marked as FAILED`);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id);

  // Gérer les paiements d'abonnement si nécessaire
  // Pour l'instant, nous n'avons pas d'abonnements dans Deltagum
}
