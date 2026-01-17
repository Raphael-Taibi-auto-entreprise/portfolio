import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.log("Session invalide ou email manquant");
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log("Données reçues:", data);
    
    const { firstName, lastName, phone, address, postalCode, city, country } = data;

    /* Mise à jour des informations utilisateur */
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName,
        lastName,
        phone,
        address,
        postalCode,
        city,
        country: country || "France",
      },
    });

    console.log("Utilisateur mis à jour:", updatedUser.email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur détaillée lors de la mise à jour:", error);
    console.error("Message d'erreur:", error.message);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
