"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, UserCircle, ChevronDown, LayoutDashboard, FileText, MessageSquare } from "lucide-react";
import { useDropdown } from "@/hooks/ui/useDropdown";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const { isOpen, toggle, dropdownRef } = useDropdown();

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
    <div className="relative" ref={dropdownRef}>
      {/* Bouton du profil */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
      >
        <User size={20} />
        <span className="text-sm">{session.user?.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-800">
          {/* Header du menu */}
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold">{session.user?.name}</p>
            <p className="text-xs text-gray-500">{session.user?.email}</p>
          </div>

          {/* Options du menu */}
          <Link
            href="/mon-compte"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            <UserCircle size={18} />
            <span>Mon compte</span>
          </Link>

          {/* Mes devis et messages : uniquement pour les utilisateurs non-admin */}
          {session.user?.role !== "admin" && (
            <>
              <Link
                href="/mes-devis"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <FileText size={18} />
                <span>Mes devis</span>
              </Link>

              <Link
                href="/mes-messages"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <MessageSquare size={18} />
                <span>Mes messages</span>
              </Link>
            </>
          )}

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            <Settings size={18} />
            <span>Paramètres</span>
          </Link>

          {/* Administration : uniquement pour les admins */}
          {session.user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>Administration</span>
            </Link>
          )}

          <hr className="my-2 border-gray-200" />

          {/* Déconnexion */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
    </div>
  );
}
