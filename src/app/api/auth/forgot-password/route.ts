import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Toujours retourner un succès pour des raisons de sécurité
    // (ne pas révéler si un email existe ou non)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token en base
    await prisma.customer.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;
    
    await sendPasswordResetEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      resetUrl,
    });

    console.log(`📧 Email de réinitialisation envoyé à: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
