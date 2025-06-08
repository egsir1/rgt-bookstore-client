import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth', '/api', '/_next', '/favicon.ico'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Allow public routes
	if (PUBLIC_ROUTES.some(publicPath => pathname.startsWith(publicPath))) {
		return NextResponse.next();
	}

	// Check for access token
	const token = req.cookies.get('accessToken')?.value;

	if (!token) {
		// Always redirect to /auth without next param
		const loginUrl = req.nextUrl.clone();
		loginUrl.pathname = '/auth';
		loginUrl.searchParams.delete('next'); // make sure it's clean
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next(); // Authenticated
}

export const config = {
	matcher: ['/((?!_next/.*|favicon.ico).*)'], // Exclude static and public files
};
