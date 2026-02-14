/**
 * Gestionnaire SSE pour gérer les connexions clients et l'émission d'événements
 * Permet d'envoyer des notifications en temps réel aux utilisateurs connectés
 */

type SSEClient = {
  userId: string;
  role: string;
  controller: ReadableStreamDefaultController;
  signal: AbortSignal;
};

class SSEManager {
  private clients: Map<string, SSEClient[]> = new Map();

  /**
   * Ajoute un nouveau client SSE
   */
  addClient(userId: string, role: string, controller: ReadableStreamDefaultController, signal: AbortSignal) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    
    this.clients.get(userId)!.push({ userId, role, controller, signal });
    console.log(`[SSEManager] Client ajouté: ${userId} (${role}), total clients: ${this.clients.size}`);
    
    /* Nettoyer à la déconnexion */
    signal.addEventListener('abort', () => {
      this.removeClient(userId, controller);
    });
  }

  /**
   * Retire un client SSE
   */
  removeClient(userId: string, controller: ReadableStreamDefaultController) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const filtered = userClients.filter(c => c.controller !== controller);
      if (filtered.length === 0) {
        this.clients.delete(userId);
      } else {
        this.clients.set(userId, filtered);
      }
    }
  }

  /**
   * Envoie un événement à un utilisateur spécifique
   */
  sendToUser(userId: string, event: { type: string; data: any }) {
    console.log(`[SSEManager] Envoi à user ${userId}:`, event.type);
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = `data: ${JSON.stringify(event)}\n\n`;
      userClients.forEach(client => {
        try {
          client.controller.enqueue(new TextEncoder().encode(message));
          console.log(`[SSEManager] ✓ Message envoyé à ${userId}`);
        } catch (error) {
          console.error('[SSEManager] Erreur envoi SSE:', error);
        }
      });
    } else {
      console.log(`[SSEManager] ⚠ Aucun client connecté pour ${userId}`);
    }
  }

  /**
   * Envoie un événement à tous les admins connectés
   */
  sendToAdmins(event: { type: string; data: any; }, id: string) {
    console.log(`[SSEManager] Envoi aux admins:`, event.type);
    const message = `data: ${JSON.stringify(event)}\n\n`;
    let adminCount = 0;
    
    this.clients.forEach((clients) => {
      clients.forEach(client => {
        if (client.role === 'admin') {
          adminCount++;
          try {
            client.controller.enqueue(new TextEncoder().encode(message));
          } catch (error) {
            console.error('Erreur envoi SSE:', error);
          }
        }
      });
    });
    
    console.log(`[SSEManager] Message envoyé à ${adminCount} admin(s)`);
  }

  /**
   * Envoie un keepalive à tous les clients
   */
  sendKeepalive() {
    const message = `: keepalive\n\n`;
    this.clients.forEach((clients) => {
      clients.forEach(client => {
        try {
          client.controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
          /* Client déconnecté, sera nettoyé par abort signal */
        }
      });
    });
  }
}

/* Instance singleton avec globalThis pour persister entre les rebuilds Next.js */
const globalForSSE = globalThis as unknown as {
  sseManager: SSEManager | undefined;
};

if (!globalForSSE.sseManager) {
  globalForSSE.sseManager = new SSEManager();
}

export const sseManager = globalForSSE.sseManager;

/* Keepalive toutes les 30 secondes */
if (typeof window === 'undefined') {
  setInterval(() => {
    sseManager.sendKeepalive();
  }, 30000);
}
