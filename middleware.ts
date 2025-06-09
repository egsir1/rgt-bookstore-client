import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth', '/api', '/_next', '/favicon.ico'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// // Allow public routes
	// if (PUBLIC_ROUTES.some(publicPath => pathname.startsWith(publicPath))) {
	// 	return NextResponse.next();
	// }

	// Check for access token
	const token = req.cookies.get('accessToken')?.value;

	if (!token) {
		if (pathname === '/') {
			return NextResponse.redirect(new URL('/auth', req.url));
		}
	}

	const user = token && decodeToken(token);
	const userRole = user?.role;
	if (userRole === 'ADMIN' && pathname === '/') {
		return NextResponse.redirect(new URL('/mg-dashboard/books', req.url));
	}

	return NextResponse.next(); // Authenticated
}
function decodeToken(token: string) {
	try {
		const payload = token.split('.')[1];
		return JSON.parse(atob(payload));
	} catch {
		return null;
	}
}

export const config = {
	matcher: ['/((?!_next/.*|favicon.ico).*)'], // Exclude static and public files
};
