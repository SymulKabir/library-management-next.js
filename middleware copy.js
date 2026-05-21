import { NextResponse } from "next/server";
import { checkStudentSignin } from "./shared/services/student";
import { checkAdminSignin } from "./shared/services/admin";

const REGISTER_USER_NOT_ALLOW_ROUTES = ["/signin", "/signup"];

const adminAuthGard = async (request) => {
  try {
    const ORIGIN_HOST = request.nextUrl.origin;
    const route = request?.nextUrl?.pathname;
    const protectedRoutes = ["/admin"];
    const studentToken =
      (await request.cookies.get("admin-auth-token")?.value) || null;
    const user = await checkAdminSignin({
      host: ORIGIN_HOST,
      token: studentToken,
    }); 
    const isProtectedRoute = protectedRoutes.find((protectedRoute) => {
      if (route.startsWith(protectedRoute)) return true;
      return false;
    });
    if ((!user || !user.admin_id) && isProtectedRoute) {
      return NextResponse.redirect(new URL("/signup", request.url));
    } else if (
      user &&
      user.admin_id &&
      REGISTER_USER_NOT_ALLOW_ROUTES.includes(route)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware ==>", error);
  }
};
const studentAuthGard = async (request) => {
  try {
    const ORIGIN_HOST = request.nextUrl.origin;
    const route = request?.nextUrl?.pathname;
    const protectedRoutes = ["/dashboard"];

    const url = request?.nextUrl?.clone();
    url?.searchParams?.set("route", route);
    const studentToken =
      (await request.cookies.get("student-auth-token")?.value) || null;
    const user = await checkStudentSignin({
      host: ORIGIN_HOST,
      token: studentToken,
    });

    const isProtectedRoute = protectedRoutes.find((protectedRoute) => {
      if (route.startsWith(protectedRoute)) return true;
      return false;
    });
    if ((!user || !user.student_id) && isProtectedRoute) {
      return NextResponse.redirect(new URL("/signup", request.url));
    } else if (
      user &&
      user.student_id &&
      REGISTER_USER_NOT_ALLOW_ROUTES.includes(route)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware ==>", error);
  }
};

export const middleware = async (request) => {
  try {
    return await adminAuthGard(request);
    // return await studentAuthGard(request);
  } catch (error) {
    console.error("Error in middleware ==>", error);
  }

  //   return NextResponse.redirect(new URL("/signup", request.url));
};

// export const config = {
//   matcher: ["/((?!_next|api|.well-known).*)"],
// };
export const config = {
  matcher: [
    "/",
    "/signup",
    "/signin",
    "/admin/:path*", // all admin routes
    "/dashboard/:path*", // all dashboard routes
  ],
};
