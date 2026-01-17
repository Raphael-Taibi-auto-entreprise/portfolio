'use client';

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SessionInfoProps {
  session: Session | null;
}

export default function SessionInfo({ session }: SessionInfoProps) {
  return (
    <div className="border rounded-lg p-6 bg-gray-50 max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Session Info (temporaire)</h2>
      
      {!session && (
        <div>
          <p className="text-red-600 mb-4">❌ Non connecté</p>
          <div className="space-x-2">
            <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
            <span>|</span>
            <a href="/register" className="text-blue-600 hover:underline">S'inscrire</a>
          </div>
        </div>
      )}

      {session && (
        <div>
          <p className="text-green-600 mb-4">✅ Connecté</p>
          <div className="space-y-2 mb-4">
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Nom:</strong> {session.user?.name}</p>
            <p><strong>Rôle:</strong> {session.user?.role}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
