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

    if (isDashboard) {
        // Dashboard has its own layout
        return <>{children}</>;
    }

    // Default layout with Header and Footer
    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <ReactLenis root />
            <Header />
            <main className="relative flex-grow w-full overflow-x-hidden pt-20">{children}</main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
