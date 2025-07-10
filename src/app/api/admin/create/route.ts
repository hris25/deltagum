import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const adminEmail = "admin@deltagum.com";
    const adminPassword = "admin123";

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.customer.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin existe déjà",
        admin: {
          email: existingAdmin.email,
          role: existingAdmin.role,
        },
      });
    }

    // Créer l'admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.customer.create({
      data: {
        id: globalThis.crypto.randomUUID(),
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Deltagum",
        phone: "+33123456789",
        address: "123 Rue de l'Administration",
        postalCode: "75001",
        city: "Paris",
        role: "ADMIN",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Admin créé avec succès",
      admin: {
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: "admin@deltagum.com",
        password: "admin123",
      },
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'admin:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'admin" },
      { status: 500 }
    );
  }
}
