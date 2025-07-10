import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      postalCode,
      city,
    } = await request.json();

    // Validation des données
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !postalCode ||
      !city
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    try {
      const existingUser = await prisma.customer.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Un compte avec cet email existe déjà" },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.log("Erreur de connexion à la base de données, mode démo activé");

      // Mode démo pour admin
      if (email === "admin@deltagum.com") {
        const token = jwt.sign(
          {
            userId: "demo-admin-id",
            email: email,
            role: "ADMIN",
          },
          process.env.JWT_SECRET || "fallback-secret",
          { expiresIn: "7d" }
        );

        const response = NextResponse.json({
          message: "Inscription réussie (mode démo)",
          user: {
            id: "demo-admin-id",
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: "ADMIN",
          },
        });

        response.cookies.set("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 jours
        });

        return response;
      }

      return NextResponse.json(
        {
          error:
            "Base de données temporairement indisponible. Veuillez réessayer plus tard.",
        },
        { status: 503 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur (admin si email spécifique)
    const isAdmin = email === "admin@deltagum.com";

    let user;
    try {
      user = await prisma.customer.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          address,
          postalCode,
          city,
          role: isAdmin ? "ADMIN" : "USER",
          updatedAt: new Date(),
        },
      });
    } catch (dbError) {
      console.log("Erreur lors de la création de l'utilisateur:", dbError);
      return NextResponse.json(
        {
          error:
            "Erreur lors de la création du compte. Base de données indisponible.",
        },
        { status: 503 }
      );
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      message: "Inscription réussie",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    // Définir le cookie HTTP-only
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
