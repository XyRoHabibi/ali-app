"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { allServices } from "@/data/services";

// Color mapping
const colorClasses: Record<string, { bg: string; text: string; button: string; shadow: string }> = {
    primary: { bg: "bg-[#2a6ba7]/10", text: "text-[#2a6ba7]", button: "bg-[#2a6ba7]", shadow: "shadow-[#2a6ba7]/20" },
    secondary: { bg: "bg-[#f3b444]/10", text: "text-[#f3b444]", button: "bg-[#f3b444]", shadow: "shadow-[#f3b444]/20" },
    green: { bg: "bg-green-100", text: "text-green-600", button: "bg-green-600", shadow: "shadow-green-600/20" },
    red: { bg: "bg-red-100", text: "text-red-600", button: "bg-red-600", shadow: "shadow-red-600/20" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", button: "bg-blue-600", shadow: "shadow-blue-600/20" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", button: "bg-orange-600", shadow: "shadow-orange-600/20" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", button: "bg-purple-600", shadow: "shadow-purple-600/20" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", button: "bg-indigo-600", shadow: "shadow-indigo-600/20" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600", button: "bg-yellow-600", shadow: "shadow-yellow-600/20" },
    gray: { bg: "bg-gray-100", text: "text-gray-600", button: "bg-gray-600", shadow: "shadow-gray-600/20" },
    pink: { bg: "bg-pink-100", text: "text-pink-600", button: "bg-pink-600", shadow: "shadow-pink-600/20" },
    brown: { bg: "bg-amber-100", text: "text-amber-700", button: "bg-amber-700", shadow: "shadow-amber-700/20" },
    gold: { bg: "bg-yellow-50", text: "text-yellow-700", button: "bg-yellow-700", shadow: "shadow-yellow-700/20" },
};

// Service categories
const categories = [
    { id: "all", label: "Semua" },
    { id: "usaha", label: "Pendirian" },
    { id: "lanjutan", label: "Perizinan Lanjutan" },
    { id: "pajak", label: "Perpajakan" },
];

// Get service link based on category
function getServiceLink(service: any): string {
    if (service.category === "usaha") {
        return `/layanan/pendirian/${service.id}`;
    } else if (service.category === "pajak") {
        return `/layanan/perpajakan/${service.id}`;
    } else if (service.category === "lanjutan") {
        return `/layanan/lanjutan/${service.id}`;
    }
    return `/layanan/${service.id}`;
}

export default function LayananPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const revealElements = sectionRef.current?.querySelectorAll(".reveal-up");
        revealElements?.forEach((el) => observer.observe(el));

        // Trigger immediately for elements already in viewport
        setTimeout(() => {
            revealElements?.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add("active");
                }
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    const filteredServices = allServices.filter((service) => {
        if (activeCategory !== "all" && service.category !== activeCategory) {
            return false;
        }
        return true;
    });

    const filteredPriceList = allServices.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={sectionRef}>
            <main className="max-w-[1200px] mx-auto py-12 md:py-20 flex-1">
                <div className="flex flex-col gap-10 md:gap-16 px-6">
                    {/* Header Section */}
                    <div className="reveal-up space-y-4 md:space-y-6">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">
                            Katalog Layanan Lengkap
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                            Pilih solusi legalitas yang sesuai dengan kebutuhan skala bisnis Anda.
                        </p>
                    </div>

                    {/* Category Filter & Grid */}
                    <div className="flex flex-col lg:flex-row gap-10 md:gap-16">
                        {/* Sidebar Filter */}
                        <aside className="lg:w-64 shrink-0">
                            <div className="space-y-4">
                                <h3 className="text-[10px] md:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Kategori
                                </h3>
                                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`category-btn whitespace-nowrap px-6 py-3 rounded-xl text-left text-xs md:text-sm font-bold transition-all ${activeCategory === cat.id
                                                ? "bg-[#2a6ba7] text-white shadow-[0_10px_20px_rgba(42,107,167,0.2)]"
                                                : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Services Grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            {filteredServices.map((service) => {
                                const colors = colorClasses[service.color] || colorClasses.primary;
                                return (
                                    <div
                                        key={service.id}
                                        className="service-card group p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white border-2 border-gray-100 hover:border-[#2a6ba7] hover:shadow-[0_20px_50px_rgba(42,107,167,0.05)] transition-all duration-500"
                                        data-category={service.category}
                                    >
                                        <div
                                            className={`size-14 md:size-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6 md:mb-8 transition-transform group-hover:rotate-12`}
                                        >
                                            <span className="material-symbols-outlined text-3xl md:text-4xl">
                                                {service.icon}
                                            </span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-gray-900">
                                            {service.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-medium italic">
                                            &quot;Layanan profesional &amp; terpercaya.&quot;
                                        </p>
                                        <div className="pt-6 md:pt-8 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Mulai Dari
                                                </p>
                                                <p className={`text-lg md:text-xl font-black ${colors.text}`}>
                                                    {service.price}
                                                </p>
                                            </div>
                                            <Link
                                                href={getServiceLink(service)}
                                                className={`size-10 md:size-12 rounded-2xl ${colors.button} text-white flex items-center justify-center shadow-lg ${colors.shadow} hover:scale-105 transition-all`}
                                            >
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Comprehensive Price List Section */}
                <section
                    id="full-pricing"
                    className="py-24 px-6 reveal-up border-t border-gray-100 mt-16"
                >
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                    Daftar Harga <span className="text-[#2a6ba7]">Lengkap</span>
                                </h2>
                                <p className="text-lg text-gray-500 max-w-xl font-medium">
                                    Cari dan temukan layanan yang Anda butuhkan melalui katalog harga
                                    transparan kami.
                                </p>
                            </div>
                            <div className="relative w-full md:w-96">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari layanan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-none bg-white text-sm font-bold focus:ring-2 focus:ring-[#2a6ba7] shadow-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-[#2a6ba7]/5 border-b border-gray-100">
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                            Nama Produk
                                        </th>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                                            Harga
                                        </th>
                                        <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredPriceList.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-[#2a6ba7]/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6 text-sm font-bold text-gray-800 uppercase tracking-tight">
                                                {item.name}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-[#2a6ba7] bg-[#2a6ba7]/10 px-3 py-1.5 rounded-lg border border-[#2a6ba7]/20">
                                                    {item.price}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Link
                                                    href={`https://wa.me/6285333338818?text=Halo%20Akses%20Legal,%20saya%20ingin%20tanya%20tentang%20${encodeURIComponent(item.name)}`}
                                                    target="_blank"
                                                    className="inline-flex size-9 rounded-lg bg-gray-50 text-[#2a6ba7] items-center justify-center hover:bg-[#2a6ba7] hover:text-white transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">send</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/harga"
                                className="inline-flex items-center gap-2 text-[#2a6ba7] font-black transition-all uppercase tracking-widest text-xs px-6 py-3 bg-[#2a6ba7]/5 rounded-full hover:bg-[#2a6ba7]/10"
                            >
                                Lihat Halaman Harga Detail
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
