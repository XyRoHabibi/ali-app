"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { ReactLenis } from 'lenis/react';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Pages that should not show the main header/footer
    const isDashboard = pathname?.startsWith("/dashboard");
    const isSuperAdmin = pathname?.startsWith("/super-admin");
    const isAuthPage =
        pathname?.startsWith("/masuk") ||
        pathname?.startsWith("/daftar") ||
        pathname?.startsWith("/lupa-password") ||
        pathname?.startsWith("/reset-password");

    if (isDashboard || isAuthPage || isSuperAdmin) {
        // Dashboard, Super Admin, and auth pages have their own layouts
        return <>{children}</>;
    }

    // Default layout with Header and Footer
    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <ReactLenis root />
            <Header />
            <main className="relative flex-grow w-full pt-20">{children}</main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
