import { NextResponse } from 'next/server';
import { checkSignin } from './shared/services/student';

const AVOID_ROUTES = [
    '/_next',
    '/api',
];

const REGISTER_USER_NOT_ALLOW_ROUTES = [
    // '/signin',
    // '/signup',
];



export const middleware = async (request) => {
    try {
        const ORIGIN_HOST = request.nextUrl.origin;
        const route = request?.nextUrl?.pathname;
        // Skip middleware for static files
        const checkAvoid = AVOID_ROUTES.find((routeItem) => route.startsWith(routeItem));
        if (checkAvoid) {
            return NextResponse.next();
        }
        // if (route.startsWith('/_next') ) {
        //     return NextResponse.next();
        // }

        const url = request?.nextUrl?.clone();
        url?.searchParams?.set("route", route);
        const studentToken = await request.cookies.get("auth-token")?.value || null;

        const user = await checkSignin({ host: ORIGIN_HOST, token: studentToken })
        console.log("user middleware ----->>", user)
        console.log("route ----->>", route)

        if (user && user.student_id && REGISTER_USER_NOT_ALLOW_ROUTES.includes(route)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (!request?.url?.includes("/dashboard")) {
            return NextResponse.rewrite(url);
        }
        if (!request?.url?.includes("/dashboard")) {
            return NextResponse.rewrite(url);
        }
        console.log("route ----00->>",)

        if (user && user.student_id) {
            return NextResponse.next();
        }

    } catch (error) {
        console.error("Error in middleware ==>", error);
    }

    return NextResponse.redirect(new URL('/signup', request.url));
};


export const config = {
    matcher: ['/:path*'],
};
