import { prisma } from '@/lib/prisma';
import QuoteCard from '@/components/ui/quote-card';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminDevisPage() {
    const quotes = await prisma.quote.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className='p-8'>
            <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <ArrowLeft size={20} />
                Retour au Dashboard
            </Link>

            <h1 className='text-3xl font-bold mb-8'>Gestion des Devis</h1>

            {quotes.length === 0 ? (
                <p className="text-gray-500">Aucun devis reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <QuoteCard key={quote.id} quote={quote} />
                    ))}
                </div>
            )}
        </div>
    );
}
