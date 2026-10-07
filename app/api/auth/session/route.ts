import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds
  const cookieStore = await cookies();
  cookieStore.set('session', idToken, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return NextResponse.json({ status: 'success' });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return NextResponse.json({ isLogged: false }, { status: 401 });
  return NextResponse.json({ isLogged: true });
}
