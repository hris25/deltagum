import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendOrderConfirmation = async (
  to: string,
  orderData: {
    orderId: string
    customerName: string
    totalAmount: number
    items: Array<{
      name: string
      flavor: string
      quantity: number
      price: number
    }>
  }
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Deltagum <noreply@deltagum.com>',
      to: [to],
      subject: `Confirmation de commande #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B9D;">Merci pour votre commande !</h1>
          <p>Bonjour ${orderData.customerName},</p>
          <p>Votre commande #${orderData.orderId} a été confirmée.</p>
          
          <h2>Détails de la commande :</h2>
          <ul>
            ${orderData.items.map(item => `
              <li>${item.name} - ${item.flavor} x${item.quantity} - ${item.price.toFixed(2)}€</li>
            `).join('')}
          </ul>
          
          <p><strong>Total : ${orderData.totalAmount.toFixed(2)}€</strong></p>
          
          <p>Votre commande sera expédiée sous 24-48h.</p>
          
          <p>Merci de votre confiance !</p>
          <p>L'équipe Deltagum</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export const sendWelcomeEmail = async (to: string, customerName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Deltagum <welcome@deltagum.com>',
      to: [to],
      subject: 'Bienvenue chez Deltagum !',
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
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}
