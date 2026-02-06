"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const articles = [
    {
        href: "/blog/pt-vs-cv",
        image:
            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Regulasi 2024",
        title: "Perbedaan PT Biasa dan PT Perorangan di Tahun 2024",
        description:
            "Ketahui mana yang paling menguntungkan untuk skala bisnis Anda saat ini berdasarkan peraturan terbaru...",
    },
    {
        href: "/blog/oss-rba-2024",
        image:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Tips Pajak",
        title: "Panduan Lengkap Aktivasi EFIN untuk Perusahaan Baru",
        description:
            "Langkah mudah mengurus kewajiban perpajakan bisnis Anda tanpa harus ke kantor pajak...",
    },
    {
        href: "/blog/haki-brand",
        image:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Startup Kit",
        title: "Cara Melindungi Merek Dagang Agar Tidak Dicatut Kompetitor",
        description:
            "Pentingnya HAKI sebagai aset intangible yang bernilai miliaran di masa depan...",
    },
];

export default function BlogPreview() {
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
        <section ref={sectionRef} className="py-24 px-6 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 reveal-up">
                    <div className="max-w-xl space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                            Insight &{" "}
                            <span className="text-[#2a6ba7] italic">Edukasi Bisnis</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            Pelajari regulasi terbaru agar bisnis Anda tetap patuh dan
                            kompetitif.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[#2a6ba7] font-black hover:gap-4 transition-all pb-2 border-b-2 border-[#2a6ba7]/10 hover:border-[#2a6ba7]"
                    >
                        <span>Lihat Semua Artikel</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <Link
                            key={index}
                            href={article.href}
                            className="reveal-up group flex flex-col gap-6"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="aspect-[16/10] rounded-[2.5rem] bg-gray-100 overflow-hidden relative">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-[#2a6ba7] shadow-lg">
                                    {article.tag}
                                </div>
                            </div>
                            <div className="space-y-3 px-2">
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#2a6ba7] transition-colors line-clamp-2 leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
