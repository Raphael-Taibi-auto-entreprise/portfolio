"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface MessageCardProps {
  message: {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    createdAt: Date;
  };
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <Link href={`/admin/messages/${message.id}`}>
      <div
        className={`bg-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
          message.status === "unread" ? "border-l-4 border-blue-500" : ""
        } ${message.status === "replied" ? "border-l-4 border-green-500" : ""}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{message.name}</h3>
            <p className="text-sm text-gray-600">{message.email}</p>
            {message.subject && (
              <p className="text-sm text-gray-600 italic">Sujet: {message.subject}</p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
              ${
                message.status === "unread"
                  ? "bg-blue-100 text-blue-800"
                  : message.status === "read"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {message.status === "unread"
                ? "Non lu"
                : message.status === "read"
                ? "Lu"
                : "Répondu"}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-2">{message.message}</p>

        <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
          <MessageSquare size={16} />
          <span>Voir la conversation</span>
        </div>
      </div>
    </Link>
  );
}
