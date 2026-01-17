import { prisma } from "@/lib/prisma";
import MessageCard from "@/components/ui/message-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminMessagesPage() {
    const messages = await prisma.contact.findMany({
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
            
            <h1 className="text-3xl font-bold mb-8">Messages de contact</h1>
            {messages.length === 0 ? (
                <p className="text-gray-500">Aucun message reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))}
                </div>
            )}
        </div>
    );
}