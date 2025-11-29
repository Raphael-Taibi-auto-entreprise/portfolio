import { NextRequest, NextResponse } from "next/server";    
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        // Récupérer les données du formulaire
        const { email, username, password } = await req.json();
        // Validation basique
        if (!email || !username || !password) {
          return NextResponse.json(
            { message: "Tous les champs sont requis" },
            { status: 400 }
          );
        }
      
        // Vérifier si l'utilisateur existe déjà
        const existingEmail = await prisma.user.findUnique({
          where: { email },
        });
      
        if (existingEmail) {
          return NextResponse.json(
            { message: "Un utilisateur avec cet email existe déjà." },
            { status: 409 }
          );
        }

        const existingUsername = await prisma.user.findUnique({
          where: { username },
        });
      
        if (existingUsername) {
          return NextResponse.json(
            { message: "Un utilisateur avec ce username existe déjà." },
            { status: 409 }
          );
        }
      
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Creer le nouvel utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Utilisateur créé avec succès", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}