import { NextRequest, NextResponse } from "next/server";

interface AuthUser {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function middleware(request: NextRequest) {
  // DÉSACTIVÉ TEMPORAIREMENT - Aucune protection pour faciliter l'accès

  // Vous pouvez réactiver cette protection plus tard si nécessaire
  // const pathname = request.nextUrl.pathname;
  // if (pathname.startsWith("/admin")) {
  //   const token = request.cookies.get("auth-token")?.value;
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/auth", request.url));
  //   }
  // }

  // Laisser passer toutes les requêtes
  return NextResponse.next();
}

export const config = {
  // Désactivé temporairement - aucune route n'est interceptée
  matcher: [],
};
