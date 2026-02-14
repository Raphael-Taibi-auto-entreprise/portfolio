import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Récupère les statistiques du dashboard admin
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return new Response("Non autorisé", { status: 403 });
  }

  try {
    const [totalMessages, totalQuotes, totalReviews, projectsCount] = await Promise.all([
      prisma.contact.count(),
      prisma.quote.count(),
      prisma.review.count(),
      prisma.project.count(),
    ]);

    return NextResponse.json({
      totalMessages,
      totalQuotes,
      totalReviews,
      projectsCount,
    });
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
