"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export type NotificationEvent = {
  type: "new_message" | "message_reply" | "quote_status_changed" | "new_quote" | "new_review" | "connected";
  data: any;
};

/**
 * Hook pour gérer les notifications SSE en temps réel
 * Se connecte automatiquement au stream et gère les événements
 */
export function useNotifications(onNotification?: (event: NotificationEvent) => void) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  const addNotification = useCallback((event: NotificationEvent) => {
    if (event.type !== "connected") {
      setNotifications(prev => [...prev, event]);
      onNotification?.(event);
    }
  }, [onNotification]);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      /* Créer la connexion SSE */
      eventSource = new EventSource("/api/notifications/stream");

      eventSource.onopen = () => {
        setIsConnected(true);
        console.log("SSE connecté");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as NotificationEvent;
          addNotification(data);
        } catch (error) {
          console.error("Erreur parsing SSE:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("Erreur SSE:", error);
        setIsConnected(false);
        eventSource?.close();

        /* Reconnexion automatique après 5 secondes */
        reconnectTimeout = setTimeout(() => {
          console.log("Tentative de reconnexion SSE...");
          connect();
        }, 5000);
      };
    };

    connect();

    /* Nettoyage */
    return () => {
      clearTimeout(reconnectTimeout);
      eventSource?.close();
      setIsConnected(false);
    };
  }, [session, addNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    notifications,
    clearNotifications,
  };
}
