import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware disabled - Admin panel accessible without authentication
export function middleware(request: NextRequest) {
  // Allow all admin routes without authentication
  return NextResponse.next();
}

export const config = {
  matcher: '/adminnn/:path*',
};
