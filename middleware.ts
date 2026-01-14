import { NextResponse } from "next/server";
import { checkStudentSignin } from "./shared/services/student";
import { checkAdminSignin } from "./shared/services/admin";

const REGISTER_USER_NOT_ALLOW_ROUTES = ["/signin", "/signup"];

const isProtectedRoute = (route: string, prefix: string) =>
  route.startsWith(prefix);

export const middleware = async (request) => {
  try {
    const route = request.nextUrl.pathname;
    const host = request.nextUrl.origin;

    // Detect type of area (admin / student / public)
    const isAdminArea = route.startsWith("/admin");
    const isStudentArea = route.startsWith("/dashboard");
    const isAuthPage = REGISTER_USER_NOT_ALLOW_ROUTES.includes(route);

    // ===== ADMIN AUTH CHECK =====
    if (isAdminArea) {
      const token = request.cookies.get("admin-auth-token")?.value || null;

      const admin = await checkAdminSignin({ host, token });

      if (!admin || !admin.admin_id) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      if (admin.admin_id && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }

    // ===== STUDENT AUTH CHECK =====
    if (isStudentArea) {
      const token = request.cookies.get("student-auth-token")?.value || null;

      const student = await checkStudentSignin({ host, token });

      if (!student || !student.student_id) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      if (student.student_id && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }

    // ===== PUBLIC ROUTE (/, signin, signup) =====
    if (isAuthPage) {
      const adminToken = request.cookies.get("admin-auth-token")?.value;
      const studentToken = request.cookies.get("student-auth-token")?.value;

      let admin = null;
      let student = null;

      if (adminToken)
        admin = await checkAdminSignin({ host, token: adminToken });
      if (studentToken)
        student = await checkStudentSignin({ host, token: studentToken });

      // If logged in (either admin or student), block signin/signup pages
      if ((admin?.admin_id || student?.student_id) && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }
};

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
