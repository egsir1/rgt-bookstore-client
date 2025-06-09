// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_ROUTES = ['/auth', '/api', '/_next', '/favicon.ico'];

// export function middleware(req: NextRequest) {
// 	const { pathname } = req.nextUrl;

// 	// // Allow public routes
// 	// if (PUBLIC_ROUTES.some(publicPath => pathname.startsWith(publicPath))) {
// 	// 	return NextResponse.next();
// 	// }

// 	// Check for access token
// 	const token = req.cookies.get('accessToken')?.value;

// 	if (!token) {
// 		if (pathname === '/') {
// 			return NextResponse.redirect(new URL('/auth', req.url));
// 		}
// 	}

// 	const user = token && decodeToken(token);
// 	const userRole = user?.role;
// 	if (userRole === 'ADMIN' && pathname === '/') {
// 		return NextResponse.redirect(new URL('/mg-dashboard/books', req.url));
// 	}

// 	return NextResponse.next(); // Authenticated
// }
// function decodeToken(token: string) {
// 	try {
// 		const payload = token.split('.')[1];
// 		return JSON.parse(atob(payload));
// 	} catch {
// 		return null;
// 	}
// }

// export const config = {
// 	matcher: ['/((?!_next/.*|favicon.ico).*)'], // Exclude static and public files
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* All routes that anyone can access without a token */
const PUBLIC_ROUTES = ['/auth', '/_next', '/favicon.ico', '/api'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	/* Allow public assets & auth page */
	if (PUBLIC_ROUTES.some(p => pathname.startsWith(p))) {
		return NextResponse.next();
	}

	/*  Get HTTP-only cookie */
	const token = req.cookies.get('accessToken')?.value;

	/*Redirect everyone without a token to /auth */
	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = '/auth';
		url.searchParams.set('next', pathname);
		return NextResponse.redirect(url);
	}

	/* Decode role (no signature verification here) */
	const userRole = decodeToken(token)?.role as string | undefined;

	/*Non-ADMIN hits dashboard → kick to / */
	if (pathname.startsWith('/mg-dashboard') && userRole !== 'ADMIN') {
		return NextResponse.redirect(new URL('/', req.url));
	}

	/* ADMIN hits root “/” → go straight to dashboard */
	if (pathname === '/' && userRole === 'ADMIN') {
		return NextResponse.redirect(new URL('/mg-dashboard/books', req.url));
	}

	return NextResponse.next(); // All good
}

/* quick-and-dirty base64 decode; use a real verifier if needed */
function decodeToken(token: string) {
	try {
		const payload = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString()
		);
		return payload;
	} catch {
		return null;
	}
}

export const config = {
	matcher: ['/(.*)'], // run middleware on every route
};
