"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MessageReplyForm from "@/components/forms/MessageReplyForm";
import { User, UserCircle } from "lucide-react";

interface MessageThreadProps {
  message: {
    id: string;
    message: string;
    createdAt: Date;
    user?: {
      username: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
  replies: Array<{
    id: string;
    message: string;
    sentBy: string;
    createdAt: Date;
  }>;
}

export default function MessageThread({ message, replies }: MessageThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "admin";

  /* Détermine le nom d'affichage de l'utilisateur */
  const getUserDisplayName = () => {
    if (!message.user) return "Utilisateur";
    const { firstName, lastName, username, email } = message.user;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return `@${username} (${email})`;
  };

  const userDisplayName = getUserDisplayName();

  return (
    <div className="h-full flex flex-col">
      {/* Zone des messages avec scroll */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Message initial - toujours de l'utilisateur dans ce composant */}
        <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">
              {isAdmin ? userDisplayName : "Vous"} -{" "}
              {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>
      </div>

      {/* Réponses */}
      {replies.map((reply) => {
        /* Détermine si c'est mon propre message */
        const isMyReply = (isAdmin && reply.sentBy === "admin") || (!isAdmin && reply.sentBy === "user");
        
        /* Détermine le nom à afficher */
        let displayName = userDisplayName;
        if (isMyReply) {
          displayName = "Vous";
        } else if (reply.sentBy === "admin") {
          displayName = "Support";
        }
        
        return (
          <div key={reply.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                reply.sentBy === "admin" ? "bg-green-100" : "bg-blue-100"
              }`}>
                <UserCircle size={20} className={reply.sentBy === "admin" ? "text-green-600" : "text-blue-600"} />
              </div>
            </div>
            <div className="flex-1">
              <div className={`rounded-lg p-4 ${
                reply.sentBy === "admin" ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"
              }`}>
                <p className="text-sm text-gray-500 mb-2">
                  {displayName} -{" "}
                  {new Date(reply.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-800 whitespace-pre-wrap">{reply.message}</p>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* Formulaire de réponse fixe en bas */}
      <div className="flex-shrink-0 pt-4 border-t bg-white sticky bottom-0">
        {!showReplyForm ? (
          <button
            onClick={() => setShowReplyForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ajouter une réponse
          </button>
        ) : (
          <div>
            <h3 className="font-semibold mb-3">Nouvelle réponse</h3>
            <MessageReplyForm
              messageId={message.id}
              onSuccess={() => router.refresh()}
            />
            <button
              onClick={() => setShowReplyForm(false)}
              className="mt-2 text-gray-600 hover:text-gray-800"
            >
              Masquer le formulaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
