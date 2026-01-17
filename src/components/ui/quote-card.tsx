"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

interface QuoteCardProps {
  quote: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    projectType: string;
    budget: string | null;
    deadline: string | null;
    description: string;
    status: string;
    createdAt: Date;
  };
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <Link href={`/admin/devis/${quote.id}`}>
      <div
        className={`bg-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
          quote.status === "pending" ? "border-l-4 border-blue-500" : ""
        } ${quote.status === "approved" ? "border-l-4 border-green-500" : ""} ${
          quote.status === "rejected" ? "border-l-4 border-red-500" : ""
        } ${quote.status === "negotiating" ? "border-l-4 border-yellow-500" : ""}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{quote.name}</h3>
            <p className="text-sm text-gray-600">{quote.email}</p>
            {quote.company && (
              <p className="text-sm text-gray-500 italic">Entreprise: {quote.company}</p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
              ${
                quote.status === "pending"
                  ? "bg-blue-100 text-blue-800"
                  : quote.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : quote.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {quote.status === "pending"
                ? "En attente"
                : quote.status === "approved"
                ? "Approuvé"
                : quote.status === "rejected"
                ? "Refusé"
                : "Négociation"}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(quote.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <p className="text-sm">
            <span className="font-semibold">Type:</span> {quote.projectType}
          </p>
          {quote.budget && (
            <p className="text-sm">
              <span className="font-semibold">Budget:</span> {quote.budget}
            </p>
          )}
          {quote.deadline && (
            <p className="text-sm">
              <span className="font-semibold">Délai:</span> {quote.deadline}
            </p>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">{quote.description}</p>

        <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
          <FileText size={16} />
          <span>Voir les détails</span>
        </div>
      </div>
    </Link>
  );
}
