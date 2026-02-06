"use client";

import { useEffect, useRef, useState } from "react";

const roadmapSteps = [
    {
        id: 1,
        title: "Konsultasi Awal",
        icon: "analytics",
        desc: "Diskusi kebutuhan bisnis Anda dengan tim kami untuk menentukan jenis badan usaha yang tepat.",
        detail: "Analisis otomatis menentukan jenis badan usaha optimal berdasarkan profil bisnis.",
    },
    {
        id: 2,
        title: "Persiapan Dokumen",
        icon: "signature",
        desc: "Upload dokumen persyaratan melalui dashboard kami. Tim akan verifikasi kelengkapan.",
        detail: "Sistem OCR memvalidasi dokumen dan mengisi formulir secara otomatis.",
    },
    {
        id: 3,
        title: "Pembuatan Akta",
        icon: "gavel",
        desc: "Proses pembuatan akta pendirian oleh Notaris rekanan resmi kami.",
        detail: "Notaris terpilih berdasarkan lokasi dan spesialisasi untuk proses tercepat.",
    },
    {
        id: 4,
        title: "SK Kemenkumham",
        icon: "workspace_premium",
        desc: "Pengurusan Surat Keputusan pengesahan badan hukum dari Kemenkumham RI.",
        detail: "Tracking real-time status pengajuan di sistem AHU Online.",
    },
    {
        id: 5,
        title: "NPWP Perusahaan",
        icon: "payments",
        desc: "Aktivasi Nomor Pokok Wajib Pajak untuk perusahaan Anda.",
        detail: "Integrasi langsung dengan sistem DJP untuk penerbitan NPWP instan.",
    },
    {
        id: 6,
        title: "NIB & OSS-RBA",
        icon: "history_edu",
        desc: "Penerbitan Nomor Induk Berusaha melalui sistem OSS Risk-Based Approach.",
        detail: "Analisis risiko otomatis untuk klasifikasi KBLI dan perizinan lanjutan.",
    },
    {
        id: 7,
        title: "Verifikasi Akhir",
        icon: "verified",
        desc: "QC internal memastikan semua dokumen valid dan siap diserahkan.",
        detail: "Multi-layer validation memastikan 0% error pada dokumen final.",
    },
    {
        id: 8,
        title: "Serah Terima",
        icon: "celebration",
        desc: "Dokumen legalitas lengkap dikirim ke alamat Anda. Bisnis siap beroperasi!",
        detail: "Notifikasi otomatis dan akses digital permanen ke seluruh dokumen.",
    },
];

const iconColors = [
    "text-blue-500",
    "text-purple-500",
    "text-amber-600",
    "text-[#2a6ba7]",
    "text-green-600",
    "text-orange-500",
    "text-emerald-600",
    "text-[#f3b444]",
];

export default function Roadmap() {
    const sectionRef = useRef<HTMLElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        const startLoop = () => {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % roadmapSteps.length);
            }, 4000);
        };

        startLoop();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleStepClick = (index: number) => {
        setCurrentStep(index);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % roadmapSteps.length);
        }, 6000);
    };

    const step = roadmapSteps[currentStep];

    return (
        <section
            id="roadmap-section"
            ref={sectionRef}
            className="py-24 relative overflow-hidden bg-[#F9FAFB] px-6"
        >
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-[120px] -z-10" />

            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16 reveal-up">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Alur <span className="text-[#2a6ba7] italic">Pendirian Legalitas</span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium">
                        Pantau progres legalitas Anda layaknya memantau paket belanja online.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal-up">
                    {/* Roadmap Sidebar */}
                    <div className="lg:col-span-4 flex flex-col h-[300px] lg:h-[600px]">
                        <div className="roadmap-container overflow-y-auto pr-3 space-y-2 pb-4 h-full">
                            {roadmapSteps.map((s, index) => (
                                <div
                                    key={s.id}
                                    onClick={() => handleStepClick(index)}
                                    className={`roadmap-card flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer ${index === currentStep ? "active" : ""
                                        }`}
                                >
                                    <div
                                        className={`step-number size-9 rounded-lg bg-white text-gray-400 flex items-center justify-center font-black text-xs ${index === currentStep
                                                ? "!bg-[#f3b444] !text-[#2a6ba7] shadow-[0_0_15px_rgba(243,180,68,0.4)]"
                                                : ""
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black text-[#2a6ba7] uppercase tracking-tight">
                                            {s.title}
                                        </h4>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                            Step 0{index + 1}
                                        </p>
                                    </div>
                                    <span
                                        className={`material-symbols-outlined ${iconColors[index]} text-xl`}
                                    >
                                        {s.icon}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display Panel (Mac Browser Look) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2rem] h-full min-h-[500px] flex flex-col overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-200">
                            {/* Mac Browser Header */}
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
                                {/* Traffic Lights */}
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-red-400/30" />
                                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-yellow-400/30" />
                                    <div className="w-3 h-3 rounded-full bg-[#28C840] border border-green-400/30" />
                                </div>

                                {/* Fake Address Bar */}
                                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm w-1/2 justify-center">
                                    <span className="material-symbols-outlined text-[10px] text-gray-400">
                                        lock
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 tracking-wide">
                                        system.akseslegal.id/monitoring
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">
                                            Live
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center relative z-10">
                                <div className="fade-slide-up space-y-8">
                                    <div className="size-20 md:size-24 bg-[#2a6ba7]/5 rounded-[2rem] flex items-center justify-center text-4xl text-[#2a6ba7] mx-auto shadow-inner">
                                        <span className="material-symbols-outlined text-5xl">
                                            {step.icon}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl md:text-3xl font-black text-gray-900">
                                            {step.title}
                                        </h4>
                                        <div className="bg-[#2a6ba7]/5 p-6 rounded-2xl border border-[#2a6ba7]/10 max-w-lg mx-auto">
                                            <p className="text-gray-500 leading-relaxed text-sm md:text-base italic font-medium">
                                                &quot;{step.desc}&quot;
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-left p-4 rounded-xl border-l-4 border-[#f3b444] bg-[#f3b444]/5 max-w-md mx-auto">
                                        <span className="material-symbols-outlined text-[#2a6ba7] text-xl mt-0.5">
                                            smart_toy
                                        </span>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            <span className="font-black text-[#2a6ba7] uppercase mr-1">
                                                AI Intelligence:
                                            </span>
                                            {step.detail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[#2a6ba7] text-xl">
                                        verified_user
                                    </span>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-gray-900 uppercase">
                                            Verified Partner
                                        </p>
                                        <p className="text-[9px] text-gray-400">Kemenkumham RI</p>
                                    </div>
                                </div>
                                <div className="text-right opacity-60 hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] font-bold text-[#2a6ba7] uppercase">
                                        Est. Time
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500">
                                        1-3 Working Days
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
