import { prisma } from '@/lib/prisma';

export default async function AdminDevisPage() {
    const quotes = await prisma.quote.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-bold mb-8'>Gestion des Devis</h1>

            {quotes.length === 0 ? (
                <p className="text-gray-500">Aucun devis reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <div key={quote.id}
                            className={`bg-white rounded-lg shadow p-6 ${quote.status === 'pending' ? 'border-l-4 border-blue-500' : ''}`}>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='font-bold text-lg'>{quote.name}</h3>
                                    <p className='text-sm text-gray-600'>{quote.email}</p>
                                    {quote.phone && (<p className='text-sm text-gray-600'>Téléphone: {quote.phone}</p>
                                    )}
                                    {quote.company && (<p className='text-sm text-gray-500 italic'>Entreprise: {quote.company}</p>
                                    )}
                                </div>
                                <div className='text-right'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                    ${quote.status === 'pending'
                                            ? 'bg-blue-100 text-blue-800'
                                            : quote.status === 'reviewed'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : quote.status === 'accepted'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {quote.status === 'pending' ? 'En attente' : quote.status === 'reviewed' ? 'En révision' : quote.status === 'accepted' ? 'Accepté' : 'Refusé'}
                                    </span>
                                    <p className='text-xs text-gray-500 mt-2'>{new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit' 
                                    })}
                                    </p>
                                </div>
                            </div>
                            <div className='grid grid-col-2 gap-4 mb-4 text-sm'>
                                <div>
                                    <span className='font-semibold'>Type de projet:</span> {quote.projectType}
                                </div>
                                {quote.budget && (
                                    <div>
                                        <span className='font-semibold'>Budget:</span> {quote.budget} €
                                </div>
                                )}
                                {quote.deadline && (
                                    <div>
                                        <span className='font-semibold'>Deadline:</span> {quote.deadline}
                                    </div>
                                )}    
                            </div>
                            <div className='border-t pt-4'>
                                <p className='font-semibold mb-2'>Description du projet:</p>
                                <p className='text-gray-700 whitespace-pre-wrap'>{quote.description}</p>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}