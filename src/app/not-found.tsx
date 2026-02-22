"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f9fafb]">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Mesh gradient blobs */}
                <div
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(42,107,167,0.15) 0%, transparent 70%)",
                        animation: "blob 7s infinite",
                    }}
                />
                <div
                    className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(243,180,68,0.12) 0%, transparent 70%)",
                        animation: "blob 7s infinite 3.5s",
                    }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-20"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(42,107,167,0.1) 0%, transparent 70%)",
                        animation: "blob 7s infinite 1.5s",
                    }}
                />

                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, #2a6ba7 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Floating decorative icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-[15%] left-[10%] text-[#2a6ba7]/[0.07] hidden md:block"
                    style={{ animation: "subtle-float 6s ease-in-out infinite" }}
                >
                    <span className="material-symbols-outlined text-[80px]">
                        gavel
                    </span>
                </div>
                <div
                    className="absolute top-[20%] right-[12%] text-[#f3b444]/[0.1] hidden md:block"
                    style={{
                        animation: "subtle-float 5s ease-in-out 1s infinite",
                    }}
                >
                    <span className="material-symbols-outlined text-[60px]">
                        corporate_fare
                    </span>
                </div>
                <div
                    className="absolute bottom-[25%] left-[15%] text-[#2a6ba7]/[0.06] hidden md:block"
                    style={{
                        animation: "subtle-float 7s ease-in-out 2s infinite",
                    }}
                >
                    <span className="material-symbols-outlined text-[70px]">
                        description
                    </span>
                </div>
                <div
                    className="absolute bottom-[18%] right-[8%] text-[#f3b444]/[0.08] hidden lg:block"
                    style={{
                        animation: "subtle-float 5.5s ease-in-out 0.5s infinite",
                    }}
                >
                    <span className="material-symbols-outlined text-[55px]">
                        shield
                    </span>
                </div>
            </div>

            {/* Content */}
            <div
                className={`relative z-10 text-center px-6 max-w-2xl mx-auto transition-all duration-1000 ${mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
            >
                {/* 404 Large Number */}
                <div className="relative mb-6">
                    <h1
                        className="text-[140px] sm:text-[180px] md:text-[220px] font-[family-name:var(--font-heading)] font-black leading-none select-none"
                        style={{
                            background:
                                "linear-gradient(135deg, #2a6ba7 0%, #1e5189 40%, #f3b444 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        404
                    </h1>

                    {/* Shimmer overlay on the number */}
                    <div
                        className="absolute inset-0 overflow-hidden rounded-3xl"
                        style={{
                            mixBlendMode: "overlay",
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer-bg 3s infinite",
                            }}
                        />
                    </div>
                </div>

                {/* Icon badge */}
                <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2a6ba7]/[0.06] border border-[#2a6ba7]/[0.1] mb-6 transition-all duration-1000 delay-200 ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    <span className="material-symbols-outlined text-[#2a6ba7] text-lg">
                        explore_off
                    </span>
                    <span className="text-xs font-bold text-[#2a6ba7] tracking-wider uppercase">
                        Halaman Tidak Ditemukan
                    </span>
                </div>

                {/* Title */}
                <h2
                    className={`text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-black text-gray-900 mb-4 leading-tight transition-all duration-1000 delay-300 ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    Oops! Halaman ini tidak
                    <br />
                    <span className="text-gradient-brand">dapat ditemukan</span>
                </h2>

                {/* Description */}
                <p
                    className={`text-gray-500 text-base sm:text-lg font-medium leading-relaxed mb-10 max-w-md mx-auto transition-all duration-1000 delay-400 ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    Sepertinya halaman yang Anda cari sudah dipindahkan, dihapus,
                    atau mungkin tidak pernah ada.
                </p>

                {/* Action Buttons */}
                <div
                    className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-1000 delay-500 ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-2.5 h-14 px-8 bg-gradient-to-r from-[#2a6ba7] to-blue-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-[#2a6ba7]/20 hover:shadow-2xl hover:shadow-[#2a6ba7]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
                            arrow_back
                        </span>
                        Kembali ke Beranda
                    </Link>
                    <Link
                        href="/layanan"
                        className="group flex items-center justify-center gap-2.5 h-14 px-8 bg-white text-[#2a6ba7] text-sm font-black rounded-2xl border-2 border-[#2a6ba7]/15 hover:border-[#2a6ba7]/30 hover:bg-[#2a6ba7]/[0.04] hover:-translate-y-1 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-lg">
                            grid_view
                        </span>
                        Lihat Layanan Kami
                    </Link>
                </div>

                {/* Quick links */}
                <div
                    className={`transition-all duration-1000 delay-[600ms] ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Atau kunjungi halaman populer
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {[
                            {
                                href: "/harga",
                                label: "Harga",
                                icon: "payments",
                            },
                            {
                                href: "/tentang",
                                label: "Tentang Kami",
                                icon: "info",
                            },
                            {
                                href: "/blog",
                                label: "Blog",
                                icon: "article",
                            },
                            {
                                href: "/karir",
                                label: "Karir",
                                icon: "work",
                            },
                            {
                                href: "/dashboard",
                                label: "Dashboard",
                                icon: "dashboard",
                            },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#2a6ba7]/30 hover:bg-[#2a6ba7]/[0.03] text-gray-600 hover:text-[#2a6ba7] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                            >
                                <span className="material-symbols-outlined text-base opacity-60 group-hover:opacity-100 transition-opacity">
                                    {item.icon}
                                </span>
                                <span className="text-xs font-bold">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* WhatsApp help link */}
                <div
                    className={`mt-10 transition-all duration-1000 delay-700 ${mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                >
                    <Link
                        href="https://wa.me/6285333338818"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#25D366] transition-colors duration-300"
                    >
                        <i className="fab fa-whatsapp text-lg" />
                        Butuh bantuan? Chat kami di WhatsApp
                    </Link>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2a6ba7] via-[#f3b444] to-[#2a6ba7]" />
        </div>
    );
}
