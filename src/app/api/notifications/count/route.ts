import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Récupère le nombre de notifications non lues pour l'utilisateur connecté
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Non authentifié", { status: 401 });
  }

  try {
    const isAdmin = session.user.role === "admin";

    console.log("[Notifications Count] User:", session.user.email, "isAdmin:", isAdmin);

    if (isAdmin) {
      /* Pour les admins : compter les nouveaux messages et devis */
      const [unreadMessages, pendingQuotes, pendingReviews] = await Promise.all([
        prisma.contact.count({
          where: { status: "unread" },
        }),
        prisma.quote.count({
          where: { status: "pending" },
        }),
        prisma.review.count({
          where: { status: "pending" },
        }),
      ]);

      console.log("[Notifications Count] Admin:", { unreadMessages, pendingQuotes, pendingReviews });

      return NextResponse.json({
        unreadMessages,
        unreadQuotes: pendingQuotes,
        pendingReviews,
      });
    } else {

      /**
       * LOGIQUE UTILISATEUR (Compteurs de notifications)
       * * On ne veut pas afficher de badge pour les messages que l'utilisateur
       * vient d'envoyer lui-même, même si le statut global est "unread".
       */
      const userContacts = await prisma.contact.findMany({
        where: {
          userId: session.user.id,
          status: "unread",
        },
        include: {
          // On récupère uniquement la toute dernière réponse pour vérifier l'auteur
          contact_replies: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      /**
       * @filter realUnreadCount
       * On filtre les résultats en mémoire :
       * Si le fil est vide (pas de replies) : C'est un nouveau message de l'user -> Ignorer.
       * Si le fil a des réponses : On compte seulement si l'ADMIN est le dernier à avoir écrit.
       */
      const realUnreadCount = userContacts.filter(contact => {
        if (contact.contact_replies.length === 0) {
          return false;
        }
        return contact.contact_replies[0].sentBy === "admin";
      }).length;

      const quotesUpdated = await prisma.quote.count({
        where: {
          userId: session.user.id,
          status: { in: ["approved", "rejected"] },
        },
      });

      return NextResponse.json({
        unreadMessages: realUnreadCount,
        unreadQuotes: quotesUpdated,
      });
    }
  } catch (error) {
    console.error("Erreur comptage notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
