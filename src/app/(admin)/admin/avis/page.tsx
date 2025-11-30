import { prisma } from '@/lib/prisma';

export default async function AdminReviewPage() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' }
    });

      return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Gestion des avis</h1>
            
            {reviews.length === 0 ? (
                <p className="text-gray-500">Aucun avis reçu pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div 
                            key={review.id}
                            className={`bg-white rounded-lg shadow p-6 ${review.status === 'pending' ? 'border-l-4 border-purple-500' : ''}`}
                        >
                            <div className='flex justify-between items-start mb-4'>
                                <div className='flex-1'>
                                    <h3 className='font-bold text-lg'>{review.name}</h3>
                                    {review.role && review.company && (
                                        <p className='text-sm text-gray-600'>{review.role} chez {review.company}</p>
                                    )}
                                    {review.email && (
                                        <p className='text-sm text-gray-500'>{review.email}</p>
                                    )}
                                    <div className='flex items-center mt-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                ⭐
                                            </span>
                                        ))}
                                        <span className='ml-2 text-sm text-gray-600'>({review.rating}/5)</span>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                        ${review.status === 'pending'
                                            ? 'bg-purple-100 text-purple-800'
                                            : review.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {review.status === 'pending' ? 'En attente' : 
                                         review.status === 'approved' ? 'Approuvé' : 'Refusé'}
                                    </span>
                                    {review.isPublic && (
                                        <p className='text-xs text-green-600 mt-1'>✓ Publié</p>
                                    )}
                                    <p className='text-xs text-gray-500 mt-2'>
                                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className='border-t pt-4'>
                                <p className='text-gray-700 whitespace-pre-wrap'>{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}