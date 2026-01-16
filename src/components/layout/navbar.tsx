"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import UserProfile from "@/components/ui/user-profile";

export default function Navbar() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-gray-300">
            <Home size={24} />
            <span>Portfolio</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/home" className="hover:text-gray-300">
              Accueil
            </Link>
            <Link href="/avis" className="hover:text-gray-300">
              Avis
            </Link>
            <Link href="/devis" className="hover:text-gray-300">
              Devis
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>

            <UserProfile />
          </div>
        </div>
      </nav>
    </header>
  );
}
