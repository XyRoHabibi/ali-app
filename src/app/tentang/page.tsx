"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Team members data
const teamMembers = [
    {
        id: 1,
        name: "Bapak [Placeholder]",
        role: "Founder / CEO",
        specialty: "Legal Consultant",
        image: "/images/hero.png",
    },
    {
        id: 2,
        name: "Ibu [Placeholder]",
        role: "Co-Founder",
        specialty: "Compliance Officer",
        image: "/images/abcd.jpg",
    },
    {
        id: 3,
        name: "Nama [Placeholder]",
        role: "Legal Tech Expert",
        specialty: "Business Analyst",
        image: "/images/hero.png",
    },
    {
        id: 4,
        name: "Nama [Placeholder]",
        role: "Managing Partner",
        specialty: "Tax Consultant",
        image: "/images/abcd.jpg",
    },
];

// Mission points
const missionPoints = [
    "Menyediakan akses legalitas yang transparan dan terjangkau.",
    "Mengintegrasikan teknologi ke dalam proses administratif hukum.",
    "Memberikan konsultasi ahli yang solutif bagi pertumbuhan bisnis.",
];

// Instagram grid images
const instagramImages = [
    "/images/foto2.png",
    "/images/aligram.jpg",
    "/images/foto3.png",
];

export default function TentangPage() {
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

    return (
        <div ref={sectionRef}>
            <main className="relative">
                {/* Page Header */}
                <section className="py-24 bg-gradient-to-br from-[#2a6ba7] to-[#1a2c3d] text-white overflow-hidden relative px-6">
                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="max-w-3xl space-y-4 md:space-y-6 reveal-up">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight">
                                <span>Membangun</span>
                                <br />
                                <span className="text-[#f3b444]">Masa Depan Legalitas</span>{" "}
                                <span>Indonesia</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed">
                                PT Akses Legal Indonesia adalah partner strategis bagi ribuan pengusaha
                                dalam mengamankan pondasi legal bisnis mereka melalui teknologi.
                            </p>
                        </div>
                    </div>
                    {/* Background Logo */}
                    <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                        <Image
                            src="/images/logo-color.png"
                            alt="ALI Logo BG"
                            width={800}
                            height={400}
                            className="w-[400px] md:w-[800px] h-auto"
                        />
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="py-24 max-w-[1200px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="reveal-up space-y-6 md:space-y-8">
                            <div className="space-y-3 md:space-y-4">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                    Visi &amp; Misi Kami
                                </h2>
                                <div className="w-16 md:w-20 h-1 md:h-1.5 bg-[#f3b444] rounded-full"></div>
                            </div>

                            <div className="space-y-10">
                                {/* Vision */}
                                <div className="flex gap-6">
                                    <div className="size-14 shrink-0 rounded-2xl bg-[#2a6ba7]/10 text-[#2a6ba7] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900">Visi Perusahaan</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">
                                            Menjadi garda terdepan dalam digitalisasi layanan hukum di Indonesia,
                                            memberdayakan UMKM untuk tumbuh tanpa hambatan birokrasi.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission */}
                                <div className="flex gap-6">
                                    <div className="size-14 shrink-0 rounded-2xl bg-[#f3b444]/10 text-[#f3b444] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl">target</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900">Misi Perusahaan</h3>
                                        <ul className="space-y-3 text-gray-500 font-medium">
                                            {missionPoints.map((point, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-[#2a6ba7] text-sm mt-1">
                                                        check_circle
                                                    </span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images Grid */}
                        <div
                            className="reveal-up grid grid-cols-2 gap-6"
                            style={{ transitionDelay: "200ms" }}
                        >
                            <div className="space-y-6 mt-12">
                                <Image
                                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80"
                                    alt="Office Life"
                                    width={600}
                                    height={750}
                                    className="rounded-[2.5rem] shadow-xl w-full aspect-[4/5] object-cover"
                                />
                                <div className="bg-[#2a6ba7] p-8 rounded-[2.5rem] text-white">
                                    <p className="text-4xl font-black mb-1">5+</p>
                                    <p className="text-xs font-black uppercase tracking-widest opacity-80">
                                        Tahun Dedikasi
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-[#f3b444] p-8 rounded-[2.5rem] text-[#2a6ba7]">
                                    <p className="text-4xl font-black mb-1">2K+</p>
                                    <p className="text-xs font-black uppercase tracking-widest opacity-80">
                                        Klien Aktif
                                    </p>
                                </div>
                                <Image
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                                    alt="Teamwork"
                                    width={600}
                                    height={750}
                                    className="rounded-[2.5rem] shadow-xl w-full aspect-[4/5] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Team Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-16 reveal-up">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                                Tim Ahli Kami
                            </h2>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                                Bekerja dengan dedikasi tinggi untuk memastikan setiap dokumen bisnis
                                Anda aman secara hukum.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="reveal-up group"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative mb-6 rounded-[2rem] overflow-hidden aspect-square shadow-lg">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#2a6ba7]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <span className="text-white text-xs font-black uppercase tracking-widest">
                                                {member.specialty}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                                        {member.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Instagram / Social Embed Section */}
                <section className="py-24 bg-[#f9fafb] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/50 opacity-50"></div>
                    <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                        <div className="reveal-up grid lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content */}
                            <div className="space-y-8 text-center lg:text-left">
                                <div className="space-y-4">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a6ba7]/10 border border-[#2a6ba7]/10 shadow-sm">
                                        <span className="material-symbols-outlined text-[#2a6ba7] text-lg">
                                            photo_camera
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-widest text-[#2a6ba7]">
                                            Instagram Official
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        Update Hukum &amp; <br />
                                        <span className="text-[#f3b444]">Wawasan Bisnis</span>
                                    </h2>
                                    <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                        Ikuti{" "}
                                        <span className="font-bold text-[#2a6ba7]">@akseslegal.id</span> untuk
                                        mendapatkan informasi terbaru mengenai regulasi, tips bisnis, dan
                                        promo layanan legalitas eksklusif.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href="https://www.instagram.com/akseslegal.id"
                                        target="_blank"
                                        className="inline-flex items-center justify-center gap-3 h-14 px-8 bg-[#2a6ba7] text-white font-bold rounded-2xl shadow-xl shadow-[#2a6ba7]/20 hover:shadow-[#2a6ba7]/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
                                    >
                                        <Image
                                            src="/images/aligram.jpg"
                                            alt="Instagram"
                                            width={24}
                                            height={24}
                                            className="rounded-lg group-hover:rotate-12 transition-transform duration-300"
                                        />
                                        Follow Sekarang
                                    </Link>
                                </div>
                            </div>

                            {/* Instagram Card Mockup */}
                            <div className="relative max-w-sm mx-auto w-full group">
                                {/* Decorative Blob */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#f3b444] to-[#2a6ba7] rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

                                {/* Card Container */}
                                <div className="relative bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100">
                                    {/* Profile Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative shrink-0">
                                            {/* Ring Gradient */}
                                            <div className="size-16 rounded-full bg-gradient-to-r from-[#f3b444] to-[#2a6ba7] p-[3px]">
                                                <div className="bg-white rounded-full w-full h-full p-1">
                                                    <Image
                                                        src="/images/aligram.jpg"
                                                        alt="Profile"
                                                        width={56}
                                                        height={56}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-gray-900">akseslegal.id</h3>
                                                <span
                                                    className="material-symbols-outlined text-[#2a6ba7]"
                                                    style={{ fontSize: "16px" }}
                                                >
                                                    verified
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Layanan Legal &amp; Hukum
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                Solusi legalitas bisnis terpercaya.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feed Preview Mockup */}
                                    <div className="grid grid-cols-3 gap-2 mb-6">
                                        {instagramImages.map((img, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative"
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`Instagram post ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {index === 2 && (
                                                    <div className="absolute inset-0 bg-[#2a6ba7]/80 flex items-center justify-center text-white font-bold text-xs">
                                                        +100 Posts
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href="https://www.instagram.com/akseslegal.id"
                                        target="_blank"
                                        className="w-full flex items-center justify-center h-10 rounded-xl bg-[#f3b444] text-[#2a6ba7] text-sm font-black hover:bg-[#2a6ba7] hover:text-white transition-all"
                                    >
                                        Lihat Profil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-24 max-w-[1200px] mx-auto px-6 mb-10 md:mb-20">
                    <div className="bg-[#2a6ba7] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 text-center space-y-6 md:space-y-8 reveal-up">
                        <h2 className="text-2xl md:text-5xl font-black text-white leading-tight">
                            <span>Jadilah Bagian dari</span>{" "}
                            <br className="hidden md:block" />
                            <span>5,000+</span> <span>Bisnis yang Sukses Secara Legal</span>
                        </h2>
                        <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto">
                            Konsultasikan struktur bisnis terbaik Anda hari ini dengan tim ahli kami
                            secara gratis.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                            <Link
                                href="https://wa.me/6285333338818?text=Halo%20Akses%20Legal,%20saya%20ingin%20konsultasi%20gratis"
                                target="_blank"
                                className="h-14 md:h-16 px-8 md:px-10 bg-[#f3b444] text-[#2a6ba7] font-black text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                            >
                                Hubungi Kami Sekarang
                            </Link>
                            <Link
                                href="/layanan"
                                className="h-14 md:h-16 px-8 md:px-10 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center"
                            >
                                Lihat Layanan
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
