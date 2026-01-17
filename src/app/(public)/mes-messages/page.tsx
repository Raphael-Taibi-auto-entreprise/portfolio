import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessageThreadView from "@/components/ui/message-thread-view";
import { MessageSquare } from "lucide-react";

export default async function MesMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const messages = await prisma.contact.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      contact_replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes messages</h1>
          <p className="text-gray-600">Consultez vos échanges et répondez aux messages</p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun message</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore envoyé de message</p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Envoyer un message
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message: typeof messages[number]) => (
              <MessageThreadView
                key={message.id}
                message={message}
                userId={session.user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
