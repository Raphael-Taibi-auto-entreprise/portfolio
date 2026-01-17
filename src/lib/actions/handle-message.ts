"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendContactReplyEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sseManager } from "@/lib/sse-manager";

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
    /* Récupérer la session pour déterminer qui répond */
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: "Non authentifié" };
    }

    const isAdmin = session.user.role === "admin";

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
        sentBy: isAdmin ? "admin" : "user",
      },
    });

    /* Marquer le message comme répondu */
    await prisma.contact.update({
      where: { id: messageId },
      data: { status: "replied" },
    });

    /* Envoyer l'email de réponse uniquement si c'est l'admin qui répond */
    if (isAdmin) {
      const emailResult = await sendContactReplyEmail({
        to: contact.email,
        name: contact.name,
        subject: contact.subject || "Votre message",
        replyMessage: replyContent,
      });

      if (!emailResult.success) {
        console.warn("Email non envoyé, mais réponse sauvegardée:", emailResult.error);
      }

      /* Notifier l'utilisateur via SSE si il a un compte */
      if (contact.userId) {
        sseManager.sendToUser(contact.userId, {
          type: "message_reply",
          data: { messageId, subject: contact.subject || "Votre message" },
        });
      }
    } else {
      /* Si c'est l'utilisateur qui répond, notifier les admins */
      sseManager.sendToAdmins({
        type: "new_message",
        data: { messageId, subject: contact.subject || "Message sans objet", from: contact.name },
      });
    }

    revalidatePath("/admin/messages");
    revalidatePath("/mes-messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réponse:", error);
    return { success: false, error: "Erreur lors de l'envoi de la réponse" };
  }
}
