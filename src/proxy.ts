import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const authPages = ["/masuk", "/daftar", "/lupa-password", "/reset-password"];
const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/super-admin"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    // Redirect authenticated users away from auth pages
    if (isLoggedIn && authPages.some((page) => pathname.startsWith(page))) {
        if (userRole === "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/super-admin", req.nextUrl));
        }
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Redirect unauthenticated users to login
    if (
        !isLoggedIn &&
        (protectedRoutes.some((route) => pathname.startsWith(route)) ||
            adminRoutes.some((route) => pathname.startsWith(route)))
    ) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/masuk?callbackUrl=${callbackUrl}`, req.nextUrl)
        );
    }

    // Protect admin routes - redirect non-admins to dashboard
    if (
        isLoggedIn &&
        adminRoutes.some((route) => pathname.startsWith(route)) &&
        userRole !== "SUPER_ADMIN"
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/super-admin/:path*",
        "/masuk",
        "/daftar",
        "/lupa-password",
        "/reset-password",
    ],
};
