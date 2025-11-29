import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  console.log("🔐 Proxy executing for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  console.log("🔑 Token:", token);

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Pas de token = pas connecté
    if (!token) {
      console.log("❌ No token - redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Pas admin = pas accès
    if (token.role !== "admin") {
      console.log("❌ Not admin - redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("✅ Admin access granted");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
