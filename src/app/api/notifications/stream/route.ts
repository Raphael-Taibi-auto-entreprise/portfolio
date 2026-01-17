import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sseManager } from "@/lib/sse-manager";

/**
 * Route API SSE pour les notifications en temps réel
 * Les clients se connectent à cette route pour recevoir les événements
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Non authentifié", { status: 401 });
  }

  /* Headers SSE */
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no", /* Pour nginx */
  });

  /* Créer un stream */
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      /* Envoyer un message de connexion */
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected", data: { userId: session.user.id } })}\n\n`)
      );

      /* Ajouter le client au gestionnaire SSE */
      const abortController = new AbortController();
      sseManager.addClient(session.user.id, session.user.role || "user", controller, abortController.signal);

      /* Nettoyer à la fermeture */
      request.signal.addEventListener("abort", () => {
        abortController.abort();
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}
