import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = process.env.AUTH_SECRET || 'change-me-in-production-please-32chars-min';
const COOKIE = 'lb_session';
const ALG = 'HS256';

const getKey = () => new TextEncoder().encode(SECRET);

export interface SessionPayload {
  sub: string;
  email: string;
  name?: string;
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: [ALG] });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

export function destroySession() {
  cookies().set(COOKIE, '', { path: '/', maxAge: 0 });
}
