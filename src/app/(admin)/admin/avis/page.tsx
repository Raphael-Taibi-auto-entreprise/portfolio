import { prisma } from '@/lib/prisma';
import ReviewCard from '@/components/ui/review-card';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminReviewPage() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <ArrowLeft size={20} />
                Retour au Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold mb-8">Gestion des avis</h1>
            
            {reviews.length === 0 ? (
                <p className="text-gray-500">Aucun avis reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}
