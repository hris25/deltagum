import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Fonction pour récupérer l'utilisateur depuis le token
function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    return decoded;
  } catch {
    return null;
  }
}

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const userProfile = await prisma.customer.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        postalCode: true,
        city: true,
        createdAt: true,
        role: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: userProfile },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, address, postalCode, city } = body;

    // Validation basique
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: "Prénom, nom et email sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== user.email) {
      const existingUser = await prisma.customer.findFirst({
        where: {
          email: email,
          id: { not: user.userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.customer.update({
      where: { id: user.userId },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        postalCode: postalCode || null,
        city: city || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        postalCode: true,
        city: true,
        createdAt: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
