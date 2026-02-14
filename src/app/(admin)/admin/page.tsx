"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState([
        { title: "Messages", count: 0, pending: 0, color: "bg-blue-500", href: "/admin/messages" },
        { title: "Devis", count: 0, pending: 0, color: "bg-green-500", href: "/admin/devis" },
        { title: "Avis", count: 0, pending: 0, color: "bg-yellow-500", href: "/admin/avis" },
        { title: "Projets publiés", count: 0, pending: 0, color: "bg-red-500", href: "/admin/projets" },
    ]);

    /* Charger les statistiques initiales */
    useEffect(() => {
        const loadStats = async () => {
            const [statsRes, notifRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/notifications/count')
            ]);
            
            const statsData = await statsRes.json();
            const notifData = await notifRes.json();

            setStats([
                { title: "Messages", count: statsData.totalMessages, pending: notifData.unreadMessages || 0, color: "bg-blue-500", href: "/admin/messages" },
                { title: "Devis", count: statsData.totalQuotes, pending: notifData.unreadQuotes || 0, color: "bg-green-500", href: "/admin/devis" },
                { title: "Avis", count: statsData.totalReviews, pending: notifData.pendingReviews || 0, color: "bg-yellow-500", href: "/admin/avis" },
                { title: "Projets publiés", count: statsData.projectsCount, pending: 0, color: "bg-red-500", href: "/admin/projets" },
            ]);
        };

        loadStats();
    }, []);

    /* Écouter les notifications SSE pour mettre à jour en temps réel */
    useNotifications((event) => {
        if (event.type === "new_message") {
            setStats(prev => prev.map(s => 
                s.title === "Messages" ? { ...s, pending: s.pending + 1 } : s
            ));
            router.refresh();
        } else if (event.type === "quote_status_changed") {
            router.refresh();
        }
    });

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