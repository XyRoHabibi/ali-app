import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const authPages = ["/masuk", "/daftar", "/lupa-password", "/reset-password"];
const protectedRoutes = ["/dashboard"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Redirect authenticated users away from auth pages
    if (isLoggedIn && authPages.some((page) => pathname.startsWith(page))) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Redirect unauthenticated users to login
    if (
        !isLoggedIn &&
        protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/masuk?callbackUrl=${callbackUrl}`, req.nextUrl)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/masuk", "/daftar", "/lupa-password", "/reset-password"],
};
