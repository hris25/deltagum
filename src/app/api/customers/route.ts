import { sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// GET /api/customers - Récupérer les clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const where = email ? { email } : {};
    const take = limit ? parseInt(limit) : undefined;
    const skip = offset ? parseInt(offset) : undefined;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            take: 5, // Dernières 5 commandes
          },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.customer.count({ where }),
    ]);

    const response: ApiResponse = {
      success: true,
      data: { customers, total },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customers:", error);

    const response: ApiResponse = {
      success: false,
      error: "Erreur lors de la récupération des clients",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/customers - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = customerSchema.parse(body);

    // Vérifier si le client existe déjà
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: validatedData.email },
    });

    if (existingCustomer) {
      const response: ApiResponse = {
        success: false,
        error: "Un client avec cet email existe déjà",
      };
      return NextResponse.json(response, { status: 409 });
    }

    // Créer le client avec son programme de fidélité
    const customer = await prisma.customer.create({
      data: {
        email: validatedData.email,
        password: validatedData.password || "",
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || "",
        address: validatedData.address || "",
        postalCode: validatedData.postalCode || "",
        city: validatedData.city || "",
        id: globalThis.crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });

    // Envoyer l'email de bienvenue
    try {
      await sendWelcomeEmail(
        customer.email,
        `${customer.firstName} ${customer.lastName}`
      );
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Ne pas faire échouer la création pour un problème d'email
    }

    const response: ApiResponse = {
      success: true,
      data: customer,
      message: "Client créé avec succès",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);

    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du client",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
