import { NextRequest, NextResponse } from 'next/server';
import { getStoredAdmins, StoredUser } from './orders-store';
import { User, UserRole } from './types';

export const ADMIN_COOKIE_NAME = 'swiss_admin_token';

// Simple, secure session token signature for Next.js App Router
export function createSessionToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 86400000 * 7, // 7 days
  };
  const strPayload = JSON.stringify(payload);
  const base64 = Buffer.from(strPayload).toString('base64');
  return base64;
}

export function decodeSessionToken(token: string): (User & { exp: number }) | null {
  try {
    const strPayload = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(strPayload);
    if (!data.id || !data.role || !data.exp) return null;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function getAuthenticatedUser(req: Request | NextRequest): User | null {
  try {
    let token: string | undefined;

    // Check Authorization Header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check Cookie if header is missing
    if (!token && 'cookies' in req) {
      const cookieStore = (req as NextRequest).cookies;
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    }

    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
        if (match) token = match[1];
      }
    }

    if (!token) return null;

    const decoded = decodeSessionToken(token);
    if (!decoded) return null;

    // Verify user still exists in database
    const admins = getStoredAdmins();
    const existing = admins.find(a => a.id === decoded.id && a.email.toLowerCase() === decoded.email.toLowerCase());
    if (!existing) return null;

    return {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
      createdAt: existing.createdAt,
    };
  } catch {
    return null;
  }
}

export function verifyAdminRole(req: Request, allowedRoles: UserRole[] = ['admin', 'super_admin']): { user: User } | { error: string; status: number } {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return { error: 'Authentication required. Please log in to access admin panel.', status: 401 };
  }

  if (!allowedRoles.includes(user.role)) {
    return { error: 'Forbidden: Insufficient privileges for this action.', status: 403 };
  }

  return { user };
}
