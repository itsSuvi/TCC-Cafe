import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Default credentials or environment configured credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@classiccrush.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'adm-001',
          name: 'Executive Chef / Manager',
          email: adminEmail,
          role: 'SUPER_ADMIN',
        },
        token: `mock_admin_token_${Date.now()}`,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin email or password' }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
