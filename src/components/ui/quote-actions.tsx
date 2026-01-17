"use client";

import { useState } from "react";
import { approveQuote, rejectQuote, negotiateQuote } from "@/lib/actions/handle-quote";
import { Check, X, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuoteActionsProps {
  quote: {
    id: string;
    status: string;
  };
}

export default function QuoteActions({ quote }: QuoteActionsProps) {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveQuote(quote.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!confirm("Êtes-vous sûr de vouloir refuser ce devis ?")) return;
    
    setIsLoading(true);
    const result = await rejectQuote(quote.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleNegotiate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDeadline.trim()) {
      alert("Veuillez entrer une nouvelle deadline");
      return;
    }

    setIsLoading(true);
    const result = await negotiateQuote(quote.id, newDeadline, message);
    if (result.success) {
      setIsNegotiating(false);
      setNewDeadline("");
      setMessage("");
      router.refresh();
    }
    setIsLoading(false);
  };

  if (quote.status === "approved") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">✓ Ce devis a été approuvé</p>
      </div>
    );
  }

  if (quote.status === "rejected") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">✗ Ce devis a été refusé</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold text-lg mb-4">Actions</h3>
      
      {!isNegotiating ? (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
          >
            <Check size={18} />
            Approuver
          </button>

          <button
            onClick={handleReject}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
          >
            <X size={18} />
            Refuser
          </button>

          <button
            onClick={() => setIsNegotiating(true)}
            disabled={isLoading}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
          >
            <MessageSquare size={18} />
            Renégocier le délai
          </button>
        </div>
      ) : (
        <form onSubmit={handleNegotiate} className="space-y-4 bg-yellow-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouvelle deadline proposée
            </label>
            <input
              type="text"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              placeholder="Ex: 2 mois, 3 semaines, etc."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez pourquoi ce délai est nécessaire..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "Envoi..." : "Proposer ce délai"}
            </button>
            <button
              type="button"
              onClick={() => setIsNegotiating(false)}
              disabled={isLoading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
