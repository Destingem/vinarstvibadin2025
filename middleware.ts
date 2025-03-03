import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

// This middleware runs only on /admin/* routes EXCEPT for /admin/login
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip this check entirely for the login page to prevent redirect loops
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }
  
  // For all other /admin/* paths, check for authentication
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // If no token exists, redirect to login
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // User is authenticated, allow access
  return NextResponse.next()
}

// IMPORTANT: Only run this middleware on admin routes EXCEPT login
export const config = {
  matcher: [
    // Only protect admin routes, explicitly exclude login page
    '/admin/((?!login).*)',
  ]
}
