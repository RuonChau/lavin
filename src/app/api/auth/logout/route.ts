import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAMES = [
  'access_token',
  'refresh_token',
  'accessToken',
  'refreshToken',
  'token',
  'session',
  'sessionid',
  'jwt',
  'Authorization',
];

export async function POST() {
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });
  const cookieNames = new Set([
    ...AUTH_COOKIE_NAMES,
    ...cookieStore.getAll().map((cookie) => cookie.name),
  ]);

  cookieNames.forEach((name) => {
    response.cookies.delete(name);
    response.cookies.set(name, '', {
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });
  });

  return response;
}
