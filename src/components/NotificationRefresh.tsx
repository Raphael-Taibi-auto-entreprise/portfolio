"use client";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";

/**
 * Composant pour rafraîchir automatiquement les pages lors de nouvelles notifications
 * À utiliser dans les layouts ou pages qui doivent être mises à jour en temps réel
 */
export default function NotificationRefresh({ types }: { types?: string[] }) {
  const router = useRouter();

  useNotifications((event) => {
    if (!types || types.includes(event.type)) {
      router.refresh();
    }
  });

  return null;
}
