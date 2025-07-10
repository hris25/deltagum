import { existsSync, mkdirSync } from "fs";
import { readdir, stat, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP",
        },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Fichier trop volumineux. Maximum 5MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Sauvegarder le fichier
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Retourner l'URL du fichier
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
}

// API pour lister les images uploadées
export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ success: true, images: [] });
    }

    const files = await readdir(uploadsDir);

    const images = await Promise.all(
      files
        .filter((file: string) => {
          const ext = file.toLowerCase();
          return (
            ext.endsWith(".jpg") ||
            ext.endsWith(".jpeg") ||
            ext.endsWith(".png") ||
            ext.endsWith(".webp")
          );
        })
        .map(async (file: string) => {
          const stats = await stat(join(uploadsDir, file));
          return {
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images" },
      { status: 500 }
    );
  }
}
