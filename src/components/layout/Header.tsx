"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Mega menu data grouped by category
const megaMenuCategories = [
    {
        title: "Pendirian Badan Usaha",
        icon: "corporate_fare",
        color: "text-[#2a6ba7]",
        bg: "bg-[#2a6ba7]/10",
        href: "/layanan?category=usaha",
        items: [
            { name: "PT Perorangan", desc: "Badan usaha untuk 1 pemilik", href: "/layanan/pendirian/1" },
            { name: "CV", desc: "Kemitraan usaha sederhana", href: "/layanan/pendirian/3" },
            { name: "PT Umum", desc: "Badan hukum untuk 2+ pemegang saham", href: "/layanan/pendirian/5" },
            { name: "Yayasan", desc: "Badan hukum sosial & nirlaba", href: "/layanan/pendirian/15" },
            { name: "PT PMA (Asing)", desc: "Perusahaan dengan modal asing", href: "/layanan/pendirian/10" },
            { name: "Koperasi", desc: "Badan usaha berbasis anggota", href: "/layanan/pendirian/13" },
        ],
    },
    {
        title: "Perizinan Lanjutan",
        icon: "verified_user",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        href: "/layanan?category=lanjutan",
        items: [
            { name: "Merek", desc: "Perlindungan hak kekayaan intelektual", href: "/layanan/lanjutan/22" },
            { name: "BPOM", desc: "Izin edar obat & makanan", href: "/layanan/lanjutan/31" },
            { name: "SBU Konstruksi", desc: "Sertifikasi badan usaha konstruksi", href: "/layanan/lanjutan/32" },
            { name: "ISO 9001", desc: "Standar manajemen mutu internasional", href: "/layanan/lanjutan/38" },
            { name: "Halal - PIRT", desc: "Sertifikasi halal produk rumahan", href: "/layanan/lanjutan/28" },
            { name: "PIRT", desc: "Izin produksi pangan rumah tangga", href: "/layanan/lanjutan/27" },
        ],
    },
    {
        title: "Perpajakan",
        icon: "account_balance",
        color: "text-amber-600",
        bg: "bg-amber-50",
        href: "/layanan?category=pajak",
        items: [
            { name: "PKP", desc: "Pengukuhan pengusaha kena pajak", href: "/layanan/perpajakan/74" },
            { name: "EFIN Pribadi", desc: "Aktivasi e-filing pajak pribadi", href: "/layanan/perpajakan/75" },
            { name: "CORETax Pribadi", desc: "Registrasi sistem pajak baru pribadi", href: "/layanan/perpajakan/76" },
            { name: "CORETax Badan", desc: "Registrasi sistem pajak baru badan", href: "/layanan/perpajakan/77" },
        ],
    },
];

const navLinks = [
    { href: "/layanan", label: "Layanan", hasDropdown: true },
    { href: "/harga", label: "Harga" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/blog", label: "Blog" },
    { href: "/karir", label: "Karir" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileLayananOpen, setIsMobileLayananOpen] = useState(false);
    const pathname = usePathname();
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Lock body scroll logic
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            document.body.style.paddingRight = "var(--removed-body-scroll-width)";
            document.documentElement.classList.add("lenis-stopped");
            document.body.classList.add("mobile-menu-open");
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lenis-stopped");
            document.body.classList.remove("mobile-menu-open");
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lenis-stopped");
            document.body.classList.remove("mobile-menu-open");
        };
    }, [isMobileMenuOpen]);

    // Close mega menu on route change
    useEffect(() => {
        setIsMegaMenuOpen(false);
        setIsMobileLayananOpen(false);
    }, [pathname]);

    // Close mega menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
                setIsMegaMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mega menu on Escape
    useEffect(() => {
        function handleEsc(event: KeyboardEvent) {
            if (event.key === "Escape") setIsMegaMenuOpen(false);
        }
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const handleMouseEnter = () => {
        if (megaMenuTimeoutRef.current) {
            clearTimeout(megaMenuTimeoutRef.current);
            megaMenuTimeoutRef.current = null;
        }
        setIsMegaMenuOpen(true);
    };

    const handleMouseLeave = () => {
        megaMenuTimeoutRef.current = setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 250);
    };

    const isActive = (path: string) => pathname === path;
    const isLayananActive = pathname.startsWith("/layanan");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-[#e9edf1] transition-all duration-300">
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
                    {navLinks.map((link) =>
                        link.hasDropdown ? (
                            /* Layanan Trigger */
                            <div
                                key={link.href}
                                ref={megaMenuRef}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="relative"
                            >
                                <Link
                                    href={link.href}
                                    className={`text-sm font-bold transition-all relative group py-2 inline-flex items-center gap-1 ${isLayananActive
                                        ? "text-[#2a6ba7]"
                                        : "text-gray-600 hover:text-[#2a6ba7]"
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`material-symbols-outlined text-[14px] transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        expand_more
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 bg-[#2a6ba7] transition-all duration-300 ${isLayananActive
                                            ? "w-full"
                                            : "w-0 group-hover:w-full"
                                            }`}
                                    />
                                </Link>
                            </div>
                        ) : (
                            /* Regular Nav Link */
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold transition-all relative group py-2 ${isActive(link.href)
                                    ? "text-[#2a6ba7]"
                                    : "text-gray-600 hover:text-[#2a6ba7]"
                                    }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-0 left-0 h-0.5 bg-[#2a6ba7] transition-all duration-300 ${isActive(link.href)
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                        }`}
                                />
                            </Link>
                        )
                    )}
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 28 20"
                                width="18"
                                height="18"
                                role="img"
                                aria-label="Indonesia"
                            >
                                <rect width="28" height="20" fill="#fff" />
                                <rect width="28" height="10" y="0" fill="#d80027" />
                            </svg>
                        </span>
                        <span className="ml-2 text-sm font-bold">ID</span>
                        <span className="material-symbols-outlined text-[10px] opacity-50">
                            expand_more
                        </span>
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

            {/* ========== MEGA MENU (Desktop) ========== */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`hidden md:block absolute top-full left-0 right-0 w-full transition-all duration-300 ease-out ${isMegaMenuOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-3 pointer-events-auto"
                    }`}
            >
                {/* Backdrop shadow */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent h-[600px] pointer-events-auto" />

                <div className="relative bg-white border-b border-gray-200 shadow-[0_30px_80px_rgba(0,0,0,0.10)]">
                    <div className="max-w-[1200px] mx-auto px-6 py-10">
                        <div className="grid grid-cols-12 gap-8">
                            {/* 3 Category Columns */}
                            {megaMenuCategories.map((cat, catIdx) => (
                                <div
                                    key={cat.title}
                                    className={`${catIdx === 2 ? "col-span-3" : "col-span-3"
                                        }`}
                                >
                                    {/* Category Header */}
                                    <Link
                                        href={cat.href}
                                        className="flex items-center gap-3 mb-5 group/cat"
                                    >
                                        <div
                                            className={`size-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center shrink-0 transition-all group-hover/cat:scale-110 group-hover/cat:rotate-6`}
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {cat.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 group-hover/cat:text-[#2a6ba7] transition-colors">
                                                {cat.title}
                                            </h3>
                                        </div>
                                    </Link>

                                    {/* Service Items */}
                                    <div className="space-y-0.5">
                                        {cat.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex flex-col py-2.5 px-3 -mx-3 rounded-xl hover:bg-gray-50 transition-all group/item"
                                            >
                                                <span className="text-[13px] font-semibold text-gray-600 group-hover/item:text-gray-900 transition-colors">
                                                    {item.name}
                                                </span>
                                                <span className="text-[11px] font-medium text-gray-400 group-hover/item:text-gray-500 transition-colors mt-0.5">
                                                    {item.desc}
                                                </span>
                                            </Link>
                                        ))}
                                        <Link
                                            href={cat.href}
                                            className={`inline-flex items-center gap-1 mt-3 text-xs font-bold ${cat.color} hover:underline transition-all group/more`}
                                        >
                                            Lihat semua
                                            <span className="material-symbols-outlined text-sm group-hover/more:translate-x-0.5 transition-transform">
                                                arrow_forward
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {/* CTA / Promo Column */}
                            <div className="col-span-3">
                                <div className="h-full bg-gradient-to-br from-[#2a6ba7] to-blue-700 rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
                                    {/* Decorative circles */}
                                    <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10" />
                                    <div className="absolute -bottom-6 -left-6 size-20 rounded-full bg-white/5" />

                                    <div className="relative z-10">
                                        <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-2xl">
                                                rocket_launch
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black mb-2 leading-tight">
                                            Mulai Legalitas Bisnis Anda
                                        </h3>
                                        <p className="text-sm text-white/80 font-medium leading-relaxed mb-6">
                                            Konsultasi gratis dengan tim legal kami. Proses cepat,
                                            harga transparan.
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex flex-col gap-2">
                                        <Link
                                            href="https://wa.me/6285333338818"
                                            target="_blank"
                                            className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white text-[#2a6ba7] text-sm font-black hover:bg-white/90 transition-all hover:shadow-lg"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                chat
                                            </span>
                                            Chat Konsultan
                                        </Link>
                                        <Link
                                            href="/layanan"
                                            className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/15 text-white text-sm font-bold hover:bg-white/25 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                grid_view
                                            </span>
                                            Semua Layanan
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                                    <span className="material-symbols-outlined text-emerald-500 text-base">
                                        check_circle
                                    </span>
                                    80+ Layanan Tersedia
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                                    <span className="material-symbols-outlined text-amber-500 text-base">
                                        star
                                    </span>
                                    Rating 4.9/5 di Google
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                                    <span className="material-symbols-outlined text-blue-500 text-base">
                                        speed
                                    </span>
                                    Proses Cepat &amp; Transparan
                                </div>
                            </div>
                            <Link
                                href="/harga"
                                className="text-xs font-bold text-[#2a6ba7] hover:text-[#1e5189] transition-colors flex items-center gap-1 group/price"
                            >
                                Lihat Daftar Harga Lengkap
                                <span className="material-symbols-outlined text-sm group-hover/price:translate-x-0.5 transition-transform">
                                    arrow_forward
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== MOBILE MENU OVERLAY ========== */}
            <div
                data-lenis-prevent
                className={`md:hidden fixed inset-0 z-[9999] bg-white p-6 flex flex-col h-[100dvh] overflow-y-auto overscroll-none transition-all duration-300 ${isMobileMenuOpen
                    ? "translate-x-0 opacity-100 visible"
                    : "translate-x-full opacity-0 invisible pointer-events-none"
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <Image
                        src="/images/logo-color.png"
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
                    {navLinks.map((link) =>
                        link.hasDropdown ? (
                            /* Mobile Layanan with Accordion */
                            <div key={link.href}>
                                <button
                                    onClick={() =>
                                        setIsMobileLayananOpen(!isMobileLayananOpen)
                                    }
                                    className={`w-full flex items-center justify-between group py-2 border-b border-gray-100 ${isLayananActive
                                        ? "text-[#2a6ba7]"
                                        : "text-gray-900"
                                        }`}
                                >
                                    <span>{link.label}</span>
                                    <span
                                        className={`material-symbols-outlined transition-transform duration-300 ${isLayananActive
                                            ? "text-[#2a6ba7]"
                                            : "text-gray-400"
                                            } ${isMobileLayananOpen ? "rotate-180" : ""}`}
                                    >
                                        expand_more
                                    </span>
                                </button>

                                {/* Mobile Accordion Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileLayananOpen
                                        ? "max-h-[1500px] opacity-100"
                                        : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="pt-4 pb-2 space-y-5">
                                        {megaMenuCategories.map((cat) => (
                                            <div key={cat.title}>
                                                {/* Category Title */}
                                                <Link
                                                    href={cat.href}
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(false)
                                                    }
                                                    className="flex items-center gap-3 mb-3"
                                                >
                                                    <div
                                                        className={`size-9 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            {cat.icon}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm font-black text-gray-900">
                                                        {cat.title}
                                                    </h4>
                                                </Link>

                                                {/* Service Items */}
                                                <div className="pl-12 space-y-0.5">
                                                    {cat.items.slice(0, 4).map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(false)
                                                            }
                                                            className="flex flex-col py-2 text-sm"
                                                        >
                                                            <span className="font-semibold text-gray-600">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                                                                {item.desc}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href={cat.href}
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(false)
                                                        }
                                                        className={`inline-flex items-center gap-1 pt-1 text-xs font-bold ${cat.color}`}
                                                    >
                                                        Lihat semua
                                                        <span className="material-symbols-outlined text-sm">
                                                            arrow_forward
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}

                                        {/* All Services Link */}
                                        <Link
                                            href="/layanan"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#2a6ba7]/5 hover:bg-[#2a6ba7]/10 transition-all text-[#2a6ba7]"
                                        >
                                            <div className="size-9 rounded-lg bg-[#2a6ba7]/10 text-[#2a6ba7] flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-lg">
                                                    grid_view
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold">
                                                Lihat Semua Layanan
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Mobile Regular Nav Link */
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between group py-2 border-b border-gray-100 ${isActive(link.href)
                                    ? "text-[#2a6ba7]"
                                    : "text-gray-900"
                                    }`}
                            >
                                {link.label}
                                <span
                                    className={`material-symbols-outlined ${isActive(link.href)
                                        ? "text-[#2a6ba7]"
                                        : "text-gray-400"
                                        }`}
                                >
                                    chevron_right
                                </span>
                            </Link>
                        )
                    )}
                    <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between group py-2 border-b border-gray-100 ${isActive("/dashboard")
                            ? "text-[#2a6ba7]"
                            : "text-gray-900"
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