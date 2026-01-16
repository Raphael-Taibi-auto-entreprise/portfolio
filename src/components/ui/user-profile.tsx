"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
      >
        <User size={20} />
        <span>Se connecter</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user?.role === "admin" && (
        <Link href="/admin" className="hover:text-gray-300">
          Admin
        </Link>
      )}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
        <User size={20} />
        <span className="text-sm">{session.user?.name}</span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
        title="Déconnexion"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
