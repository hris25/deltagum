import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schéma de validation pour les données de contact
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
  type: z
    .enum(["contact", "professional"], {
      errorMap: () => ({ message: "Type de contact invalide" }),
    })
    .default("contact"),
  // Compatibilité avec l'ancien format
  subject: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📧 Réception formulaire de contact:", body);

    // Validation des données
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("❌ Validation échouée:", validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Données invalides",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Convertir le format ancien vers le nouveau si nécessaire
    const contactData = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.subject
        ? `Sujet: ${validatedData.subject}\n\n${validatedData.message}`
        : validatedData.message,
      type: validatedData.type as "contact" | "professional",
    };

    // Importer dynamiquement pour éviter les problèmes d'IDE
    const { sendContactEmail } = await import("@/lib/email");

    // Envoi de l'email
    const emailResult = await sendContactEmail(contactData);

    if (!emailResult.success) {
      console.error("❌ Erreur envoi email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Erreur lors de l'envoi de l'email",
          error: emailResult.error,
        },
        { status: 500 }
      );
    }

    console.log("✅ Email de contact envoyé avec succès");

    const response: ApiResponse = {
      success: true,
      message:
        contactData.type === "professional"
          ? "Votre demande professionnelle a été envoyée avec succès. Nous vous recontacterons rapidement."
          : "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error sending contact message:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi du message",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
