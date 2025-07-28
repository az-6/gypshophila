import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple password-based authentication for admin
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gypshophila2024";

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if admin is authenticated
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";

    if (!isAuthenticated) {
      // Redirect to login page (we'll create this)
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
