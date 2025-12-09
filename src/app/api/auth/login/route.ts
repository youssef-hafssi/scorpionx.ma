import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyAdminCredentials, 
  createAdminToken,
  createAdminSession,
  updateLastLogin 
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials against database
    const user = await verifyAdminCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createAdminToken(user);
    
    // Create session token
    const sessionToken = crypto.randomUUID();

    // Save session to database
    const sessionCreated = await createAdminSession(user.id, sessionToken);
    
    if (!sessionCreated) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Update last login
    await updateLastLogin(user.id);    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only cookies with production-friendly settings
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      // In production, set domain to allow cookies across all subdomains
      ...(isProduction && { domain: '.scorpionx.ma' }),
    };

    response.cookies.set('admin-token', token, cookieOptions);
    response.cookies.set('admin-session', sessionToken, cookieOptions);

    console.log('Login successful for:', email);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Cookie options:', cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
