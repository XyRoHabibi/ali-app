"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const googleReviewsData = [
    {
        author_name: "Dimas Anggara",
        profile_photo_url: null,
        rating: 5,
        relative_time_description: "2 hari lalu",
        text: "Pelayanan sangat memuaskan! Mengurus PT Perorangan ternyata semudah itu lewat Akses Legal. Admin fast respon dan sangat edukatif menjelaskan detailnya. Dokumen selesai tepat waktu sesuai janji.",
        initial: "D",
        color: "bg-blue-500",
    },
    {
        author_name: "Sarah Wijaya",
        profile_photo_url: null,
        rating: 5,
        relative_time_description: "1 minggu lalu",
        text: "The best legal partner! Awalnya ragu karena online, tapi ternyata profesional banget. Dashboard monitoringnya sangat membantu buat tracking progres NIB. Sukses terus ALI!",
        initial: "S",
        color: "bg-purple-500",
    },
    {
        author_name: "Budi Santoso",
        profile_photo_url: null,
        rating: 5,
        relative_time_description: "3 minggu lalu",
        text: "Harga paling masuk akal dibanding biro jasa lain. Transparan di awal, gak ada biaya tambahan aneh-aneh. Recommended buat UMKM yang mau naik kelas.",
        initial: "B",
        color: "bg-green-500",
    },
    {
        author_name: "Citra Lestari",
        profile_photo_url: null,
        rating: 5,
        relative_time_description: "1 bulan lalu",
        text: "Urus HAKI Brand lancar jaya. Tim legalnya sangat paham klasifikasi merek, jadi meminimalisir resiko ditolak DJKI. Terima kasih bantuannya!",
        initial: "C",
        color: "bg-orange-500",
    },
    {
        author_name: "Reza Rahardian",
        profile_photo_url: null,
        rating: 5,
        relative_time_description: "1 bulan lalu",
        text: "Sangat profesional. Konsultasi gratisnya daging banget, bukan sekadar jualan tapi kasih solusi buat struktur perusahaan saya. Mantap!",
        initial: "R",
        color: "bg-red-500",
    },
];

export default function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

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

    const updateSlider = () => {
        if (trackRef.current && trackRef.current.children[0]) {
            const cardWidth =
                (trackRef.current.children[0] as HTMLElement).offsetWidth + 24;
            trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    };

    useEffect(() => {
        updateSlider();
        window.addEventListener("resize", updateSlider);
        return () => window.removeEventListener("resize", updateSlider);
    }, [index]);

    const handleNext = () => {
        const visibleCards =
            typeof window !== "undefined" && window.innerWidth >= 1024
                ? 3
                : typeof window !== "undefined" && window.innerWidth >= 768
                    ? 2
                    : 1;
        const maxIndex = Math.max(0, googleReviewsData.length - visibleCards);
        setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const handlePrev = () => {
        const visibleCards =
            typeof window !== "undefined" && window.innerWidth >= 1024
                ? 3
                : typeof window !== "undefined" && window.innerWidth >= 768
                    ? 2
                    : 1;
        const maxIndex = Math.max(0, googleReviewsData.length - visibleCards);
        setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    return (
        <section
            id="testimoni"
            ref={sectionRef}
            className="py-24 bg-[#F9FAFB] overflow-hidden relative"
        >
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2a6ba7]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-[1200px] mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 reveal-up">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-2">
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="G"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                            />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Google Reviews
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                            Kata Mereka{" "}
                            <span className="text-[#2a6ba7]">Yang Sudah Legal?</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-gray-900">4.9</span>
                            <div className="flex flex-col">
                                <div className="flex text-[#fbbf24]">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="material-symbols-outlined fill-1 text-lg"
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Berdasarkan 250+ Ulasan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrev}
                            className="size-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 transition-all hover:bg-[#2a6ba7] hover:text-white hover:border-[#2a6ba7]"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button
                            onClick={handleNext}
                            className="size-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 transition-all hover:bg-[#2a6ba7] hover:text-white hover:border-[#2a6ba7]"
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-6 transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing py-4 px-1"
                    >
                        {googleReviewsData.map((review, i) => (
                            <div
                                key={i}
                                className="min-w-[350px] md:min-w-[400px] p-6 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col gap-4 group transition-transform hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`size-10 rounded-full ${review.color} text-white flex items-center justify-center font-bold text-lg`}
                                        >
                                            {review.initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {review.author_name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {review.relative_time_description}
                                            </p>
                                        </div>
                                    </div>
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                    />
                                </div>

                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <span
                                            key={j}
                                            className={`material-symbols-outlined text-[18px] ${j < review.rating
                                                ? "text-[#fbbf24] fill-1"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                    &quot;{review.text}&quot;
                                </p>

                                <div className="mt-auto pt-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-sm fill-1">
                                        verified
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Verified Review
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gradient overlays */}
                    <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
