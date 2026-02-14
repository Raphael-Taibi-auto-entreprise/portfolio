"use client";

import { useState } from "react";
import { approveReview, rejectReview, hideReview } from "@/lib/actions/handle-review";
import { Check, X, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/ui/useToast";

interface ReviewActionsProps {
  review: {
    id: string;
    status: string;
    isPublic: boolean;
  };
}

export default function ReviewActions({ review }: ReviewActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showHideConfirm, setShowHideConfirm] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveReview(review.id);
    if (result.success) {
      toast.success("Avis approuvé et publié");
      router.refresh();
    } else {
      toast.error(result.error || "Échec de l'approbation");
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!showRejectConfirm) {
      setShowRejectConfirm(true);
      return;
    }
    
    setIsLoading(true);
    const result = await rejectReview(review.id);
    if (result.success) {
      toast.success("Avis refusé");
      router.refresh();
    } else {
      toast.error(result.error || "Échec du rejet");
    }
    setShowRejectConfirm(false);
    setIsLoading(false);
  };

  const handleHide = async () => {
    if (!showHideConfirm) {
      setShowHideConfirm(true);
      return;
    }
    
    setIsLoading(true);
    const result = await hideReview(review.id);
    if (result.success) {
      toast.success("Avis masqué du site public");
      router.refresh();
    } else {
      toast.error(result.error || "Échec du masquage");
    }
    setShowHideConfirm(false);
    setIsLoading(false);
  };

  if (review.status === "approved" && review.isPublic) {
    return (
      <div className="border-t pt-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">✓ Cet avis est approuvé et public</p>
        </div>
        
        {showHideConfirm && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 mb-3">Êtes-vous sûr de vouloir masquer cet avis ?</p>
            <div className="flex gap-3">
              <button
                onClick={handleHide}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              >
                Oui, masquer
              </button>
              <button
                onClick={() => setShowHideConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowHideConfirm(true)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          <EyeOff size={18} />
          Masquer cet avis
        </button>
      </div>
    );
  }

  if (review.status === "rejected") {
    return (
      <div className="border-t pt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">✗ Cet avis a été refusé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold text-lg mb-4">Actions</h3>
      
      {showRejectConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 mb-3">Êtes-vous sûr de vouloir refuser cet avis ?</p>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
            >
              Oui, refuser
            </button>
            <button
              onClick={() => setShowRejectConfirm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          <Check size={18} />
          Approuver et publier
        </button>

        <button
          onClick={() => setShowRejectConfirm(true)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          <X size={18} />
          Refuser
        </button>
      </div>
    </div>
  );
}
