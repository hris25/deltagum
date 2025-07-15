import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Types pour les emails
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: "contact" | "professional";
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    flavor?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    phone?: string;
  };
}

interface PasswordResetData {
  email: string;
  name: string;
  resetUrl: string;
}

export const sendOrderConfirmation = async (
  to: string,
  orderData: {
    orderId: string;
    customerName: string;
    totalAmount: number;
    items: Array<{
      name: string;
      flavor: string;
      quantity: number;
      price: number;
    }>;
  }
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Deltagum <noreply@deltagum.com>",
      to: [to],
      subject: `Confirmation de commande #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B9D;">Merci pour votre commande !</h1>
          <p>Bonjour ${orderData.customerName},</p>
          <p>Votre commande #${orderData.orderId} a été confirmée.</p>
          
          <h2>Détails de la commande :</h2>
          <ul>
            ${orderData.items
              .map(
                (item) => `
              <li>${item.name} - ${item.flavor} x${
                  item.quantity
                } - ${item.price.toFixed(2)}€</li>
            `
              )
              .join("")}
          </ul>
          
          <p><strong>Total : ${orderData.totalAmount.toFixed(2)}€</strong></p>
          
          <p>Votre commande sera expédiée sous 24-48h.</p>
          
          <p>Merci de votre confiance !</p>
          <p>L'équipe Deltagum</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (to: string, customerName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Deltagum <welcome@deltagum.com>",
      to: [to],
      subject: "Bienvenue chez Deltagum !",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B9D;">Bienvenue chez Deltagum !</h1>
          <p>Bonjour ${customerName},</p>
          <p>Merci de vous être inscrit chez Deltagum !</p>
          <p>Découvrez nos délicieux chewing-gums aux saveurs naturelles de fruits.</p>
          <p>Votre programme de fidélité a été activé avec 50 points de bienvenue !</p>
          <p>À bientôt,</p>
          <p>L'équipe Deltagum</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
};

// Fonction pour envoyer les emails de contact
export const sendContactEmail = async (data: ContactFormData) => {
  try {
    const isProf = data.type === "professional";

    const { data: result, error } = await resend.emails.send({
      from: "Deltagum <noreply@deltagum.com>",
      to: ["Gumdelta@gmail.com"],
      subject: isProf
        ? "Nouvelle demande professionnelle - Deltagum"
        : "Nouveau message de contact - Deltagum",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ec4899, #f97316); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍬 Deltagum</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">
              ${
                isProf
                  ? "Nouvelle demande professionnelle"
                  : "Nouveau message de contact"
              }
            </p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Informations du contact</h2>
            <p><strong>Nom :</strong> ${data.name}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            ${
              data.phone
                ? `<p><strong>Téléphone :</strong> ${data.phone}</p>`
                : ""
            }
            <p><strong>Type :</strong> ${
              isProf ? "Demande professionnelle/revendeur" : "Contact général"
            }</p>
          </div>

          <div style="background: white; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message :</h3>
            <p style="line-height: 1.6; color: #555;">${data.message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; font-size: 14px;">
              Email envoyé automatiquement depuis le site Deltagum<br>
              <a href="mailto:${
                data.email
              }" style="color: #ec4899;">Répondre directement</a>
            </p>
          </div>
        </div>
      `,
      replyTo: data.email,
    });

    if (error) {
      console.error("❌ Erreur envoi email de contact:", error);
      return { success: false, error };
    }

    console.log("✅ Email de contact envoyé:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Erreur envoi email de contact:", error);
    return { success: false, error };
  }
};

// Fonction améliorée pour les confirmations de commande
export const sendOrderConfirmationEmail = async (data: OrderData) => {
  try {
    console.log("📧 Envoi email de confirmation de commande...");
    console.log("Données reçues:", JSON.stringify(data, null, 2));
    console.log(
      "Adresse de livraison:",
      JSON.stringify(data.shippingAddress, null, 2)
    );

    const itemsHtml = data.items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; color: #333;">
          ${item.name}${item.flavor ? ` - ${item.flavor}` : ""}
        </td>
        <td style="padding: 12px 0; text-align: center; color: #666;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; text-align: right; color: #333; font-weight: 500;">
          ${(item.price * item.quantity).toFixed(2)}€
        </td>
      </tr>
    `
      )
      .join("");

    // Email au client
    const customerResult = await resend.emails.send({
      from: "Deltagum <noreply@deltagum.com>",
      to: [data.customerEmail],
      subject: `Confirmation de commande #${data.orderId} - Deltagum`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ec4899, #f97316); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍬 Deltagum</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">
              Merci pour votre commande !
            </p>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">✅ Commande confirmée</h2>
            <p style="color: #166534; margin: 0;">
              Votre commande <strong>#${
                data.orderId
              }</strong> a été confirmée et sera traitée dans les plus brefs délais.
            </p>
          </div>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px 0; text-align: left; color: #666; font-weight: 600;">Produit</th>
                  <th style="padding: 12px 0; text-align: center; color: #666; font-weight: 600;">Qté</th>
                  <th style="padding: 12px 0; text-align: right; color: #666; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ec4899;">
              <div style="text-align: right;">
                <span style="font-size: 18px; font-weight: bold; color: #333;">
                  Total : ${data.totalAmount.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">Adresse de livraison</h3>
            <p style="margin: 0; line-height: 1.6; color: #555;">
              ${data.shippingAddress.firstName} ${
        data.shippingAddress.lastName
      }<br>
              ${data.shippingAddress.street}<br>
              ${data.shippingAddress.postalCode} ${data.shippingAddress.city}
              ${
                data.shippingAddress.phone
                  ? `<br>Tél: ${data.shippingAddress.phone}`
                  : ""
              }
            </p>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0;">⚠️ Informations importantes</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Produit contenant du Delta-9 THC (< 0.3%)</li>
              <li>Réservé aux personnes majeures (18+)</li>
              <li>Conforme à la réglementation européenne</li>
              <li>Consommation responsable recommandée</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Besoin d'aide ? Contactez-nous à
              <a href="mailto:Gumdelta@gmail.com" style="color: #ec4899;">Gumdelta@gmail.com</a>
            </p>
            <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
              Deltagum - Délices au Delta-9 THC
            </p>
          </div>
        </div>
      `,
    });

    // Email de notification à l'admin
    const adminResult = await resend.emails.send({
      from: "Deltagum <noreply@deltagum.com>",
      to: ["Gumdelta@gmail.com"],
      subject: `Nouvelle commande #${data.orderId} - ${data.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🛒 Nouvelle commande reçue</h2>
          <p><strong>Commande :</strong> #${data.orderId}</p>
          <p><strong>Client :</strong> ${data.customerName} (${
        data.customerEmail
      })</p>
          <p><strong>Montant :</strong> ${data.totalAmount.toFixed(2)}€</p>
          <p><strong>Nombre d'articles :</strong> ${data.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}</p>

          <h3>Articles commandés :</h3>
          <ul>
            ${data.items
              .map(
                (item) => `
              <li>${item.name}${item.flavor ? ` - ${item.flavor}` : ""} x${
                  item.quantity
                } = ${(item.price * item.quantity).toFixed(2)}€</li>
            `
              )
              .join("")}
          </ul>

          <h3>Adresse de livraison :</h3>
          <p>
            ${data.shippingAddress?.firstName || "N/A"} ${
        data.shippingAddress?.lastName || "N/A"
      }<br>
            ${data.shippingAddress?.street || "Adresse non spécifiée"}<br>
            ${data.shippingAddress?.postalCode || ""} ${
        data.shippingAddress?.city || "Ville non spécifiée"
      }
            ${
              data.shippingAddress?.phone
                ? `<br>Tél: ${data.shippingAddress.phone}`
                : ""
            }
          </p>

          <p><a href="${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/admin/dashboard">Voir dans le dashboard admin</a></p>
        </div>
      `,
    });

    console.log("✅ Emails de commande envoyés:", {
      customerResult,
      adminResult,
    });
    return { success: true, data: { customerResult, adminResult } };
  } catch (error) {
    console.error("❌ Erreur envoi emails de commande:", error);
    return { success: false, error };
  }
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (data: PasswordResetData) => {
  try {
    console.log("📧 Envoi email de réinitialisation de mot de passe...");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ec4899; font-size: 28px; margin: 0;">🔐 Réinitialisation de mot de passe</h1>
          </div>

          <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">
            Bonjour ${data.name},
          </h2>

          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Deltagum.
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}"
               style="background: linear-gradient(135deg, #ec4899, #f97316);
                      color: white;
                      padding: 15px 30px;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: bold;
                      font-size: 16px;
                      display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
              <strong>⚠️ Important :</strong><br>
              • Ce lien est valide pendant 1 heure seulement<br>
              • Si vous n'avez pas demandé cette réinitialisation, ignorez cet email<br>
              • Votre mot de passe actuel reste inchangé tant que vous n'en créez pas un nouveau
            </p>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
            <a href="${data.resetUrl}" style="color: #ec4899; word-break: break-all;">${data.resetUrl}</a>
          </p>

          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Cet email a été envoyé par Deltagum<br>
              Si vous avez des questions, contactez-nous à Gumdelta@gmail.com
            </p>
          </div>
        </div>
      </div>
    `;

    const { data: result, error } = await resend.emails.send({
      from: "Deltagum <noreply@deltagum.com>",
      to: [data.email],
      subject: "🔐 Réinitialisation de votre mot de passe Deltagum",
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return { success: false, error };
    }

    console.log("✅ Email de réinitialisation envoyé:", result?.id);
    return { success: true, data: result };
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de réinitialisation:",
      error
    );
    return { success: false, error };
  }
};
