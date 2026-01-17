import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuoteActions from "@/components/ui/quote-actions";

interface QuoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;
  
  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
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
          href="/admin/devis"
          className="text-blue-600 hover:text-blue-700"
        >
          Devis
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">{quote.name}</h1>
            <p className="text-gray-600">{quote.email}</p>
            {quote.phone && <p className="text-gray-600">{quote.phone}</p>}
            {quote.company && (
              <p className="text-gray-600 italic mt-1">Entreprise: {quote.company}</p>
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
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Type de projet</h3>
            <p className="text-gray-800">{quote.projectType}</p>
          </div>

          {quote.budget && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Budget</h3>
              <p className="text-gray-800">{quote.budget}</p>
            </div>
          )}

          {quote.deadline && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Délai souhaité</h3>
              <p className="text-gray-800">{quote.deadline}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description du projet</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{quote.description}</p>
          </div>
        </div>

        <QuoteActions quote={quote} />
      </div>
    </div>
  );
}
