import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MessageThread from "@/components/ui/message-thread";
import NotificationRefresh from "@/components/NotificationRefresh";

interface MessageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic"; /* Toujours récupérer les données fraîches */

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = await params;
  
  const message = await prisma.contact.findUnique({
    where: { id },
    include: {
      contact_replies: {
        orderBy: { createdAt: "asc" },
      },
      user: {
        select: {
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!message) {
    notFound();
  }

  /**
   * Marquer automatiquement le message comme "lu" si l'admin l'ouvre
   * Ne pas écraser le statut "replied" si l'admin a déjà répondu
   */
  if (message.status === "unread") {
    await prisma.contact.update({
      where: { id },
      data: { status: "read" },
    });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NotificationRefresh types={["message_reply", "new_message"]} />
      
      {/* Header fixe */}
      <div className="flex-shrink-0 p-8 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/admin/messages"
            className="text-blue-600 hover:text-blue-700"
          >
            Messages
          </Link>
        </div>

        <div className="bg-white rounded-t-lg shadow-lg p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{message.name}</h1>
              <p className="text-gray-600">{message.email}</p>
              {message.subject && (
                <p className="text-gray-600 italic mt-1">Sujet: {message.subject}</p>
              )}
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium 
                ${
                  message.status === "unread"
                    ? "bg-blue-100 text-blue-800"
                    : message.status === "read"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {message.status === "unread"
                  ? "Non lu"
                  : message.status === "read"
                  ? "Lu"
                  : "Répondu"}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de conversation avec scroll */}
      <div className="flex-1 overflow-hidden px-8">
        <div className="bg-white rounded-b-lg shadow-lg h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <MessageThread message={message} replies={message.contact_replies} />
          </div>
        </div>
      </div>
    </div>
  );
}
