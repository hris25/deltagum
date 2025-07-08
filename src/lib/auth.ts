import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          // Pour le développement, nous acceptons n'importe quel email/mot de passe
          // En production, vous devriez vérifier contre votre base de données
          if (email && password) {
            // Chercher ou créer le client
            let customer = await prisma.customer.findUnique({
              where: { email },
            });

            if (!customer) {
              // Créer un nouveau client si il n'existe pas
              customer = await prisma.customer.create({
                data: {
                  email,
                  firstName: email.split("@")[0],
                  lastName: "User",
                  loyalty: {
                    create: {
                      points: 0,
                      level: "BRONZE",
                    },
                  },
                },
              });
            }

            return {
              id: customer.id,
              email: customer.email,
              name: `${customer.firstName} ${customer.lastName}`,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};
