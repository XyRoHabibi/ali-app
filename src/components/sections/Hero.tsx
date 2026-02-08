"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
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
            className="relative pt-16 pb-16 md:pt-8 md:pb-24 overflow-hidden bg-gray-50 selection:bg-[#2a6ba7] selection:text-white"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Gradient Blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2a6ba7]/30 rounded-full blur-[120px] animate-blob mix-blend-multiply" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f3b444]/30 rounded-full blur-[120px] animate-blob mix-blend-multiply" style={{ animationDelay: "2s" }} />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                {/* Text Content (Left Side) */}
                <div className="flex flex-col gap-8 reveal-up order-2 lg:order-1">
                    {/* Badge */}
                    <div className="flex items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#2a6ba7]/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                Solusi Legal #1 Terpercaya
                            </span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-6">
                        <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
                            Mulai Bisnis Anda!
                            <br />

                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed font-medium">
                            Mulai Bisnis anda sekarang juga melalui jasa Akseslegal dengan pendirian PT Perorangan. Cepat tanpa ribet.
                        </p>
                    </div>

                    {/* CTA Buttons & Social Proof */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Main Button */}
                            <Link
                                href="/harga"
                                className="group relative px-8 h-14 rounded-2xl bg-[#2a6ba7] text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#2a6ba7]/30 hover:shadow-[#2a6ba7]/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="text-lg">Mulai Sekarang</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                href="https://wa.me/6285333338818"
                                target="_blank"
                                className="px-8 h-14 rounded-2xl bg-white text-gray-700 font-bold border border-gray-200 flex items-center justify-center gap-3 hover:border-[#2a6ba7] hover:text-[#2a6ba7] transition-all duration-300 group"
                            >
                                <Image
                                    src="/images/whatsapp-icon.svg"
                                    alt="WA"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all"
                                />
                                <span>Konsultasi Gratis</span>
                            </Link>
                        </div>

                        {/* Avatar Social Proof */}
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <Image
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                    src="https://storage.googleapis.com/download/storage/v1/b/akses-legal-indonesia.appspot.com/o/documents%2F1678333933728-cv-tumming.jpg?generation=1678333934696761&alt=media"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                />
                                <Image
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                    src="https://storage.googleapis.com/download/storage/v1/b/akses-legal-indonesia.appspot.com/o/documents%2F1728531489478-Gambar-WhatsApp-2024-10-02-pukul-15.43.31_1eed6df3.jpg?generation=1728531490191745&alt=media"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                />
                                <img src="https://skksbu.akseslegal.id/img/testimoni1.jpg"
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                />
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                    +2k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-1 text-yellow-500 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[16px] fill-1">
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-gray-500">
                                    <span className="text-gray-900 font-bold">4.9/5</span> dari
                                    klien puas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Simple Trust Features */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-xl">
                                verified_user
                            </span>
                            Resmi Kemenkumham
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-xl">
                                bolt
                            </span>
                            Proses 5-7 Hari
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-xl">
                                lock
                            </span>
                            Data Aman 100%
                        </div>
                    </div>
                </div>

                {/* Visual Content (Right Side) */}
                <div className="relative order-1 lg:order-2">
                    {/* Main Image Wrapper with Tilt Effect */}
                    <div className="relative mx-auto w-full max-w-[500px] perspective-1000 group">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#2a6ba7]/30 to-[#f3b444]/30 blur-[60px] rounded-full -z-10" />

                        {/* Main Image */}
                        <div className="relative z-10 animate-float-sway">
                            <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
                                <Image
                                    src="/images/hero.png"
                                    alt="Akses Legal Services"
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                    priority
                                />

                                {/* Overlay Gradient at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>

                        {/* Floating Card 1: Success Notification */}
                        <div className="absolute top-12 -right-4 glass-card p-4 rounded-2xl z-30 animate-float-medium flex items-center gap-4 max-w-[220px]">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 flex-shrink-0">
                                <span className="material-symbols-outlined">check</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide">
                                    OSS System
                                </p>
                                <p className="text-sm font-black text-gray-800 leading-none">
                                    NIB Terbit!
                                </p>
                            </div>
                        </div>

                        {/* Floating Card 2: Stats */}
                        <div className="absolute bottom-16 -left-4 glass-card p-4 rounded-2xl z-30 animate-float-fast flex flex-col gap-2 w-48">
                            <div className="flex gap-1 text-[#f3b444]">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-sm fill-1">
                                        star
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-gray-600 italic">
                                &quot;Prosesnya cepet banget, admin ramah!&quot;
                            </p>
                            <div className="flex items-center gap-2 mt-1 border-t border-gray-100 pt-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#2a6ba7] to-blue-400" />
                                <span className="text-[10px] font-bold text-gray-400">
                                    Owner, Kopi Senja
                                </span>
                            </div>
                        </div>

                        {/* Marquee Badge (Bottom Center of Image) */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%]">
                            <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20 overflow-hidden">
                                <div className="flex gap-6 animate-marquee whitespace-nowrap">
                                    {[
                                        "OSS RBA",
                                        "AHU Online",
                                        "NPWP Perusahaan",
                                        "OSS RBA",
                                        "AHU Online",
                                    ].map((item, i) => (
                                        <span
                                            key={i}
                                            className="flex items-center gap-2 text-xs font-bold text-gray-600"
                                        >
                                            <span className="material-symbols-outlined text-[#2a6ba7] text-sm">
                                                verified
                                            </span>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
