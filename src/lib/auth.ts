import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    /* Chercher l'utilisateur par email */
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    /* Si pas d'utilisateur, retourner null */
                    if (!user) return null;

                    /* Vérifier le mot de passe */
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) return null;

                    /* Retourner l'utilisateur (sans le password!) */
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.username,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Erreur lors de l'authentification:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        /** Ajouter le rôle et l'id dans le JWT */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        /** Ajouter le rôle et l'id dans la session */
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
};
