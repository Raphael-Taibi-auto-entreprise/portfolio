"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendContactReplyEmail } from "@/lib/email";

/**
 * Marque un message comme lu
 */
export async function markAsRead(messageId: string) {
  try {
    await prisma.contact.update({
      where: { id: messageId },
      data: { status: "read" },
    });
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du marquage comme lu:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Répond à un message de contact et envoie un email
 */
export async function replyToMessage(messageId: string, replyContent: string) {
  try {
    /* Récupérer les infos du message */
    const contact = await prisma.contact.findUnique({
      where: { id: messageId },
    });

    if (!contact) {
      return { success: false, error: "Message non trouvé" };
    }

    /* Créer la réponse */
    await prisma.contact_replies.create({
      data: {
        id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        contactId: messageId,
        message: replyContent,
        sentBy: "admin",
      },
    });

    /* Marquer le message comme répondu */
    await prisma.contact.update({
      where: { id: messageId },
      data: { status: "replied" },
    });

    /* Envoyer l'email de réponse */
    const emailResult = await sendContactReplyEmail({
      to: contact.email,
      name: contact.name,
      subject: contact.subject,
      replyMessage: replyContent,
    });

    if (!emailResult.success) {
      console.warn("Email non envoyé, mais réponse sauvegardée:", emailResult.error);
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réponse:", error);
    return { success: false, error: "Erreur lors de l'envoi de la réponse" };
  }
}
