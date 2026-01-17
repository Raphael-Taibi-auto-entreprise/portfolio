import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import ReviewActions from "@/components/ui/review-actions";

interface ReviewDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
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
          href="/admin/avis"
          className="text-blue-600 hover:text-blue-700"
        >
          Avis
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">{review.name}</h1>
            {review.company && review.role && (
              <p className="text-gray-600">
                {review.role} chez {review.company}
              </p>
            )}
            {review.email && <p className="text-gray-600">{review.email}</p>}
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
            {review.isPublic && (
              <span className="block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Public
              </span>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Note</h3>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-lg font-semibold">{review.rating}/5</span>
          </div>
        </div>

        {/* Commentaire */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Commentaire</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{review.comment}</p>
        </div>

        <ReviewActions review={review} />
      </div>
    </div>
  );
}
