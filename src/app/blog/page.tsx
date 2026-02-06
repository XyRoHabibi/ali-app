"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Featured articles for carousel
const featuredArticles = [
    {
        id: 1,
        slug: "oss-rba-2024",
        title: "Perubahan Regulasi OSS RBA 2024: Apa yang Harus Diketahui Pelaku Bisnis?",
        category: "Legal Update",
        date: "15 Jan 2024",
        author: "Admin ALI",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        slug: "pt-vs-cv",
        title: "Panduan Lengkap Memilih Antara PT Perorangan atau CV",
        category: "Tips Bisnis",
        date: "10 Jan 2024",
        author: "Admin ALI",
        image: "https://images.unsplash.com/photo-1450175804616-78ff2360eb39?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        slug: "haki-brand",
        title: "Kenapa Brand Anda Harus Didaftarkan HAKI Sejak Dini?",
        category: "HAKI",
        date: "8 Jan 2024",
        author: "Admin ALI",
        image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80",
    },
];

// All blog articles
const allArticles = [
    {
        id: 1,
        slug: "pt-vs-cv",
        title: "Panduan Lengkap Memilih Antara PT Perorangan atau CV",
        category: "pendirian",
        categoryLabel: "Tips Bisnis",
        excerpt: "Ketahui perbedaan mendasar dan keuntungan masing-masing badan usaha untuk skala bisnis Anda.",
        image: "https://images.unsplash.com/photo-1450175804616-78ff2360eb39?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        slug: "haki-brand",
        title: "Kenapa Brand Anda Harus Didaftarkan HAKI Sejak Dini?",
        category: "lainnya",
        categoryLabel: "HAKI",
        excerpt: "Perlindungan aset tak berwujud sangat krusial untuk mencegah plagiarisme di masa depan.",
        image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        slug: "halal-gratis",
        title: "Cara Mengurus Sertifikasi Halal Gratis (Self Declare) untuk UMK",
        category: "perizinan",
        categoryLabel: "Sertifikasi",
        excerpt: "Langkah demi langkah mendaftarkan produk kuliner Anda melalui skema Sertifikasi Halal Gratis.",
        image: "https://images.unsplash.com/photo-1434626958693-3941b2623bd1?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        slug: "nib-wajib",
        title: "NIB Wajib untuk Semua Pelaku Usaha: Ketentuan dan Cara Daftar",
        category: "perizinan",
        categoryLabel: "Regulasi",
        excerpt: "Nomor Induk Berusaha kini mandatory. Simak syarat dan prosedur pendaftaran NIB secara online.",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        slug: "akta-notaris",
        title: "Kapan Perlu Akta Notaris untuk Pendirian Badan Usaha?",
        category: "pendirian",
        categoryLabel: "Pendirian",
        excerpt: "PT dan CV punya ketentuan beda. Pelajari kapan wajib notaris dan kapan bisa pakai akta di bawah tangan.",
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        slug: "pirt-mbr",
        title: "PIRT dan Sertifikasi MBR: Perbedaan dan Manfaat untuk UKM",
        category: "perizinan",
        categoryLabel: "Sertifikasi",
        excerpt: "Agar produk pangan legal dijual, pahami beda PIRT, Halal, dan skema MBR serta alur pengurusannya.",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 7,
        slug: "izin-edar",
        title: "Izin Edar BPOM vs PIRT: Pilih yang Mana untuk Produk Anda?",
        category: "perizinan",
        categoryLabel: "Regulasi",
        excerpt: "Kriteria produk yang harus BPOM dan yang cukup PIRT, plus tips percepat proses pengajuan.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 8,
        slug: "uu-umkm",
        title: "UU UMKM Terbaru: Hak dan Kewajiban yang Perlu Anda Tahu",
        category: "lainnya",
        categoryLabel: "Legal Update",
        excerpt: "Ringkasan perubahan UU UMKM dan dampaknya bagi pelaku usaha mikro, kecil, dan menengah.",
        image: "https://images.unsplash.com/photo-1556761175-b413da2bafaa?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 9,
        slug: "merek-dagang",
        title: "Daftar Merek Dagang Sendiri vs Pakai Konsultan: Mana Lebih Efisien?",
        category: "lainnya",
        categoryLabel: "HAKI",
        excerpt: "Perbandingan biaya, waktu, dan risiko saat daftar merek mandiri vs melalui konsultan HKI.",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 10,
        slug: "oss-rba-2024",
        title: "Perubahan Regulasi OSS RBA 2024: Apa yang Harus Diketahui Pelaku Bisnis?",
        category: "perizinan",
        categoryLabel: "Legal Update",
        excerpt: "Ringkasan update OSS RBA dan dampaknya bagi pendirian usaha serta perizinan berusaha.",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 11,
        slug: "syarat-pt",
        title: "Syarat dan Dokumen Pendirian PT Perorangan yang Perlu Disiapkan",
        category: "pendirian",
        categoryLabel: "Pendirian",
        excerpt: "Checklist lengkap dokumen serta persyaratan sebelum mengajukan pendirian PT perorangan.",
        image: "https://images.unsplash.com/photo-1486406146926-c888a6c2c0b0?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 12,
        slug: "cv-pt-beda",
        title: "Kapan Pindah dari CV ke PT? Pertimbangan dan Prosedur Konversi",
        category: "pendirian",
        categoryLabel: "Tips Bisnis",
        excerpt: "Kapan bisnis Anda siap naik kelas ke PT dan langkah konversi CV ke PT yang perlu Anda ketahui.",
        image: "https://images.unsplash.com/photo-1497366216544-37526070297c?auto=format&fit=crop&w=600&q=80",
    },
];

// Categories for filter
const categories = [
    { id: "semua", label: "Semua" },
    { id: "pendirian", label: "Pendirian" },
    { id: "perizinan", label: "Perizinan" },
];

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeCategory, setActiveCategory] = useState("semua");
    const [currentPage, setCurrentPage] = useState(1);
    const sectionRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<NodeJS.Timeout | null>(null);

    // Reveal animation
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

    // Featured carousel auto-scroll
    useEffect(() => {
        const startCarousel = () => {
            carouselRef.current = setInterval(() => {
                setActiveSlide((prev) => (prev + 1) % featuredArticles.length);
            }, 5500);
        };

        startCarousel();

        return () => {
            if (carouselRef.current) {
                clearInterval(carouselRef.current);
            }
        };
    }, []);

    // Handle slide change
    const goToSlide = (index: number) => {
        setActiveSlide(index);
        // Reset interval
        if (carouselRef.current) {
            clearInterval(carouselRef.current);
        }
        carouselRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % featuredArticles.length);
        }, 5500);
    };

    // Filter articles by category
    const filteredArticles =
        activeCategory === "semua"
            ? allArticles
            : allArticles.filter((a) => a.category === activeCategory);

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handle category change
    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to blog grid
            document.getElementById("blog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div ref={sectionRef}>
            <main className="max-w-[1200px] mx-auto px-6 py-20">
                {/* Blog Header */}
                <div className="reveal-up space-y-4 md:space-y-6 mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight">
                        Insight &amp;
                        <br />
                        <span className="text-[#2a6ba7]">Edukasi Legalitas</span>
                    </h1>
                    <p className="text-base md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                        Update terbaru mengenai regulasi bisnis, tips legalitas UMK, dan panduan
                        hukum praktis untuk pertumbuhan usaha Anda.
                    </p>
                </div>

                {/* Featured Article Carousel */}
                <div className="reveal-up mb-12 md:mb-20">
                    <div className="relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl aspect-video md:aspect-[21/9]">
                        {featuredArticles.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className={`featured-slide group block absolute inset-0 transition-opacity duration-800 ${index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
                                    <div className="space-y-2 md:space-y-4 max-w-2xl">
                                        <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#f3b444] text-[#2a6ba7] text-[10px] md:text-xs font-black uppercase tracking-widest">
                                            {article.category}
                                        </span>
                                        <h2 className="text-xl md:text-4xl font-black text-white leading-tight">
                                            {article.title}
                                        </h2>
                                        <div className="flex items-center gap-4 md:gap-6 text-white/60 text-[10px] md:text-sm font-bold">
                                            <span className="flex items-center gap-1 md:gap-2">
                                                <span className="material-symbols-outlined text-xs md:text-sm">
                                                    schedule
                                                </span>
                                                {article.date}
                                            </span>
                                            <span className="flex items-center gap-1 md:gap-2">
                                                <span className="material-symbols-outlined text-xs md:text-sm">
                                                    person
                                                </span>
                                                {article.author}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-2 text-[#f3b444] font-black group-hover:gap-4 transition-all pt-2 md:pt-4 text-sm md:text-base">
                                            Baca Selengkapnya{" "}
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Carousel dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {featuredArticles.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                className={`size-2.5 rounded-full transition-all ${index === activeSlide
                                        ? "bg-[#2a6ba7]"
                                        : "bg-[#2a6ba7]/40 hover:bg-[#2a6ba7]/70"
                                    }`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div id="blog-grid" className="flex flex-wrap gap-2 mb-8 reveal-up">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${activeCategory === cat.id
                                    ? "bg-[#2a6ba7] text-white"
                                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#2a6ba7]/50 hover:text-[#2a6ba7]"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {paginatedArticles.map((article, index) => (
                        <Link
                            key={article.id}
                            href={`/blog/${article.slug}`}
                            className="blog-card reveal-up group"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-lg">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="space-y-4">
                                <span className="text-xs font-black text-[#2a6ba7] uppercase tracking-widest">
                                    {article.categoryLabel}
                                </span>
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#2a6ba7] transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-2 reveal-up flex-wrap">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="size-12 rounded-xl bg-white border border-gray-100 font-bold flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            aria-label="Halaman sebelumnya"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`size-12 rounded-xl font-bold flex items-center justify-center transition-colors ${currentPage === page
                                        ? "bg-[#2a6ba7] text-white"
                                        : "bg-white border border-gray-100 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="size-12 rounded-xl bg-white border border-gray-100 font-bold flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            aria-label="Halaman berikutnya"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
