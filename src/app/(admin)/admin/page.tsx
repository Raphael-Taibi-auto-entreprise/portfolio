import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
    //Recupère les stats 
    const [contactCount, quotesCount, reviewsCount, projectsCount] = await Promise.all([
        prisma.contact.count(),
        prisma.quote.count(),
        prisma.review.count(),
        prisma.project.count(),
    ]);

    const stats = [
        { title: "Messages", count: contactCount, color: "bg-blue-500" },
        { title: "Devis en attente", count: quotesCount, color: "bg-green-500" },
        { title: "Review a validé", count: reviewsCount, color: "bg-yellow-500" },
        { title: "Projets publié", count: projectsCount, color: "bg-red-500" },
    ];

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-bold mb-8'>Dashboard Admin</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {stats.map((stat) => (
                    <div key={stat.title} className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'>
                        <div className={`${stat.color} h-12 w-12 rounded-lg mb-4`}></div>
                        <h3 className='text-gray-600 text-sm font-medium mb-2'>{stat.title}</h3>
                        <p className='text-3xl font-bold'>{stat.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}