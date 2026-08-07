import { NextResponse } from 'next/server';
import { getStoredAdmins } from '@/lib/orders-store';
import { createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const admins = getStoredAdmins();
    const admin = admins.find(a => a.email.toLowerCase() === normalizedEmail);

    if (!admin || admin.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };

    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      token,
      message: 'Login successful',
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
