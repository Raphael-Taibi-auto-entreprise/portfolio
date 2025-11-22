import React from "react";

export default function AdminLayout({ children } : {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
                <nav>
                    <ul>
                        <li><a href="/admin" className="hover:text-gray-300">Dashboard</a></li>
                        <li><a href="/admin/messages" className="hover:text-gray-300">Messages</a></li>
                        <li><a href="/admin/devis" className="hover:text-gray-300">Devis</a></li>
                        <li><a href="/admin/avis" className="hover:text-gray-300">Avis</a></li>
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}