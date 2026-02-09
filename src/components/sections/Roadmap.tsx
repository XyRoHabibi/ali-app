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
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // 1. Load GSAP via CDN
    useEffect(() => {
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve(true);
                    return;
                }
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve(true);
                script.onerror = () => reject(new Error(`Failed to load script ${src}`));
                document.body.appendChild(script);
            });
        };

        Promise.all([
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js")
        ]).then(() => {
            setGsapLoaded(true);
        }).catch(err => console.error("Error loading GSAP:", err));
    }, []);

    // 2. Setup Animation setelah GSAP loaded
    useEffect(() => {
        if (!gsapLoaded || !sectionRef.current) return;

        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                // Desktop
                "(min-width: 1024px)": function () {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "center 44%",
                            end: "+=4000",
                            pin: true,
                            scrub: 0.5,
                            onUpdate: (self: any) => {
                                const progress = self.progress;
                                const totalSteps = roadmapSteps.length;
                                const activeIndex = Math.min(
                                    totalSteps - 1,
                                    Math.floor(progress * totalSteps)
                                );
                                setCurrentStep(activeIndex);
                            },
                        },
                    });
                },
                // Mobile
                "(max-width: 1023px)": function () {
                    const cards = gsap.utils.toArray('.mobile-card');
                    cards.forEach((card: any) => {
                        gsap.fromTo(card,
                            { opacity: 0, y: 50 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 85%",
                                    toggleActions: "play none none reverse"
                                }
                            }
                        )
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [gsapLoaded]);

    // Effect khusus untuk animasi konten saat step berubah
    useEffect(() => {
        if (!gsapLoaded || !contentRef.current) return;

        const gsap = (window as any).gsap;

        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 20, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
        );
    }, [currentStep, gsapLoaded]);

    const handleStepClick = (index: number) => {
        if (!gsapLoaded || !sectionRef.current) return;
        const gsap = (window as any).gsap;

        const scrollHeight = 4000;
        const sectionTop = sectionRef.current.offsetTop;
        const stepProgress = index / (roadmapSteps.length - 1);
        const targetScroll = sectionTop + (stepProgress * scrollHeight);

        gsap.to(window, {
            scrollTo: targetScroll,
            duration: 1,
            ease: "power2.out"
        });
    };

    const step = roadmapSteps[currentStep];

    return (
        <section
            id="roadmap-section"
            ref={sectionRef}
            // Perbaikan 5: pb-40 agar bagian bawah tidak terpotong section lain
            className="relative bg-[#F9FAFB] overflow-hidden pb-40"
        >
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-[120px] -z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

            {/* Container Utama */}
            {/* Perbaikan 2: min-h-screen, flex, justify-center agar posisi vertikal di tengah */}
            {/* Perbaikan 1: pt-32 agar header turun ke bawah, tidak mepet atas */}
            <div className="w-full px-6 pt-32 lg:min-h-screen lg:flex lg:flex-col lg:justify-center relative z-10">

                <div className="max-w-[1200px] mx-auto w-full">
                    {/* Header */}
                    {/* Perbaikan 1: mb-20 agar jarak ke konten di bawahnya lebih lega */}
                    <div className="text-center mb-10 lg:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            Alur <span className="text-[#2a6ba7] italic">Pendirian Legalitas</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 font-medium">
                            Pantau progres legalitas Anda layaknya memantau paket belanja online.
                        </p>
                    </div>

                    {/* --- DESKTOP VIEW (Pinned Layout) --- */}
                    <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch h-[600px]">
                        {/* Roadmap Sidebar */}
                        <div className="col-span-4 flex flex-col h-full">
                            <div className="roadmap-container overflow-y-auto pr-3 space-y-2 pb-4 h-full scrollbar-thin scrollbar-thumb-gray-200">
                                {roadmapSteps.map((s, index) => (
                                    <div
                                        key={s.id}
                                        onClick={() => handleStepClick(index)}
                                        // Perbaikan 3: Logic Opacity. 
                                        // Aktif: bg-white, opacity-100, border jelas, shadow.
                                        // Tidak aktif: opacity-50, grayscale, border transparan.
                                        className={`roadmap-card flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${index === currentStep
                                            ? "bg-white border-[#2a6ba7] shadow-xl scale-[1.02] opacity-100 ring-4 ring-[#2a6ba7]/10"
                                            : "bg-transparent border-transparent opacity-50 hover:opacity-80 hover:bg-white/50 grayscale hover:grayscale-0"
                                            }`}
                                    >
                                        <div
                                            className={`step-number size-9 rounded-lg flex items-center justify-center font-black text-xs transition-colors duration-300 ${index === currentStep
                                                ? "!bg-[#f3b444] text-[#2a6ba7] shadow-[0_0_15px_rgba(243,180,68,0.4)]"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-xs font-black uppercase tracking-tight transition-colors ${index === currentStep ? "text-[#2a6ba7]" : "text-gray-600"
                                                }`}>
                                                {s.title}
                                            </h4>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                                Step 0{index + 1}
                                            </p>
                                        </div>
                                        <span
                                            className={`material-symbols-outlined text-xl transition-all duration-300 ${index === currentStep ? iconColors[index] : "text-gray-400"
                                                }`}
                                        >
                                            {s.icon}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Display Panel (Mac Browser Look) - Desktop Only */}
                        <div className="col-span-8 h-full">
                            <div className="bg-white rounded-[2rem] h-full flex flex-col overflow-hidden relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-200 transition-all duration-500">
                                {/* Mac Browser Header */}
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-red-400/30" />
                                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-yellow-400/30" />
                                        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-green-400/30" />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm w-1/2 justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-gray-400">lock</span>
                                        <span className="text-[10px] font-bold text-gray-500 tracking-wide">
                                            system.akseslegal.id/monitoring
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Live</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area with Animation Key */}
                                <div className="flex-1 p-12 flex flex-col items-center justify-center text-center relative z-10">
                                    {/* Perbaikan 4: Wrapper div dengan ref untuk animasi GSAP */}
                                    <div ref={contentRef} className="space-y-8 w-full">
                                        <div className="size-24 bg-[#2a6ba7]/5 rounded-[2rem] flex items-center justify-center text-4xl text-[#2a6ba7] mx-auto shadow-inner ring-4 ring-white">
                                            <span className="material-symbols-outlined text-5xl">
                                                {step.icon}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-3xl font-black text-gray-900">
                                                {step.title}
                                            </h4>
                                            <div className="bg-[#2a6ba7]/5 p-6 rounded-2xl border border-[#2a6ba7]/10 max-w-lg mx-auto">
                                                <p className="text-gray-500 leading-relaxed text-base italic font-medium">
                                                    &quot;{step.desc}&quot;
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 text-left p-4 rounded-xl border-l-4 border-[#f3b444] bg-[#f3b444]/5 max-w-md mx-auto">
                                            <span className="material-symbols-outlined text-[#2a6ba7] text-xl mt-0.5">smart_toy</span>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                <span className="font-black text-[#2a6ba7] uppercase mr-1">AI Intelligence:</span>
                                                {step.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-3 opacity-60">
                                        <span className="material-symbols-outlined text-[#2a6ba7] text-xl">verified_user</span>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-gray-900 uppercase">Verified Partner</p>
                                            <p className="text-[9px] text-gray-400">Kemenkumham RI</p>
                                        </div>
                                    </div>
                                    <div className="text-right opacity-60">
                                        <p className="text-[10px] font-bold text-[#2a6ba7] uppercase">Est. Time</p>
                                        <p className="text-[10px] font-bold text-gray-500">1-3 Working Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MOBILE VIEW (Vertical Timeline) --- */}
                    <div className="lg:hidden relative space-y-8 pl-4">
                        {/* Vertical Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                        {roadmapSteps.map((s, index) => (
                            <div key={s.id} className="mobile-card relative pl-8">
                                {/* Dot on timeline */}
                                <div className={`absolute left-0 top-6 -translate-x-1/2 size-8 rounded-full border-4 border-[#F9FAFB] flex items-center justify-center z-10 ${index <= 1 ? "bg-[#2a6ba7] text-white" : "bg-white text-gray-400 border-gray-200"
                                    }`}>
                                    <span className="text-[10px] font-bold">{index + 1}</span>
                                </div>

                                {/* Mobile Card Content */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-10 rounded-lg bg-[#2a6ba7]/10 flex items-center justify-center text-[#2a6ba7]">
                                            <span className="material-symbols-outlined text-xl">
                                                {s.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-gray-900">
                                                {s.title}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Step 0{index + 1}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {s.desc}
                                    </p>

                                    {/* Mobile Detail Box */}
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <span className="material-symbols-outlined text-[#f3b444] text-lg">
                                            smart_toy
                                        </span>
                                        <p className="text-[11px] text-gray-500">
                                            <span className="font-bold text-gray-700">AI: </span>
                                            {s.detail}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}