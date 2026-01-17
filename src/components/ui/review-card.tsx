"use client";

import Link from "next/link";
import { Star, MessageCircle } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
    role: string | null;
    rating: number;
    comment: string;
    status: string;
    isPublic: boolean;
    createdAt: Date;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/admin/avis/${review.id}`}>
      <div
        className={`bg-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
          review.status === "pending" ? "border-l-4 border-blue-500" : ""
        } ${review.status === "approved" ? "border-l-4 border-green-500" : ""} ${
          review.status === "rejected" ? "border-l-4 border-red-500" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{review.name}</h3>
            {review.company && review.role && (
              <p className="text-sm text-gray-600">
                {review.role} chez {review.company}
              </p>
            )}
            {review.email && (
              <p className="text-sm text-gray-500">{review.email}</p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
              ${
                review.status === "pending"
                  ? "bg-blue-100 text-blue-800"
                  : review.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {review.status === "pending"
                ? "En attente"
                : review.status === "approved"
                ? "Approuvé"
                : "Refusé"}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-sm font-semibold">{review.rating}/5</span>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">{review.comment}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <MessageCircle size={16} />
            <span>Voir les détails</span>
          </div>
          {review.isPublic && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Public
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
