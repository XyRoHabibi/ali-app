"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Kalkulator Services - All 80 services for calculator
const kalkulatorServices = [
    { id: "ptp", name: "PT Perorangan", price: 999000, category: "usaha", icon: "person", color: "primary" },
    { id: "upgrade-pt", name: "Upgrade ke PT Umum", price: 4500000, category: "usaha", icon: "upgrade", color: "primary" },
    { id: "cv", name: "CV", price: 1999000, category: "usaha", icon: "groups", color: "secondary" },
    { id: "rups-cv", name: "RUPS CV (Perubahan)", price: 1999000, category: "usaha", icon: "edit_document", color: "secondary" },
    { id: "pt-umum", name: "PT Umum", price: 3999000, category: "usaha", icon: "corporate_fare", color: "primary" },
    { id: "cv-to-pt", name: "CV to PT Umum", price: 3999000, category: "usaha", icon: "swap_horiz", color: "secondary" },
    { id: "bundling-pt", name: "Bundling PT dan VO", price: 6250000, category: "usaha", icon: "package", color: "primary" },
    { id: "rups-pt-1", name: "RUPS PT (Pengurus/Oper Saham)", price: 3499000, category: "usaha", icon: "swap_horizontal_circle", color: "primary" },
    { id: "rups-pt-2", name: "RUPS PT (KBLI/Kedudukan/Nama PT/Modal)", price: 4499000, category: "usaha", icon: "edit_note", color: "primary" },
    { id: "pt-pma", name: "PT PMA (PT Asing)", price: 8999000, category: "usaha", icon: "public", color: "primary" },
    { id: "pt-pma-nib", name: "PT PMA + NIB dan PKKPR", price: 5000000, category: "usaha", icon: "add_business", color: "primary" },
    { id: "rups-pma", name: "RUPS PT PMA (PT Asing)", price: 8999000, category: "usaha", icon: "language", color: "primary" },
    { id: "koperasi", name: "Koperasi", price: 7499000, category: "usaha", icon: "handshake", color: "green" },
    { id: "ud", name: "UD (Usaha Dagang)", price: 1999000, category: "usaha", icon: "store", color: "orange" },
    { id: "yayasan", name: "Yayasan", price: 3499000, category: "usaha", icon: "volunteer_activism", color: "blue" },
    { id: "yayasan-ubah", name: "Perubahan Yayasan", price: 4000000, category: "usaha", icon: "edit", color: "blue" },
    { id: "tutup-ptp", name: "Penutupan PT Perorangan", price: 999000, category: "usaha", icon: "close", color: "red" },
    { id: "cabang-pt", name: "Akta Cabang PT", price: 2500000, category: "usaha", icon: "account_tree", color: "primary" },
    { id: "cabang-cv", name: "Akta Cabang CV", price: 1500000, category: "usaha", icon: "account_tree", color: "secondary" },
    { id: "nib-pma", name: "NIB PT PMA", price: 2500000, category: "usaha", icon: "badge", color: "primary" },
    { id: "koran", name: "Pengumuman Koran", price: 800000, category: "usaha", icon: "newspaper", color: "gray" },
    { id: "merek", name: "Merek", price: 1899000, category: "haki", icon: "verified_user", color: "green" },
    { id: "merek-sanggah", name: "Merek (+ Surat Sanggahan)", price: 2999000, category: "haki", icon: "gavel", color: "green" },
    { id: "merek-refund", name: "Merek (+ Sanggahan & Refund 100%)", price: 4500000, category: "haki", icon: "verified", color: "green" },
    { id: "merek-banding", name: "Merek (+ Sanggahan, Banding & Refund)", price: 7500000, category: "haki", icon: "shield", color: "green" },
    { id: "merek-sub", name: "Tambahan Sub Kelas Merek", price: 1500000, category: "haki", icon: "add_circle", color: "green" },
    { id: "pirt", name: "PIRT", price: 399000, category: "sektoral", icon: "restaurant", color: "orange" },
    { id: "halal", name: "Halal - PIRT", price: 999000, category: "sektoral", icon: "verified", color: "red" },
    { id: "nib-badan", name: "NIB Badan (Perusahaan)", price: 500000, category: "usaha", icon: "business_center", color: "purple" },
    { id: "nib-pribadi", name: "NIB Pribadi", price: 300000, category: "usaha", icon: "badge", color: "purple" },
    { id: "bpom", name: "BPOM", price: 9499000, category: "sektoral", icon: "health_and_safety", color: "blue" },
    { id: "sbu", name: "SBU Konstruksi + KTA Asosiasi", price: 2999000, category: "sektoral", icon: "construction", color: "yellow" },
    { id: "ecatalogue", name: "E-Catalogue", price: 2500000, category: "sektoral", icon: "shopping_cart", color: "indigo" },
    { id: "sewa-s1", name: "Sewa Tenaga S1 Teknik Sipil", price: 9000000, category: "sektoral", icon: "engineering", color: "gray" },
    { id: "sewa-sma", name: "Sewa Tenaga SMA", price: 7500000, category: "sektoral", icon: "school", color: "gray" },
    { id: "ujian-s1", name: "Biaya Ujian Tenaga Ahli S1", price: 4000000, category: "sektoral", icon: "quiz", color: "blue" },
    { id: "ujian-sma", name: "Biaya Ujian Tenaga Terampil SMA", price: 2500000, category: "sektoral", icon: "assignment", color: "blue" },
    { id: "iso9001", name: "ISO 9001", price: 12000000, category: "sektoral", icon: "workspace_premium", color: "gold" },
    { id: "iso14001", name: "ISO 14001", price: 12000000, category: "sektoral", icon: "eco", color: "green" },
    { id: "iso45001", name: "ISO 45001", price: 12000000, category: "sektoral", icon: "health_and_safety", color: "red" },
    { id: "tkdn", name: "TKDN", price: 7500000, category: "sektoral", icon: "flag", color: "red" },
    { id: "sni", name: "SNI", price: 15000000, category: "sektoral", icon: "verified", color: "blue" },
    { id: "slf", name: "Sertifikat Laik Fungsi (SLF)", price: 5000000, category: "sektoral", icon: "apartment", color: "gray" },
    { id: "pbg", name: "PBG (Persetujuan Bangunan Gedung)", price: 3500000, category: "sektoral", icon: "domain", color: "brown" },
    { id: "ipal", name: "IPAL", price: 8000000, category: "sektoral", icon: "water_drop", color: "blue" },
    { id: "amdal", name: "AMDAL", price: 25000000, category: "sektoral", icon: "nature", color: "green" },
    { id: "ukl-upl", name: "UKL-UPL", price: 7500000, category: "sektoral", icon: "eco", color: "green" },
    { id: "sppl", name: "SPPL", price: 2500000, category: "sektoral", icon: "description", color: "green" },
    { id: "izin-lingkungan", name: "Izin Lingkungan", price: 10000000, category: "sektoral", icon: "park", color: "green" },
    { id: "iup", name: "Izin Usaha Pertambangan (IUP)", price: 50000000, category: "sektoral", icon: "landscape", color: "brown" },
    { id: "siup-mb", name: "SIUP-MB", price: 5000000, category: "sektoral", icon: "inventory", color: "orange" },
    { id: "api", name: "API (Angka Pengenal Impor)", price: 7500000, category: "sektoral", icon: "local_shipping", color: "blue" },
    { id: "npik", name: "NPIK (Nomor Pokok Importir Khusus)", price: 5000000, category: "sektoral", icon: "import_export", color: "indigo" },
    { id: "kosmetik", name: "Izin Edar Kosmetik", price: 5500000, category: "sektoral", icon: "face", color: "pink" },
    { id: "alkes", name: "Izin Edar Alat Kesehatan", price: 8000000, category: "sektoral", icon: "medical_services", color: "red" },
    { id: "obat-tradisional", name: "Izin Edar Obat Tradisional", price: 6500000, category: "sektoral", icon: "medication", color: "green" },
    { id: "suplemen", name: "Izin Edar Suplemen", price: 5000000, category: "sektoral", icon: "vaccines", color: "blue" },
    { id: "iumk", name: "IUMK (Izin Usaha Mikro Kecil)", price: 500000, category: "usaha", icon: "storefront", color: "orange" },
    { id: "tdp", name: "TDP (Tanda Daftar Perusahaan)", price: 1500000, category: "usaha", icon: "app_registration", color: "gray" },
    { id: "siup", name: "SIUP (Surat Izin Usaha Perdagangan)", price: 2000000, category: "usaha", icon: "receipt_long", color: "blue" },
    { id: "izin-industri", name: "Izin Usaha Industri", price: 3500000, category: "sektoral", icon: "factory", color: "gray" },
    { id: "izin-konstruksi", name: "Izin Usaha Jasa Konstruksi", price: 4000000, category: "sektoral", icon: "construction", color: "yellow" },
    { id: "situ", name: "SITU (Surat Izin Tempat Usaha)", price: 1500000, category: "usaha", icon: "location_on", color: "red" },
    { id: "ho", name: "HO (Izin Gangguan)", price: 2000000, category: "usaha", icon: "warning", color: "orange" },
    { id: "reklame", name: "Izin Reklame", price: 1000000, category: "sektoral", icon: "campaign", color: "purple" },
    { id: "pariwisata", name: "Izin Usaha Pariwisata", price: 5000000, category: "sektoral", icon: "travel_explore", color: "blue" },
    { id: "hotel", name: "Izin Usaha Perhotelan", price: 7500000, category: "sektoral", icon: "hotel", color: "gold" },
    { id: "restoran", name: "Izin Usaha Restoran", price: 3000000, category: "sektoral", icon: "restaurant_menu", color: "red" },
    { id: "kafe", name: "Izin Usaha Kafe", price: 2500000, category: "sektoral", icon: "local_cafe", color: "brown" },
    { id: "retail", name: "Izin Usaha Toko Retail", price: 2000000, category: "usaha", icon: "shopping_bag", color: "green" },
    { id: "apotek", name: "Izin Usaha Apotek", price: 10000000, category: "sektoral", icon: "local_pharmacy", color: "green" },
    { id: "klinik", name: "Izin Usaha Klinik", price: 15000000, category: "sektoral", icon: "local_hospital", color: "red" },
    { id: "lab", name: "Izin Usaha Laboratorium", price: 12000000, category: "sektoral", icon: "science", color: "blue" },
    { id: "pkp", name: "PKP (Pengukuhan Pengusaha Kena Pajak)", price: 1499000, category: "pajak", icon: "receipt_long", color: "blue" },
    { id: "efin", name: "EFIN Pribadi", price: 150000, category: "pajak", icon: "fingerprint", color: "indigo" },
    { id: "coretax-pribadi", name: "CORETax Pribadi", price: 350000, category: "pajak", icon: "account_balance_wallet", color: "indigo" },
    { id: "coretax-badan", name: "CORETax Badan", price: 500000, category: "pajak", icon: "corporate_fare", color: "indigo" },
    { id: "perkumpulan", name: "Perkumpulan", price: 4000000, category: "usaha", icon: "groups", color: "blue" },
];

// Service categories/tabs
const tabs = [
    { id: "all", label: "Layanan Populer" },
    { id: "usaha", label: "Pendirian Badan Usaha" },
    { id: "haki", label: "Hak Kekayaan Intelektual" },
    { id: "sektoral", label: "Sertifikasi Produk" },
    { id: "pajak", label: "Perpajakan" },
];

// Color mapping
const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-[#2a6ba7]/10", text: "text-[#2a6ba7]" },
    secondary: { bg: "bg-[#f3b444]/10", text: "text-[#f3b444]" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
    pink: { bg: "bg-pink-100", text: "text-pink-600" },
    brown: { bg: "bg-amber-100", text: "text-amber-700" },
    gold: { bg: "bg-yellow-50", text: "text-yellow-700" },
};

// Format currency
function formatCurrency(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

// Cart item type
interface CartItem {
    id: string;
    name: string;
    price: number;
}

export default function HargaPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [cart, setCart] = useState<CartItem[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sidebarRef.current || !containerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sidebarRef.current,
                    start: "top 99px",
                    endTrigger: containerRef.current,
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                });
            });

            return () => ctx.revert();
        });

        // Use a ResizeObserver to catch height changes from content switching
        const resizeObserver = new ResizeObserver(() => {
            ScrollTrigger.refresh();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
            mm.revert();
        };
    }, []); // Removed activeTab from deps because ResizeObserver handles it

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

    // Filter services based on active tab
    const filteredServices =
        activeTab === "all"
            ? kalkulatorServices
            : kalkulatorServices.filter((s) => s.category === activeTab);

    // Check if item is in cart
    const isInCart = (id: string) => cart.some((item) => item.id === id);

    // Toggle item in cart
    const toggleCart = (service: (typeof kalkulatorServices)[0]) => {
        if (isInCart(service.id)) {
            setCart(cart.filter((item) => item.id !== service.id));
        } else {
            setCart([...cart, { id: service.id, name: service.name, price: service.price }]);
        }
    };

    // Remove from cart
    const removeFromCart = (id: string) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.floor(subtotal * 0.11);
    const total = subtotal + tax;

    // Generate WhatsApp message
    const generateWhatsAppLink = () => {
        const message = `Halo Akses Legal Indonesia, saya ingin memesan layanan berikut:\n\n${cart
            .map((i) => `- ${i.name} (${formatCurrency(i.price)})`)
            .join("\n")}\n\nSubtotal: ${formatCurrency(subtotal)}\nPPN (11%): ${formatCurrency(tax)}\nTotal: ${formatCurrency(total)}\n\nMohon bantuannya untuk proses selanjutnya.`;
        return `https://wa.me/6285333338818?text=${encodeURIComponent(message)}`;
    };

    return (
        <div ref={sectionRef}>
            <main className="max-w-[1200px] mx-auto px-6 py-10 pb-40 lg:pb-10">
                {/* Page Heading */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 reveal-up">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4 text-gray-900">
                            Kalkulator Biaya Transparan
                        </h1>
                        <p className="text-[#57748e] text-base md:text-lg font-medium">
                            Hitung estimasi biaya legalitas usaha Anda secara instan. Tanpa biaya
                            tersembunyi, khusus untuk UMK Indonesia.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/layanan#paket-harga"
                            className="flex items-center gap-2 px-5 py-3 bg-[#2a6ba7] text-white rounded-xl shadow-lg shadow-[#2a6ba7]/20 hover:scale-105 transition-all font-black text-xs md:text-sm uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-white text-xl">layers</span>
                            Lihat Paket Tetap
                        </Link>
                        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#e9edf1] rounded-xl shadow-sm hover:shadow-md transition-all font-black text-xs md:text-sm uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-xl">
                                menu_book
                            </span>
                            Panduan Legalitas
                        </button>
                    </div>
                </div>

                {/* Service Tabs */}
                <div className="mb-8 border-b border-[#d3dce4]">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`tab-filter flex flex-col items-center border-b-[3px] pb-3 pt-2 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? "border-[#2a6ba7] text-[#2a6ba7]"
                                    : "border-transparent text-[#57748e] hover:text-[#2a6ba7]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start relative min-h-[800px]" ref={containerRef}>
                    {/* Service Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-up">
                        {filteredServices.map((service) => {
                            const colors = colorClasses[service.color] || colorClasses.primary;
                            const inCart = isInCart(service.id);

                            return (
                                <div
                                    key={service.id}
                                    onClick={() => toggleCart(service)}
                                    className={`calc-card group relative bg-white p-6 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${inCart
                                        ? "border-[#2a6ba7] bg-[#2a6ba7]/5"
                                        : "border-transparent hover:border-[#2a6ba7]/50"
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <div className="absolute top-4 right-4">
                                        <div
                                            className={`check-box w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${inCart
                                                ? "bg-[#2a6ba7] border-[#2a6ba7]"
                                                : "border-gray-200 group-hover:border-[#2a6ba7]"
                                                }`}
                                        >
                                            <span
                                                className={`material-symbols-outlined text-xs font-bold ${inCart ? "text-white" : "text-transparent group-hover:text-[#2a6ba7]"
                                                    }`}
                                            >
                                                check
                                            </span>
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className={`mb-5 ${colors.bg} w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}
                                    >
                                        <span className={`material-symbols-outlined ${colors.text} text-2xl`}>
                                            {service.icon}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-black mb-1 text-gray-900">{service.name}</h3>
                                    <p className="text-sm text-[#57748e] mb-5 font-medium leading-relaxed">
                                        Layanan profesional &amp; terpercaya.
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className={`${colors.text} font-black text-lg`}>
                                            {formatCurrency(service.price)}
                                        </span>
                                        <span
                                            className={`text-[10px] uppercase tracking-widest font-black ${colors.bg} px-2.5 py-1 rounded-lg ${colors.text}`}
                                        >
                                            All-in
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Summary (Pinned) */}
                    <div className="hidden lg:block lg:w-96 flex-none" ref={sidebarRef}>
                        <aside className="w-full lg:w-96 z-40" key={activeTab}>
                            <div className="bg-white rounded-2xl border border-[#2a6ba7]/20 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h4 className="text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#2a6ba7]">
                                            shopping_cart
                                        </span>
                                        Ringkasan Pesanan
                                    </h4>
                                    <p className="text-xs text-[#57748e] mt-1">
                                        Estimasi pengerjaan: 1-3 Hari Kerja
                                    </p>
                                </div>

                                <div className="p-6 space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto custom-scrollbar" id="cart-items">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 italic text-sm">
                                            Belum ada layanan dipilih
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center animate-in fade-in slide-in-from-right-4 duration-300"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">{item.name}</span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-[10px] text-red-500 font-bold text-left hover:underline"
                                                    >
                                                        Hapus Layanan
                                                    </button>
                                                </div>
                                                <span className="text-sm font-black text-gray-900">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-6 pt-0">
                                    <div className="pt-4 border-t border-dashed border-gray-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-[#57748e]">Subtotal</span>
                                            <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-sm text-[#57748e]">Pajak (PPN 11%)</span>
                                            <span className="text-sm font-bold">{formatCurrency(tax)}</span>
                                        </div>
                                        <div className="flex justify-between items-end mb-8">
                                            <span className="text-base font-bold">Total Harga</span>
                                            <span className="text-3xl font-black text-[#2a6ba7]">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                        <Link
                                            href={cart.length > 0 ? generateWhatsAppLink() : "#"}
                                            target={cart.length > 0 ? "_blank" : undefined}
                                            className={`w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-[#2a6ba7]/20 transition-transform active:scale-95 flex items-center justify-center ${cart.length > 0
                                                ? "bg-[#2a6ba7] text-white hover:scale-[1.02]"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Pesan Sekarang
                                        </Link>

                                        <div className="mt-6 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#57748e] uppercase tracking-widest">
                                                <span className="material-symbols-outlined text-sm text-green-500">
                                                    verified
                                                </span>
                                                Tanpa Biaya Tersembunyi
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#57748e] uppercase tracking-widest">
                                                <span className="material-symbols-outlined text-sm text-green-500">
                                                    speed
                                                </span>
                                                Proses Tercepat di Indonesia
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Card */}
                            <div className="mt-4 p-4 bg-gradient-to-br from-[#2a6ba7] to-[#1a2c3d] rounded-2xl text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">
                                        Promo UMK Baru
                                    </p>
                                    <p className="text-sm font-bold leading-snug">
                                        Bundling PT Perorangan + NIB + Merek hanya Rp 2.2jt!
                                    </p>
                                </div>
                                <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-6xl opacity-10">
                                    redeem
                                </span>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Mobile: Summary (Non-Sticky) */}
                <div className="lg:hidden mt-12">
                    <aside className="w-full">
                        <div className="bg-white rounded-2xl border border-[#2a6ba7]/20 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#2a6ba7]">
                                        shopping_cart
                                    </span>
                                    Ringkasan Pesanan
                                </h4>
                                <p className="text-xs text-[#57748e] mt-1">
                                    Estimasi pengerjaan: 1-3 Hari Kerja
                                </p>
                            </div>

                            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto" id="cart-items-mobile">
                                {cart.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 italic text-sm">
                                        Belum ada layanan dipilih
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={`mob-${item.id}`}
                                            className="flex justify-between items-center"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900">{item.name}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[10px] text-red-500 font-bold text-left hover:underline"
                                                >
                                                    Hapus Layanan
                                                </button>
                                            </div>
                                            <span className="text-sm font-black text-gray-900">
                                                {formatCurrency(item.price)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-6 pt-0">
                                <div className="pt-4 border-t border-dashed border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-[#57748e]">Subtotal</span>
                                        <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-sm text-[#57748e]">Pajak (PPN 11%)</span>
                                        <span className="text-sm font-bold">{formatCurrency(tax)}</span>
                                    </div>
                                    <div className="flex justify-between items-end mb-8">
                                        <span className="text-base font-bold">Total Harga</span>
                                        <span className="text-3xl font-black text-[#2a6ba7]">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                    <Link
                                        href={cart.length > 0 ? generateWhatsAppLink() : "#"}
                                        target={cart.length > 0 ? "_blank" : undefined}
                                        className={`w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-[#2a6ba7]/20 transition-transform active:scale-95 flex items-center justify-center ${cart.length > 0
                                            ? "bg-[#2a6ba7] text-white"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Pesan Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Trust Section */}
                <section className="mt-20 py-12 border-t border-[#e9edf1]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#2a6ba7] mb-1">10k+</span>
                            <p className="text-sm font-bold text-[#57748e]">UMK Terbantu</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#2a6ba7] mb-1">24h</span>
                            <p className="text-sm font-bold text-[#57748e]">Layanan Support</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#2a6ba7] mb-1">100%</span>
                            <p className="text-sm font-bold text-[#57748e]">Jaminan Legalitas</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#2a6ba7] mb-1">Rp 0</span>
                            <p className="text-sm font-bold text-[#57748e]">Hidden Fees</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Cart Button (Mobile Only) */}
            <button
                onClick={() => {
                    document.querySelector("#cart-items-mobile")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`lg:hidden fixed bottom-6 left-6 z-[90] flex items-center gap-3 bg-[#101519] text-white px-5 py-3 rounded-full shadow-2xl shadow-[#2a6ba7]/20 transition-all duration-500 border border-gray-800 ${cart.length > 0 ? "translate-y-0" : "translate-y-[200%]"
                    }`}
            >
                <div className="relative">
                    <span className="material-symbols-outlined text-xl">shopping_cart</span>
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold size-4 rounded-full flex items-center justify-center">
                        {cart.length}
                    </span>
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        Total Estimasi
                    </span>
                    <span className="text-sm font-black leading-none">{formatCurrency(total)}</span>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-lg ml-1">
                    expand_less
                </span>
            </button>
        </div>
    );
}
