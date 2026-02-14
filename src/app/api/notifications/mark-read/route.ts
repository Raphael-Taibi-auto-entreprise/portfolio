import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Marque les notifications d'un type comme lues
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Non authentifié", { status: 401 });
  }

  try {
    const { type } = await request.json();
    
    /* Pour l'instant, on ne stocke pas les notifications vues en DB */
    /* On retourne juste success pour que le client puisse reset son compteur */
    
    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error("Erreur marquage notification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
