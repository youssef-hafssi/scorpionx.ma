import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, verifyAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    const sessionToken = request.cookies.get('admin-session')?.value;

    if (!token || !sessionToken) {
      return NextResponse.json(
        { authenticated: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const user = verifyAdminToken(token);

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify session exists in database
    const sessionValid = await verifyAdminSession(sessionToken, user.id);

    if (!sessionValid) {
      return NextResponse.json(
        { authenticated: false, error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
