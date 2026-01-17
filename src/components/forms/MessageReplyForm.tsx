"use client";

import { useState } from "react";
import { replyToMessage } from "@/lib/actions/handle-message";
import { Send } from "lucide-react";

interface MessageReplyFormProps {
  messageId: string;
  onSuccess?: () => void;
}

export default function MessageReplyForm({ messageId, onSuccess }: MessageReplyFormProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      setError("La réponse ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await replyToMessage(messageId, replyContent);

    if (result.success) {
      setReplyContent("");
      onSuccess?.();
    } else {
      setError(result.error || "Erreur lors de l'envoi");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Écrire votre réponse..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        disabled={isSubmitting}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
      >
        <Send size={18} />
        {isSubmitting ? "Envoi..." : "Envoyer la réponse"}
      </button>
    </form>
  );
}
