"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // 1. Import usePathname

const navLinks = [
    { href: "/layanan", label: "Layanan" },
    { href: "/harga", label: "Harga" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/blog", label: "Blog" },
    { href: "/karir", label: "Karir" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // 2. Ambil path URL saat ini

    // Lock body scroll logic
    useEffect(() => {
        if (isMobileMenuOpen) {
            // Lock regular scroll
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none"; // Prevent touch scrolling
            document.body.style.paddingRight = "var(--removed-body-scroll-width)"; // Handle scrollbar jump if any
            // Lock Lenis scroll if it's active on the html/body
            document.documentElement.classList.add('lenis-stopped');
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove('lenis-stopped');
            document.body.classList.remove('mobile-menu-open');
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove('lenis-stopped');
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);

    // Helper sederhana untuk cek status aktif (bisa disesuaikan jika ingin support sub-menu)
    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#e9edf1] transition-all duration-300">
            <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <span className="text-2xl font-black tracking-tighter transition-all group-hover:scale-105">
                        <Image
                            src="/images/logo-color.png"
                            alt="ALI Logo"
                            width={200}
                            height={50}
                            className="h-24 w-auto object-contain"
                            priority
                        />
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 lg:gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            // 3. Logika CSS: Jika aktif, warna biru. Jika tidak, warna default (hitam/abu).
                            className={`text-sm font-bold transition-all relative group py-2 ${isActive(link.href) ? "text-[#2a6ba7]" : "text-gray-600 hover:text-[#2a6ba7]"
                                }`}
                        >
                            {link.label}
                            {/* 4. Logika Garis Bawah: Jika aktif, lebar 100%. Jika tidak, lebar 0 (muncul saat hover). */}
                            <span
                                className={`absolute bottom-0 left-0 h-0.5 bg-[#2a6ba7] transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                                    }`}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className={`hidden lg:flex text-sm font-black px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard")
                            ? "bg-[#2a6ba7] text-white"
                            : "text-[#2a6ba7] bg-[#2a6ba7]/10 hover:bg-[#2a6ba7] hover:text-white"
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="https://wa.me/6285333338818"
                        target="_blank"
                        className="hidden sm:flex items-center justify-center rounded-xl h-11 px-6 bg-gradient-to-r from-[#2a6ba7] to-blue-600 text-white text-sm font-black transition-all hover:shadow-lg hover:shadow-[#2a6ba7]/30 hover:-translate-y-0.5 active:scale-95"
                    >
                        Mulai Sekarang
                    </Link>

                    {/* Language Toggle */}
                    <button className="hidden md:flex items-center justify-center h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer min-w-[70px]">
                        <span className="lang-flag text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="18" height="18" role="img" aria-label="Indonesia">
                                <rect width="28" height="20" fill="#fff" />
                                <rect width="28" height="10" y="0" fill="#d80027" />
                            </svg>
                        </span>
                        <span className="ml-2 text-sm font-bold">ID</span>
                        <span className="material-symbols-outlined text-[10px] opacity-50">expand_more</span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden size-11 flex items-center justify-center rounded-xl bg-gray-50 text-[#2a6ba7] transition-all hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                data-lenis-prevent
                className={`md:hidden fixed inset-0 z-[9999] bg-white p-6 flex flex-col h-[100dvh] overflow-y-auto overscroll-none transition-all duration-300 ${isMobileMenuOpen
                    ? "translate-x-0 opacity-100 visible"
                    : "translate-x-full opacity-0 invisible pointer-events-none"
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <Image
                        src="/images/logo-color.png" // Pastikan extension sesuai (png/svg)
                        alt="ALI Logo"
                        width={160}
                        height={40}
                        className="h-24 w-auto"
                    />
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="size-11 flex items-center justify-center rounded-xl bg-gray-50"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="flex flex-col gap-6 text-xl font-black mb-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            // 5. Mobile Active State: Ubah warna teks jadi biru jika aktif
                            className={`flex items-center justify-between group py-2 border-b border-gray-100 ${isActive(link.href) ? "text-[#2a6ba7]" : "text-gray-900"
                                }`}
                        >
                            {link.label}
                            {/* Ubah juga warna panah jika aktif */}
                            <span className={`material-symbols-outlined ${isActive(link.href) ? "text-[#2a6ba7]" : "text-gray-400"}`}>
                                chevron_right
                            </span>
                        </Link>
                    ))}
                    <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between group py-2 border-b border-gray-100 ${isActive("/dashboard") ? "text-[#2a6ba7]" : "text-gray-900"
                            }`}
                    >
                        Dashboard
                        <span className="material-symbols-outlined">dashboard</span>
                    </Link>
                </nav>
                <div className="flex flex-col gap-4 mt-8">
                    <button className="w-full h-12 flex items-center justify-center bg-gray-50 rounded-xl font-bold">
                        <span className="lang-flag text-xl mr-2">🇮🇩</span>
                        Bahasa Indonesia
                    </button>
                    <Link
                        href="https://wa.me/6285333338818"
                        target="_blank"
                        className="w-full h-14 bg-[#2a6ba7] text-white flex items-center justify-center rounded-2xl font-black gap-2 shadow-xl shadow-[#2a6ba7]/20"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Chat Konsultan
                    </Link>
                </div>
            </div>
        </header>
    );
}