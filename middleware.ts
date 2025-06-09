import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Check for access token
	const token = req.cookies.get('accessToken')?.value;
	console.log('🚀 ~ middleware ~ token:', token);
	if (!token) {
		return NextResponse.redirect(new URL('/auth', req.url));
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
