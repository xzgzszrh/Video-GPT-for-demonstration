import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /protected, /api/user)
  const path = request.nextUrl.pathname;
  
  // If it's the root path or the auth path, don't check for authentication
  if (path === '/' || path === '/auth' || path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }
  
  // Check if the user is authenticated
  const authCookie = request.cookies.get('auth-token');
  const isAuthenticated = authCookie?.value === process.env.PASSWORD;
  
  // If not authenticated and not trying to access the auth page, redirect to auth
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth).*)'],
};
