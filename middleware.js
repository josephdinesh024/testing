import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const PUBLIC_ROUTES = ['/', '/login'];

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // const token = request.headers.get('authorization')?.split(" ")[1];
    // for sever side we can get cookie
    const token = request.cookies.get('access_token');
    if (!token) {
        // No token: redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        //  Verify token
        const decoded = verify(token, JWT_SECRET);

        // if (decoded.role !== 'admin') {
        //     return NextResponse.redirect(new URL('/unauthorized', request.url));
        // }

        //  Optionally pass user info via request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('user-id', decoded.userId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (err) {
        console.warn('JWT Invalid:', err.message);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Middleware applies to.
export const config = {
    matcher: [
        '/dashboard',
        '/new-post',
        '/api/secure/:path*',
    ],
};
