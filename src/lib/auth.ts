// Database-based Admin Authentication with Supabase
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface JWTPayload extends AdminUser {
  iat: number;
  exp: number;
}

// Verify admin credentials against database
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !user) {
      console.error('User not found:', error);
      return null;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      console.error('Invalid password');
      return null;
    }

    // Return user data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error('Credential verification error:', error);
    return null;
  }
}

// Create JWT token
export function createAdminToken(user: AdminUser): string {
  const payload: AdminUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });
}

// Verify JWT token
export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = verify(token, JWT_SECRET) as JWTPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Create session in database
export async function createAdminSession(
  userId: string,
  sessionToken: string
): Promise<boolean> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      console.error('Session creation error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session creation failed:', error);
    return false;
  }
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Failed to update last login:', error);
  }
}

// Delete session from database
export async function deleteAdminSession(sessionToken: string): Promise<void> {
  try {
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken);
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

// Verify session in database
export async function verifyAdminSession(
  sessionToken: string,
  userId: string
): Promise<boolean> {
  try {
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session verification failed:', error);
    return false;
  }
}
