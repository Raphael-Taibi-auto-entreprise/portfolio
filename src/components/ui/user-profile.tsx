"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, UserCircle, ChevronDown, LayoutDashboard, FileText, MessageSquare } from "lucide-react";
import { useDropdown } from "@/hooks/ui/useDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/ui/useToast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const { isOpen, toggle, dropdownRef } = useDropdown();
  const router = useRouter();
  const toast = useToast();
  
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadQuotes, setUnreadQuotes] = useState(0);

  /* Gérer les notifications SSE */
  useNotifications((event) => {
    switch (event.type) {
      case "new_message":
        setUnreadMessages(prev => prev + 1);
        toast.info("Nouveau message reçu");
        break;
      
      case "message_reply":
        setUnreadMessages(prev => prev + 1);
        toast.info("Nouvelle réponse à votre message");
        break;
      
      case "quote_status_changed":
        setUnreadQuotes(prev => prev + 1);
        toast.info(`Devis ${event.data.status === "approved" ? "approuvé" : "rejeté"}`);
        break;
      
      case "new_quote":
        setUnreadQuotes(prev => prev + 1);
        toast.info("Nouvelle demande de devis");
        break;
      
      case "new_review":
        toast.info("Nouvel avis soumis");
        break;
    }
  });

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
                onClick={() => setUnreadQuotes(0)}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Mes devis</span>
                </div>
                {unreadQuotes > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadQuotes}
                  </span>
                )}
              </Link>

              <Link
                href="/mes-messages"
                onClick={() => setUnreadMessages(0)}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span>Mes messages</span>
                </div>
                {unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Messages et devis admin */}
          {session.user?.role === "admin" && (
            <>
              <Link
                href="/admin/messages"
                onClick={() => setUnreadMessages(0)}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </div>
                {unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <Link
                href="/admin/quotes"
                onClick={() => setUnreadQuotes(0)}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Devis</span>
                </div>
                {unreadQuotes > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadQuotes}
                  </span>
                )}
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
