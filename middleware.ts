import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC = ['/auth', '/api', '/_next', '/favicon.ico'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Let public assets & the auth page through
	if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

	/* ⬇️ READ the HTTP-only cookie – perfectly allowed on the server */
	const token = req.cookies.get('accessToken')?.value;
	console.log('🚀 ~ middleware ~ token:', token);

	if (!token) {
		// Not authenticated → redirect before the page renders
		const login = req.nextUrl.clone();
		login.pathname = '/auth';
		login.searchParams.set('next', pathname); // so you can redirect back later
		return NextResponse.redirect(login);
	}

	return NextResponse.next(); // token exists → continue
}

export const config = {
	matcher: ['/((?!_next/.*).*)'], // every route except static assets
};
