"use client";

import { useState } from "react";
import MessageReplyForm from "@/components/forms/MessageReplyForm";
import { User, UserCircle } from "lucide-react";

interface MessageThreadProps {
  message: {
    id: string;
    message: string;
    createdAt: Date;
  };
  replies: Array<{
    id: string;
    message: string;
    sentBy: string;
    createdAt: Date;
  }>;
}

export default function MessageThread({ message, replies }: MessageThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Message initial */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">
              Message initial -{" "}
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
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCircle size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">
                {reply.sentBy === "admin" ? "Vous" : reply.sentBy} -{" "}
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
      ))}

      {/* Formulaire de réponse */}
      <div className="pt-4 border-t">
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
              onSuccess={() => setShowReplyForm(false)}
            />
            <button
              onClick={() => setShowReplyForm(false)}
              className="mt-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
