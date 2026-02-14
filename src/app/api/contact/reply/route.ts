import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sseManager } from "@/lib/sse-manager";

/**
 * API POST pour permettre aux utilisateurs de répondre à leurs messages
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { contactId, message } = body;

    if (!contactId || !message) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    /* Vérifier que le message appartient bien à l'utilisateur */
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact || contact.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Message non trouvé ou non autorisé" },
        { status: 404 }
      );
    }

    /* Créer la réponse */
    const reply = await prisma.contact_replies.create({
      data: {
        id: nanoid(),
        contactId,
        message: message.trim(),
        sentBy: "user",
      },
    });

    console.log(`[API contact/reply] User répond, passage du statut ${contact.status} → unread`);

    /* Mettre à jour le statut à "unread" pour que l'admin soit notifié */
    await prisma.contact.update({
      where: { id: contactId },
      data: { status: "unread" },
    });

    /* Notifier les admins qu'il y a un nouveau message de l'utilisateur */
    console.log(`[API contact/reply] Notification des admins`);
    sseManager.sendToAdmins({
      type: "new_message",
      data: { 
        messageId: contactId, 
        subject: contact.subject || "Message sans objet", 
        from: contact.name 
      },
    }, session.user.id);

    return NextResponse.json(
      { success: true, reply },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la réponse:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
