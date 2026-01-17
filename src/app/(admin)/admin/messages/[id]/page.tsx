import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MessageThread from "@/components/ui/message-thread";

interface MessageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = await params;
  
  const message = await prisma.contact.findUnique({
    where: { id },
    include: {
      contact_replies: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!message) {
    notFound();
  }

  return (
    <div className="p-8">
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
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

        <MessageThread message={message} replies={message.contact_replies} />
      </div>
    </div>
  );
}
