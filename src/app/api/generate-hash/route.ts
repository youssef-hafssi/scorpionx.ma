import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - Generate password hash for a given password
// Usage: http://localhost:3000/api/generate-hash?password=hafssi123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  if (!password) {
    return NextResponse.json(
      { error: 'Password parameter is required. Usage: /api/generate-hash?password=yourpassword' },
      { status: 400 }
    );
  }

  try {
    // Generate hash with 10 rounds (same as admin setup)
    const hash = await bcrypt.hash(password, 10);

    return NextResponse.json({
      success: true,
      password: password,
      hash: hash,
      sql: `INSERT INTO admin_users (email, password_hash, role, name, is_active) VALUES
('admin@scorpion.ma', '${hash}', 'super_admin', 'Hafssi Admin', true);`
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hash' },
      { status: 500 }
    );
  }
}
