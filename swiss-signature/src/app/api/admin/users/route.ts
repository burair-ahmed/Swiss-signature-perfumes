import { NextResponse } from 'next/server';
import { verifyAdminRole } from '@/lib/auth';
import { getStoredAdmins, addAdminUser } from '@/lib/orders-store';

// GET: View list of admin accounts (Admin or Super Admin only)
export async function GET(request: Request) {
  const authResult = verifyAdminRole(request, ['super_admin', 'admin']);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const admins = getStoredAdmins().map(({ passwordHash: _, ...publicUser }) => publicUser);
  return NextResponse.json({ success: true, admins });
}

// POST: Create a new admin account (SUPER ADMIN ONLY)
export async function POST(request: Request) {
  // Enforce SUPER ADMIN ONLY check
  const authResult = verifyAdminRole(request, ['super_admin']);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error || 'Only the Super Admin can create new admin accounts.' },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const assignedRole = role === 'super_admin' ? 'super_admin' : 'admin';
    const newAdmin = addAdminUser(name, email, password, assignedRole);

    return NextResponse.json({
      success: true,
      message: `New ${assignedRole} account created successfully.`,
      user: newAdmin,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create admin user.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
