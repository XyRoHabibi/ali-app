"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const services = [
    {
        icon: "corporate_fare",
        title: "PT Perorangan",
        description:
            "Solusi terbaik untuk UMKM. Tanggung jawab terbatas, pajak lebih ringan, dan prestise perusahaan.",
        features: ["Akta Pendirian", "SK Kemenkumham", "NIB & NPWP"],
        price: "Rp 999.000",
        href: "/layanan/pendirian/1",
        isPopular: true,
        iconBg: "bg-gradient-to-br from-[#2a6ba7] to-blue-400",
        iconShadow: "shadow-lg shadow-[#2a6ba7]/30",
        borderColor: "border-t-[#2a6ba7]",
        buttonBg: "bg-[#2a6ba7]",
        buttonShadow: "shadow-lg shadow-[#2a6ba7]/20",
    },
    {
        icon: "groups",
        title: "Pendirian CV",
        description:
            "Badan usaha untuk kemitraan (sekutu aktif & pasif). Cocok untuk tender pemerintah.",
        features: ["Akta Notaris", "Daftar Pengadilan", "Perizinan OSS"],
        price: "Rp 1.999.000",
        href: "/layanan/pendirian/3",
        isPopular: false,
        iconBg: "bg-white border border-gray-100",
        iconShadow: "shadow-sm",
        borderColor: "border-t-gray-200",
        buttonBg: "bg-gray-100 hover:bg-[#2a6ba7]",
        buttonShadow: "",
        textColor: "text-gray-600 hover:text-white",
        priceColor: "text-gray-800",
    },
    {
        icon: "verified_user",
        title: "Daftar Merek (HAKI)",
        description:
            "Lindungi nama brand dan logo Anda dari plagiarisme kompetitor. Aset terpenting bisnis.",
        features: ["Analisa Merek", "Pendaftaran DJKI", "Sertifikat Resmi"],
        price: "Rp 1.899.000",
        href: "/layanan/lanjutan/22",
        isPopular: false,
        iconBg: "bg-white border border-gray-100",
        iconShadow: "shadow-sm",
        borderColor: "border-t-gray-200",
        buttonBg: "bg-gray-100 hover:bg-[#2a6ba7]",
        buttonShadow: "",
        textColor: "text-gray-600 hover:text-white",
        priceColor: "text-gray-800",
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);

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

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="layanan"
            ref={sectionRef}
            className="py-24 px-6 relative bg-gray-50"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2a6ba7]/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal-up">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a6ba7]/10 text-[#2a6ba7] text-xs font-black uppercase tracking-widest border border-[#2a6ba7]/20">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Produk Unggulan
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Solusi Legalitas Bisnis <br />
                            <span className="text-gradient">Terlengkap & Termurah</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Semua harga
                            transparan, tanpa biaya tersembunyi.
                        </p>
                    </div>
                    <Link
                        href="/harga"
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 font-bold text-[#2a6ba7] hover:border-[#2a6ba7] transition-all group shadow-sm"
                    >
                        Lihat Semua Paket
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`reveal-up relative glass-card-hover rounded-[2.5rem] p-8 lg:p-10 flex flex-col h-full border-t-4 ${service.borderColor} shadow-xl`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {service.isPopular && (
                                <div className="absolute -top-4 left-8 bg-[#f3b444] text-[#2a6ba7] text-xs font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-wide z-10">
                                    Paling Populer
                                </div>
                            )}
                            <div
                                className={`size-16 rounded-2xl ${service.iconBg} ${service.isPopular ? "text-white" : "text-gray-600"} flex items-center justify-center mb-8 ${service.iconShadow} group-hover:-translate-y-2 transition-transform duration-500`}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {service.icon}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                                {service.description}
                            </p>
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                {service.features.map((feature, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 text-sm font-bold text-gray-600"
                                    >
                                        <span className="material-symbols-outlined text-green-500 text-lg">
                                            check_circle
                                        </span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 flex items-center justify-between border-t border-dashed border-gray-200">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                                        Mulai Dari
                                    </p>
                                    <p
                                        className={`text-2xl font-black ${service.isPopular ? "text-[#2a6ba7]" : service.priceColor}`}
                                    >
                                        {service.price}
                                        <span className="text-sm text-gray-400 font-medium">,-</span>
                                    </p>
                                </div>
                                <Link
                                    href={service.href}
                                    className={`size-12 rounded-xl ${service.buttonBg} ${service.isPopular ? "text-white" : service.textColor} flex items-center justify-center ${service.buttonShadow} hover:scale-110 transition-transform`}
                                >
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
