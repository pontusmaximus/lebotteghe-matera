import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = process.env.AUTH_SECRET || 'change-me-in-production-please-32chars-min';
const COOKIE = 'lb_session';

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET), { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

const PROTECTED = /^\/(it|de|en)\/admin(?!\/login)(\/|$)/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Expose pathname to layouts so they can decide rendering
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);

  if (PROTECTED.test(pathname)) {
    const ok = await isAuthed(req);
    if (!ok) {
      const locale = pathname.split('/')[1] || 'it';
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/|api/|images/|favicon|.*\\.).*)'],
};
