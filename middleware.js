import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	function middleware(req) {
		// Redirect to Company Dashboard Area
		if (
			(req.nextUrl.pathname.startsWith('/immigration') ||
				req.nextUrl.pathname.startsWith('/guest') ||
				req.nextUrl.pathname.startsWith('/policy-holder')) &&
			req.nextauth.token?.user?.role === 'company'
		) {
			return NextResponse.redirect(new URL('/company', req.url));
		}

		// Redirect to Agency Dashboard Area
		if (
			(req.nextUrl.pathname.startsWith('/company') ||
				req.nextUrl.pathname.startsWith('/guest') ||
				req.nextUrl.pathname.startsWith('/policy-holder')) &&
			req.nextauth.token?.user?.role === 'immigration_officer'
		) {
			return NextResponse.redirect(new URL('/immigration', req.url));
		}

		// Redirect to Agency Dashboard Area if user is not an Admin trying to access Manage Users
		if (
			req.nextUrl.pathname.startsWith('/immigration/users') &&
			req.nextauth.token?.user?.role === 'immigration_officer' &&
			req.nextauth.token?.user?.access?.toLowerCase() !== 'admin'
		) {
			return NextResponse.redirect(new URL('/immigration', req.url));
		}

		// Redirect to Guest Dashboard Area
		if (
			(req.nextUrl.pathname.startsWith('/company') ||
				req.nextUrl.pathname.startsWith('/immigration') ||
				req.nextUrl.pathname.startsWith('/policy-holder')) &&
			req.nextauth.token?.user?.role === 'guest'
		) {
			return NextResponse.redirect(new URL('/guest', req.url));
		}

		// Redirect to Policy Holder Dashboard Area
		if (
			(req.nextUrl.pathname.startsWith('/company') ||
				req.nextUrl.pathname.startsWith('/immigration') ||
				req.nextUrl.pathname.startsWith('/guest')) &&
			req.nextauth.token?.user?.role === 'policy_holder'
		) {
			return NextResponse.redirect(new URL('/policy-holder', req.url));
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

// Match paths under their respective directories
export const config = {
	matcher: [
		'/company/:path*',
		'/guest/:path*',
		'/policy-holder/:path*',
		'/immigration/:path*',
	],
};
