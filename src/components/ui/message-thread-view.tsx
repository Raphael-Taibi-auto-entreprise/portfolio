"use client";

import { useState } from "react";
import { MessageSquare, Calendar, Send, User, Shield } from "lucide-react";

type ContactReply = {
  id: string;
  message: string;
  sentBy: string;
  createdAt: Date;
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
  contact_replies: ContactReply[];
};

type MessageThreadViewProps = {
  message: Message;
  userId: string;
};

export default function MessageThreadView({ message, userId }: MessageThreadViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Gère l'envoi d'une réponse
   */
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      setError("Veuillez saisir un message");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: message.id,
          message: replyText,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la réponse");
      }

      setReplyText("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReplies = message.contact_replies.length;

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête du message */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {message.subject || "Message sans objet"}
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            message.status === "read" 
              ? "bg-gray-100 text-gray-600" 
              : "bg-blue-100 text-blue-600"
          }`}>
            {totalReplies > 0 ? `${totalReplies} réponse${totalReplies > 1 ? "s" : ""}` : "Pas de réponse"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <time dateTime={message.createdAt.toISOString()}>
            {new Date(message.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </button>

      {/* Contenu développé */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Message initial */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Vous</p>
                <p className="text-sm text-gray-500">{message.email}</p>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Réponses */}
          {message.contact_replies.map((reply) => (
            <div key={reply.id} className="p-6 border-t border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  {reply.sentBy === "admin" ? (
                    <Shield size={20} className="text-green-600" />
                  ) : (
                    <User size={20} className="text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {reply.sentBy === "admin" ? "Administrateur" : "Vous"}
                    </p>
                    <time className="text-sm text-gray-500">
                      {new Date(reply.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap ml-13">{reply.message}</p>
            </div>
          ))}

          {/* Formulaire de réponse */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre réponse
                </label>
                <textarea
                  id="reply"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Send size={18} />
                  {isSubmitting ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
