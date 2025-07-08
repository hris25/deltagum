import { resend } from "@/lib/email";
import { contactSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = contactSchema.parse(body);

    // Envoyer l'email de contact
    await resend.emails.send({
      from: "contact@deltagum.com",
      to: "support@deltagum.com",
      subject: `Nouveau message de contact - ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Informations du contact</h3>
            <p><strong>Nom :</strong> ${validatedData.name}</p>
            <p><strong>Email :</strong> ${validatedData.email}</p>
            <p><strong>Sujet :</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #666;">
              ${validatedData.message.replace(/\n/g, "<br>")}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Message reçu le ${new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      `,
      replyTo: validatedData.email,
    });

    // Envoyer un email de confirmation au client
    await resend.emails.send({
      from: "noreply@deltagum.com",
      to: validatedData.email,
      subject: "Confirmation de réception - Deltagum",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🍭 Deltagum</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Merci pour votre message !</p>
          </div>
          
          <div style="padding: 30px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Bonjour ${validatedData.name} !</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Nous avons bien reçu votre message concernant "<strong>${validatedData.subject}</strong>" 
              et nous vous remercions de nous avoir contactés.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Notre équipe examine votre demande et vous répondra dans les plus brefs délais, 
              généralement sous 24 heures.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Récapitulatif de votre message</h3>
              <p style="margin: 5px 0;"><strong>Sujet :</strong> ${validatedData.subject}</p>
              <p style="margin: 5px 0;"><strong>Message :</strong></p>
              <p style="color: #666; font-style: italic; margin: 10px 0;">
                "${validatedData.message}"
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              En attendant, n'hésitez pas à découvrir nos délicieux bonbons aux saveurs 
              fraise, myrtille et pomme sur notre site !
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}" 
                 style="background: linear-gradient(135deg, #ff6b6b, #ffa500); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                Découvrir nos bonbons
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Deltagum - Tous droits réservés</p>
            <p>Des bonbons qui font sourire ! 🍭✨</p>
          </div>
        </div>
      `,
    });

    const response: ApiResponse = {
      success: true,
      message: "Message envoyé avec succès",
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
