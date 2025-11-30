import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
    const messages = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Messages de contact</h1>
            {messages.length === 0 ? (
                <p className="text-gray-500">Aucun message reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`bg-white rounded-lg p-6 ${message.status === 'unread' ? 'border-l-4 border-blue-500' : ''}`}
                        >
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='font-bold text-lg'>{message.name}</h3>
                                    <p className='text-sm text-gray-600'>{message.email}</p>
                                    {message.subject && (<p className='text-sm text-gray-600 italic'>Sujet: {message.subject}</p>
                                    )}
                                </div>
                                <div className='text-right'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                    ${message.status === 'unread'
                                            ? 'bg-blue-100 text-blue-800'
                                            : message.status === 'read'
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                        {message.status === 'unread' ? 'Non lu' : message.status === 'read' ? 'Lu' : 'Répondu'}
                                    </span>
                                    <p className='text-xs text-gray-500 mt-5'>{new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </p>
                                </div>
                            </div>
                            <p className='text-gray-700 whitespace-pre-wrap'>{message.message}</p>
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}