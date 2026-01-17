import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de réponse à un message de contact
 */
export async function sendContactReplyEmail({
  to,
  name,
  subject,
  replyMessage,
}: {
  to: string;
  name: string;
  subject: string;
  replyMessage: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      subject: `Re: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Réponse à votre message</h1>
              </div>
              <div class="content">
                <p>Bonjour ${name},</p>
                <p>Merci de m'avoir contacté. Voici ma réponse concernant : <strong>${subject}</strong></p>
                
                <div class="message">
                  ${replyMessage.replace(/\n/g, '<br>')}
                </div>
                
                <p>N'hésitez pas à me recontacter si vous avez d'autres questions.</p>
                
                <p>Cordialement,<br>Portfolio</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé en réponse à votre demande de contact.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}

/**
 * Envoie un email de validation de devis
 */
export async function sendQuoteApprovedEmail({
  to,
  name,
  projectType,
}: {
  to: string;
  name: string;
  projectType: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      subject: '✅ Votre devis a été approuvé',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 Bonne nouvelle !</h1>
              </div>
              <div class="content">
                <p>Bonjour ${name},</p>
                <p><span class="badge">DEVIS APPROUVÉ</span></p>
                
                <p>J'ai le plaisir de vous informer que votre demande de devis pour <strong>${projectType}</strong> a été approuvée.</p>
                
                <p>Je vais vous recontacter très prochainement pour discuter des détails du projet et planifier le début de notre collaboration.</p>
                
                <p>Au plaisir de travailler ensemble sur ce projet !</p>
                
                <p>Cordialement,<br>Portfolio</p>
              </div>
              <div class="footer">
                <p>Vous recevez cet email suite à votre demande de devis.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}

/**
 * Envoie un email de refus de devis
 */
export async function sendQuoteRejectedEmail({
  to,
  name,
  projectType,
}: {
  to: string;
  name: string;
  projectType: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      subject: 'Réponse à votre demande de devis',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Réponse à votre demande</h1>
              </div>
              <div class="content">
                <p>Bonjour ${name},</p>
                
                <p>Je vous remercie pour votre demande de devis concernant <strong>${projectType}</strong>.</p>
                
                <p>Malheureusement, je ne suis pas en mesure d'accepter ce projet pour le moment. Cela peut être dû à des contraintes de planning, de compétences spécifiques ou d'autres raisons.</p>
                
                <p>Je vous souhaite beaucoup de succès dans la réalisation de votre projet.</p>
                
                <p>Cordialement,<br>Portfolio</p>
              </div>
              <div class="footer">
                <p>Vous recevez cet email suite à votre demande de devis.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}

/**
 * Envoie un email de négociation de devis
 */
export async function sendQuoteNegotiationEmail({
  to,
  name,
  projectType,
  newDeadline,
}: {
  to: string;
  name: string;
  projectType: string;
  newDeadline: Date;
}) {
  const formattedDate = new Date(newDeadline).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      subject: '💬 Proposition alternative pour votre devis',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Proposition alternative</h1>
              </div>
              <div class="content">
                <p>Bonjour ${name},</p>
                
                <p>Merci pour votre demande de devis concernant <strong>${projectType}</strong>.</p>
                
                <p>Votre projet m'intéresse beaucoup ! Cependant, j'aimerais vous proposer une alternative concernant le planning :</p>
                
                <div class="highlight">
                  <strong>📅 Nouvelle date de livraison proposée :</strong><br>
                  ${formattedDate}
                </div>
                
                <p>Cette modification me permettrait de vous offrir un travail de qualité optimale tout en respectant mes engagements actuels.</p>
                
                <p>Si ce nouveau délai vous convient, n'hésitez pas à me recontacter pour que nous puissions démarrer le projet.</p>
                
                <p>Cordialement,<br>Portfolio</p>
              </div>
              <div class="footer">
                <p>Vous recevez cet email suite à votre demande de devis.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}
