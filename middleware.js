import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const PUBLIC_ROUTES = ['/', '/login'];

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // const token = request.headers.get('authorization')?.split(" ")[1];
    // for sever side we can get cookie
    let token
    if(pathname.startsWith("/api")){
        token = request.headers.get('authorization')?.split(" ")[1];
    }
    if(!token){
        token = request.cookies.get('access_token')?.value
    }
    
    if (!token) {
        // No token: redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        //  Verify token
        const decoded = await verifyToken(token);  // { userId: 1, iat: 1757520054 }
        // if (decoded.role !== 'admin') {
        //     return NextResponse.redirect(new URL('/unauthorized', request.url));
        // }

        //  Optionally pass user info via request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.userId);

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
        '/new-post',
        '/api/secure/:path*',
    ],
};
