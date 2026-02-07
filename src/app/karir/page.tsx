"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Stats data for hero
const heroStats = [
    { value: "20+", label: "Tim Member" },
    { value: "5+", label: "Tahun Growth" },
    { value: "100%", label: "Remote Friendly" },
    { value: "∞", label: "Peluang Belajar" },
];

// Benefits data
const benefits = [
    {
        id: 1,
        title: "Jenjang Karir Jelas",
        description: "Kami memiliki roadmap pengembangan karir yang transparan untuk setiap posisi.",
        icon: "trending_up",
        gradient: "from-[#2a6ba7] to-blue-600",
        hoverBorder: "hover:border-[#2a6ba7]",
        shadow: "shadow-[#2a6ba7]/30",
    },
    {
        id: 2,
        title: "Pelatihan Berkelanjutan",
        description: "Akses ke pelatihan, workshop, dan sertifikasi untuk meningkatkan skill Anda.",
        icon: "school",
        gradient: "from-[#f3b444] to-orange-500",
        hoverBorder: "hover:border-[#f3b444]",
        shadow: "shadow-[#f3b444]/30",
        iconColor: "text-[#2a6ba7]",
    },
    {
        id: 3,
        title: "Asuransi Kesehatan",
        description: "Perlindungan kesehatan komprehensif untuk Anda dan keluarga.",
        icon: "health_and_safety",
        gradient: "from-green-500 to-emerald-600",
        hoverBorder: "hover:border-green-500",
        shadow: "shadow-green-500/30",
    },
    {
        id: 4,
        title: "Fleksibilitas Kerja",
        description: "Work from anywhere dengan jadwal yang fleksibel sesuai kebutuhan.",
        icon: "home_work",
        gradient: "from-purple-500 to-violet-600",
        hoverBorder: "hover:border-purple-500",
        shadow: "shadow-purple-500/30",
    },
    {
        id: 5,
        title: "Tim yang Solid",
        description: "Bekerja dengan profesional passionate dari berbagai latar belakang.",
        icon: "diversity_3",
        gradient: "from-pink-500 to-rose-600",
        hoverBorder: "hover:border-pink-500",
        shadow: "shadow-pink-500/30",
    },
    {
        id: 6,
        title: "Bonus & Rewards",
        description: "Sistem bonus kompetitif berdasarkan performa dan pencapaian tim.",
        icon: "celebration",
        gradient: "from-cyan-500 to-teal-600",
        hoverBorder: "hover:border-cyan-500",
        shadow: "shadow-cyan-500/30",
    },
];

// Culture values
const cultureValues = [
    {
        id: 1,
        title: "Innovation First",
        description: "Ide-ide baru selalu disambut. Kami mendorong eksperimen dan pembelajaran.",
        icon: "lightbulb",
        bgColor: "bg-[#2a6ba7]/10",
        iconColor: "text-[#2a6ba7]",
    },
    {
        id: 2,
        title: "Collaboration",
        description: "Sukses adalah hasil kerja tim. Kami menghargai setiap kontribusi.",
        icon: "handshake",
        bgColor: "bg-[#f3b444]/10",
        iconColor: "text-[#f3b444]",
    },
    {
        id: 3,
        title: "Work-Life Balance",
        description: "Kami peduli kesejahteraan tim dengan kebijakan kerja yang fleksibel.",
        icon: "eco",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
    },
];

// Culture images
const cultureImages = [
    { src: "/images/foto0.jpg", alt: "Team collaboration" },
    { src: "/images/foto1.png", alt: "Office meeting" },
    { src: "/images/foto2.png", alt: "Working together" },
    { src: "/images/foto3.png", alt: "Team discussion" },
];

// Job positions
const jobPositions = [
    {
        id: 1,
        title: "Legal Consultant",
        type: "Full Time",
        typeColor: "bg-green-100 text-green-700",
        description: "Memberikan konsultasi dan pendampingan hukum kepada klien untuk berbagai kebutuhan legalitas bisnis.",
        location: "Jakarta / Remote",
        experience: "2+ Tahun",
        icon: "support_agent",
        gradient: "from-[#2a6ba7] to-blue-600",
        shadow: "shadow-[#2a6ba7]/30",
        whatsappMessage: "Halo%20Akses%20Legal,%20saya%20tertarik%20melamar%20posisi%20Legal%20Consultant",
    },
    {
        id: 2,
        title: "Digital Marketing Specialist",
        type: "Full Time",
        typeColor: "bg-green-100 text-green-700",
        description: "Mengembangkan dan mengeksekusi strategi pemasaran digital untuk meningkatkan brand awareness dan akuisisi klien.",
        location: "Jakarta / Remote",
        experience: "1+ Tahun",
        icon: "campaign",
        gradient: "from-[#f3b444] to-orange-500",
        shadow: "shadow-[#f3b444]/30",
        iconColor: "text-[#2a6ba7]",
        whatsappMessage: "Halo%20Akses%20Legal,%20saya%20tertarik%20melamar%20posisi%20Digital%20Marketing%20Specialist",
    },
    {
        id: 3,
        title: "Frontend Developer",
        type: "Full Time",
        typeColor: "bg-green-100 text-green-700",
        description: "Membangun dan memelihara aplikasi web yang responsif dan user-friendly menggunakan React/Vue.js.",
        location: "Remote",
        experience: "2+ Tahun",
        icon: "code",
        gradient: "from-purple-500 to-violet-600",
        shadow: "shadow-purple-500/30",
        whatsappMessage: "Halo%20Akses%20Legal,%20saya%20tertarik%20melamar%20posisi%20Frontend%20Developer",
    },
    {
        id: 4,
        title: "Customer Success Officer",
        type: "Part Time",
        typeColor: "bg-blue-100 text-blue-700",
        description: "Memastikan kepuasan klien dengan memberikan dukungan terbaik dan membangun hubungan jangka panjang.",
        location: "Jakarta",
        experience: "Fresh Graduate Welcome",
        icon: "headset_mic",
        gradient: "from-green-500 to-emerald-600",
        shadow: "shadow-green-500/30",
        whatsappMessage: "Halo%20Akses%20Legal,%20saya%20tertarik%20melamar%20posisi%20Customer%20Success%20Officer",
    },
];

export default function KarirPage() {
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
                {/* Hero Section */}
                <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#2a6ba7] via-[#1e5a8f] to-[#1a2c3d] text-white overflow-hidden px-6">
                    {/* Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#f3b444]/20 rounded-full blur-[100px] animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2a6ba7]/30 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8 reveal-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider">We&apos;re Hiring!</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
                                    Bangun Karir Impianmu
                                    <br />
                                    <span className="text-[#f3b444]">Bersama Kami</span>
                                </h1>

                                <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-lg">
                                    Bergabunglah dengan tim inovatif yang mengubah cara bisnis Indonesia mengurus legalitas. Kami mencari talenta terbaik untuk tumbuh bersama.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="#open-positions"
                                        className="group px-8 h-14 rounded-2xl bg-[#f3b444] text-[#2a6ba7] font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#f3b444]/30 hover:shadow-[#f3b444]/50 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <span>Lihat Lowongan</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                            arrow_downward
                                        </span>
                                    </Link>
                                    <Link
                                        href="#why-join"
                                        className="px-8 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300"
                                    >
                                        <span>Kenapa Bergabung?</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Hero Visual */}
                            <div
                                className="relative reveal-up hidden lg:block"
                                style={{ transitionDelay: "200ms" }}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#f3b444]/30 to-[#2a6ba7]/30 rounded-[3rem] blur-3xl"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-white/20">
                                        <div className="grid grid-cols-2 gap-6">
                                            {heroStats.map((stat, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-all"
                                                >
                                                    <p className="text-4xl font-black text-[#f3b444] mb-2">{stat.value}</p>
                                                    <p className="text-sm font-bold text-white/70">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Logo */}
                    <div className="absolute right-0 top-0 opacity-5 translate-x-1/4 -translate-y-1/4">
                        <Image
                            src="/images/logo-putih.png"
                            alt=""
                            width={600}
                            height={300}
                            className="w-[600px] h-auto"
                        />
                    </div>
                </section>

                {/* Why Join Us Section */}
                <section id="why-join" className="py-24 px-6 relative overflow-hidden">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-16 reveal-up">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                Kenapa <span className="text-gradient">Bergabung</span> dengan Kami?
                            </h2>
                            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                                Kami menawarkan lebih dari sekadar pekerjaan. Ini adalah kesempatan untuk bertumbuh dan membuat dampak nyata.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={benefit.id}
                                    className={`reveal-up benefit-card p-8 rounded-[2.5rem] bg-white border-2 border-transparent ${benefit.hoverBorder} shadow-xl transition-all group`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className={`benefit-icon size-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} ${benefit.iconColor || "text-white"} flex items-center justify-center mb-6 transition-transform shadow-lg ${benefit.shadow}`}
                                    >
                                        <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-black mb-3 text-gray-900">{benefit.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Culture Section */}
                <section className="py-24 bg-white px-6">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="reveal-up space-y-8">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a6ba7]/10 text-[#2a6ba7] text-xs font-bold uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                        Budaya Kami
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        Bekerja dengan <span className="text-[#2a6ba7]">Passion</span>,
                                        <br />
                                        Tumbuh Bersama
                                    </h2>
                                </div>

                                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                    Di Akses Legal Indonesia, kami percaya bahwa lingkungan kerja yang positif menghasilkan hasil terbaik. Kami mendorong kreativitas, kolaborasi, dan keseimbangan hidup-kerja.
                                </p>

                                <div className="space-y-6">
                                    {cultureValues.map((value) => (
                                        <div key={value.id} className="flex items-start gap-4">
                                            <div
                                                className={`size-12 shrink-0 rounded-xl ${value.bgColor} ${value.iconColor} flex items-center justify-center`}
                                            >
                                                <span className="material-symbols-outlined">{value.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 mb-1">{value.title}</h4>
                                                <p className="text-sm text-gray-500">{value.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="reveal-up grid grid-cols-2 gap-4"
                                style={{ transitionDelay: "200ms" }}
                            >
                                {cultureImages.map((img, index) => (
                                    <div key={index} className={index % 2 === 1 ? "mt-8" : ""}>
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            width={300}
                                            height={300}
                                            className="rounded-[2rem] shadow-xl w-full aspect-square object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions Section */}
                <section id="open-positions" className="py-24 px-6 relative">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-16 reveal-up">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                Posisi <span className="text-gradient">Tersedia</span>
                            </h2>
                            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                                Temukan peran yang sesuai dengan passion dan keahlian Anda
                            </p>
                        </div>

                        <div className="space-y-6">
                            {jobPositions.map((job, index) => (
                                <div
                                    key={job.id}
                                    className="reveal-up job-card bg-white rounded-[2rem] p-8 border border-gray-100 shadow-lg"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-start gap-6">
                                            <div
                                                className={`size-16 shrink-0 rounded-2xl bg-gradient-to-br ${job.gradient} ${job.iconColor || "text-white"} flex items-center justify-center shadow-lg ${job.shadow}`}
                                            >
                                                <span className="material-symbols-outlined text-2xl">{job.icon}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-black text-gray-900">{job.title}</h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full ${job.typeColor} text-xs font-bold`}
                                                    >
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm font-medium">{job.description}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">location_on</span>
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">work</span>
                                                        {job.experience}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`https://wa.me/6285333338818?text=${job.whatsappMessage}`}
                                            target="_blank"
                                            className="shrink-0 px-8 h-12 rounded-xl bg-[#2a6ba7] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#2a6ba7]/90 hover:shadow-xl hover:shadow-[#2a6ba7]/30 transition-all group"
                                        >
                                            Lamar Sekarang
                                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                                                arrow_forward
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-24 max-w-[1200px] mx-auto px-6 mb-10 md:mb-20">
                    <div className="bg-gradient-to-br from-[#2a6ba7] via-[#1e5a8f] to-[#1a2c3d] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 text-center space-y-6 md:space-y-8 reveal-up relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                Tidak Menemukan Posisi yang Sesuai?
                            </span>

                            <h2 className="text-2xl md:text-5xl font-black text-white leading-tight">
                                Kirimkan CV Anda
                                <br className="hidden md:block" />
                                <span className="text-[#f3b444]">Untuk Peluang Mendatang</span>
                            </h2>
                            <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto mt-4">
                                Kami selalu mencari talenta terbaik. Kirimkan CV Anda dan kami akan menghubungi Anda jika ada posisi yang sesuai.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mt-8">
                                <Link
                                    href="mailto:career@akseslegal.id"
                                    className="h-14 md:h-16 px-8 md:px-10 bg-[#f3b444] text-[#2a6ba7] font-black text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">mail</span>
                                    Kirim CV via Email
                                </Link>
                                <Link
                                    href="https://wa.me/6285333338818?text=Halo%20Akses%20Legal,%20saya%20ingin%20mengirimkan%20CV%20untuk%20peluang%20karir"
                                    target="_blank"
                                    className="h-14 md:h-16 px-8 md:px-10 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat via WhatsApp
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
