"use client";

import { useState } from "react";
import { approveReview, rejectReview, hideReview } from "@/lib/actions/handle-review";
import { Check, X, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewActionsProps {
  review: {
    id: string;
    status: string;
    isPublic: boolean;
  };
}

export default function ReviewActions({ review }: ReviewActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveReview(review.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!confirm("Êtes-vous sûr de vouloir refuser cet avis ?")) return;
    
    setIsLoading(true);
    const result = await rejectReview(review.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleHide = async () => {
    if (!confirm("Êtes-vous sûr de vouloir masquer cet avis ?")) return;
    
    setIsLoading(true);
    const result = await hideReview(review.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  if (review.status === "approved" && review.isPublic) {
    return (
      <div className="border-t pt-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">✓ Cet avis est approuvé et public</p>
        </div>
        <button
          onClick={handleHide}
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
          onClick={handleReject}
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
