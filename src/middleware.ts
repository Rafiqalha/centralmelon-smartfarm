import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/products', '/rfq', '/contracts', '/harvest'];
const publicRoutes = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    const sessionCookie = request.cookies.get('session')?.value;
    const session = await decrypt(sessionCookie);

    // If trying to access a protected route without a valid session, redirect to login
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // If logged in and trying to access login/register, redirect to dashboard
    if ((path === '/login' || path === '/register') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};