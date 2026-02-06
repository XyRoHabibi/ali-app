"use client";

import { useEffect, useRef } from "react";

const features = [
    {
        number: "01",
        icon: "bolt",
        title: "Proses Kilat",
        description:
            "Waktu Anda berharga. Dokumen NIB dan Akta selesai dalam 1-3 hari kerja dengan sistem yang terintegrasi.",
        iconBg: "bg-blue-50",
        iconColor: "text-[#2a6ba7]",
        hoverBg: "group-hover:bg-[#2a6ba7]",
        hoverShadow: "hover:shadow-[#2a6ba7]/10",
        hoverTitle: "group-hover:text-[#2a6ba7]",
    },
    {
        number: "02",
        icon: "payments",
        title: "Harga Transparan",
        description:
            "Tanpa biaya siluman atau pungli. Paket harga yang Anda lihat adalah harga final sudah termasuk biaya PNBP.",
        iconBg: "bg-yellow-50",
        iconColor: "text-[#f3b444]",
        hoverBg: "group-hover:bg-[#f3b444]",
        hoverShadow: "hover:shadow-[#f3b444]/10",
        hoverTitle: "group-hover:text-[#f3b444]",
    },
    {
        number: "03",
        icon: "psychology",
        title: "Konsultasi Ahli",
        description:
            "Didukung oleh tim Sarjana Hukum profesional yang siap membimbing langkah bisnis Anda 24/7 via WhatsApp.",
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        hoverBg: "group-hover:bg-green-600",
        hoverShadow: "hover:shadow-green-500/10",
        hoverTitle: "group-hover:text-green-600",
    },
    {
        number: "04",
        icon: "devices",
        title: "100% Digital",
        description:
            "Tidak perlu keluar rumah. Upload dokumen, pantau progress, dan terima berkas melalui dashboard digital kami.",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
        hoverBg: "group-hover:bg-orange-600",
        hoverShadow: "hover:shadow-orange-500/10",
        hoverTitle: "group-hover:text-orange-600",
    },
];

export default function WhyChooseUs() {
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
            ref={sectionRef}
            className="py-24 px-6 relative overflow-hidden bg-gray-50"
        >
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#2a6ba7]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#f3b444]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20 reveal-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest text-[#2a6ba7] mb-4 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-[#f3b444] rounded-full animate-pulse" />
                        Keunggulan Kami
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Mengapa memilih{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a6ba7] to-blue-600 italic pr-2">
                            AKSES LEGAL?
                        </span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Kami mengkombinasikan teknologi dan keahlian hukum untuk memberikan
                        pengalaman legalitas terbaik bagi bisnis Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`reveal-up group relative p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 hover:shadow-2xl ${feature.hoverShadow} transition-all duration-300`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Number Watermark */}
                            <span className="absolute top-4 right-8 text-8xl font-black text-gray-50 select-none transition-colors group-hover:text-[#2a6ba7]/5">
                                {feature.number}
                            </span>

                            <div className="relative z-10">
                                <div
                                    className={`size-16 rounded-2xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 ${feature.hoverBg} group-hover:text-white transition-all duration-300 shadow-sm`}
                                >
                                    <span className="material-symbols-outlined text-3xl">
                                        {feature.icon}
                                    </span>
                                </div>
                                <h3
                                    className={`text-xl font-black mb-3 text-gray-900 ${feature.hoverTitle} transition-colors`}
                                >
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
