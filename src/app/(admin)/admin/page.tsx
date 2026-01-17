import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default async function AdminDashboardPage() {
    /* Récupère les stats avec filtres sur les statuts */
    const [
        unreadMessages,
        totalMessages,
        pendingQuotes,
        totalQuotes,
        pendingReviews,
        totalReviews,
        projectsCount
    ] = await Promise.all([
        prisma.contact.count({ where: { status: 'unread' } }),
        prisma.contact.count(),
        prisma.quote.count({ where: { status: 'pending' } }),
        prisma.quote.count(),
        prisma.review.count({ where: { status: 'pending' } }),
        prisma.review.count(),
        prisma.project.count(),
    ]);

    const stats = [
        { 
            title: "Messages", 
            count: totalMessages, 
            pending: unreadMessages,
            color: "bg-blue-500", 
            href: "/admin/messages" 
        },
        { 
            title: "Devis", 
            count: totalQuotes, 
            pending: pendingQuotes,
            color: "bg-green-500", 
            href: "/admin/devis" 
        },
        { 
            title: "Avis", 
            count: totalReviews, 
            pending: pendingReviews,
            color: "bg-yellow-500", 
            href: "/admin/avis" 
        },
        { 
            title: "Projets publiés", 
            count: projectsCount, 
            pending: 0,
            color: "bg-red-500", 
            href: "/admin/projets" 
        },
    ];

    return (
        <div className='p-8 bg-gray-50 min-h-screen'>
            <h1 className='text-3xl font-bold mb-8 text-gray-800'>Dashboard Admin</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {stats.map((stat) => (
                    <Link 
                        key={stat.title} 
                        href={stat.href}
                        className='bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer relative'
                    >
                        {/* Badge de notification */}
                        {stat.pending > 0 && (
                            <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg animate-pulse'>
                                {stat.pending}
                            </div>
                        )}
                        
                        <div className={`${stat.color} h-14 w-14 rounded-xl mb-4 flex items-center justify-center shadow-sm`}>
                            {stat.pending > 0 && <Bell className='text-white' size={24} />}
                        </div>
                        <h3 className='text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide'>{stat.title}</h3>
                        <p className='text-4xl font-bold text-gray-800'>{stat.count}</p>
                        {stat.pending > 0 && (
                            <p className='text-sm text-red-600 font-semibold mt-2 flex items-center gap-1'>
                                <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
                                {stat.pending} en attente
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}