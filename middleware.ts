import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Auth temporarily disabled for development
// import { auth } from "@/lib/auth"

// TEMPORARILY DISABLED - Enable when auth is properly configured
// Protected routes that require authentication
// const protectedRoutes = [
//   "/dashboard",
//   "/campaigns",
//   "/sponsors",
//   "/reports",
//   "/settings",
//   "/onboarding",
// ]

export async function middleware(request: NextRequest) {
  // Temporarily allow all routes for development
  // Auth will be enabled once database is connected
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
