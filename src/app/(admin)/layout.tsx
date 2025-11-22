import React from "react";
import Link from "next/link";

export default function AdminLayout({ children } : {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
                <nav>
                    <ul className="space-y-2">
                        <li><Link href="/admin" className="block hover:text-gray-300">Dashboard</Link></li>
                        <li><Link href="/messages" className="block hover:text-gray-300">Messages</Link></li>
                        <li><Link href="/devis" className="block hover:text-gray-300">Devis</Link></li>
                        <li><Link href="/avis" className="block hover:text-gray-300">Avis</Link></li>
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}